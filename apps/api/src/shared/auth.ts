import type { NextFunction, Request, Response } from "express";
import { createPublicKey, type KeyObject } from "crypto";
import jwt from "jsonwebtoken";
import { env } from "./env";
import { HttpError } from "./http";
import { prisma } from "./prisma";

export type TokenPayload = {
  sub: string;
  email: string;
  role: string;
};

type SupabaseJwtPayload = {
  sub: string;
  email?: string;
  aud?: string;
  iss?: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
  };
};

export type AuthenticatedRequest = Request & {
  user?: TokenPayload;
};

type JsonWebKey = {
  kid?: string;
  kty: string;
  alg?: string;
  use?: string;
  n?: string;
  e?: string;
  crv?: string;
  x?: string;
  y?: string;
  x5c?: string[];
};

let jwksCache: { fetchedAt: number; keys: JsonWebKey[] } | undefined;
const jwksCacheMs = 10 * 60 * 1000;

function supabaseIssuer() {
  if (env.SUPABASE_JWT_ISSUER) return env.SUPABASE_JWT_ISSUER.replace(/\/$/, "");
  if (!env.SUPABASE_URL) return undefined;
  return `${env.SUPABASE_URL.replace(/\/$/, "")}/auth/v1`;
}

function supabaseJwksUrl() {
  if (env.SUPABASE_JWKS_URL) return env.SUPABASE_JWKS_URL;
  const issuer = supabaseIssuer();
  return issuer ? `${issuer}/.well-known/jwks.json` : undefined;
}

async function getJwks() {
  const jwksUrl = supabaseJwksUrl();
  if (!jwksUrl) return [];
  if (jwksCache && Date.now() - jwksCache.fetchedAt < jwksCacheMs) return jwksCache.keys;

  const response = await fetch(jwksUrl, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Unable to fetch Supabase JWKS: ${response.status}`);
  const payload = (await response.json()) as { keys?: JsonWebKey[] };
  jwksCache = { fetchedAt: Date.now(), keys: payload.keys ?? [] };
  return jwksCache.keys;
}

function keyObjectFromJwk(key: JsonWebKey): KeyObject | string {
  if (key.x5c?.[0]) {
    return `-----BEGIN CERTIFICATE-----\n${key.x5c[0].match(/.{1,64}/g)?.join("\n")}\n-----END CERTIFICATE-----`;
  }

  return createPublicKey({ key: key as JsonWebKey, format: "jwk" });
}

async function verifySupabaseJwksToken(token: string) {
  const decoded = jwt.decode(token, { complete: true }) as { header?: jwt.JwtHeader } | null;
  const kid = decoded?.header?.kid;
  const alg = decoded?.header?.alg;
  if (!kid || !alg || alg === "HS256") throw new Error("Token does not use a JWKS-compatible signing key");

  const keys = await getJwks();
  const jwk = keys.find((key) => key.kid === kid);
  if (!jwk) throw new Error("Matching Supabase JWKS key not found");

  return jwt.verify(token, keyObjectFromJwk(jwk), {
    algorithms: ["RS256", "ES256"],
    issuer: supabaseIssuer(),
    audience: "authenticated"
  }) as SupabaseJwtPayload;
}

export function publicUser(user: {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  subscriptionStatus?: string | null;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    subscriptionStatus: user.subscriptionStatus ?? "FREE",
    emailVerified: Boolean(user.emailVerifiedAt),
    createdAt: user.createdAt
  };
}

function normalizeRole(role: string | null | undefined) {
  const value = String(role ?? "").toLowerCase();
  if (value === "super_admin" || value === "super-admin" || value === "superadmin") return "SUPER_ADMIN";
  if (value === "admin") return "ADMIN";
  if (value === "editor") return "ADMIN";
  if (value === "pro") return "PRO";
  return "TRADER";
}

async function getSupabaseProfileRole(userId: string) {
  try {
    const rows = await prisma.$queryRaw<Array<{ role: string | null }>>`
      select account_role as role
      from public.profiles
      where id::text = ${userId}
      limit 1
    `;
    return normalizeRole(rows[0]?.role);
  } catch {
    return "TRADER";
  }
}

async function getSupabaseProfile(userId: string) {
  const rows = await prisma.$queryRaw<Array<{ role: string | null; email: string | null }>>`
    select account_role as role, email
    from public.profiles
    where id::text = ${userId}
    limit 1
  `;
  return rows[0] ?? null;
}

export async function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) return next(new HttpError(401, "Missing bearer token"));

  try {
    if (!env.JWT_ACCESS_SECRET) throw new Error("Legacy JWT auth is not configured");
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return next(new HttpError(401, "Profile no longer exists"));

    req.user = { sub: user.id, email: user.email ?? payload.email, role: user.role };
    return next();
  } catch {
    if (!env.SUPABASE_JWT_SECRET && !supabaseJwksUrl()) {
      return next(new HttpError(401, "Invalid or expired token"));
    }
  }

  try {
    let payload: SupabaseJwtPayload | undefined;
    if (supabaseJwksUrl()) {
      try {
        payload = await verifySupabaseJwksToken(token);
      } catch (error) {
        if (!env.SUPABASE_JWT_SECRET) throw error;
      }
    }

    if (!payload && env.SUPABASE_JWT_SECRET) {
      payload = jwt.verify(token, env.SUPABASE_JWT_SECRET) as SupabaseJwtPayload;
    }

    if (!payload) return next(new HttpError(401, "Invalid or expired token"));
    if (!payload.sub || !payload.email) return next(new HttpError(401, "Invalid Supabase token"));
    const profile = await getSupabaseProfile(payload.sub);
    const role = normalizeRole(profile?.role);

    req.user = { sub: payload.sub, email: (profile?.email ?? payload.email).toLowerCase(), role };
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
}

export async function requireAdmin(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  try {
    const role = normalizeRole(await getSupabaseProfileRole(req.user?.sub ?? ""));
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return next(new HttpError(403, "Admin access required"));
    }

    req.user = req.user ? { ...req.user, role } : req.user;
    return next();
  } catch {
    return next(new HttpError(403, "Admin access required"));
  }
}
