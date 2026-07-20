import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ZodError } from "zod";
import { env } from "./shared/env";
import { HttpError } from "./shared/http";
import { prisma } from "./shared/prisma";
import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { traderProfileRouter } from "./modules/trader-profile/trader-profile.routes";
import { firmsRouter } from "./modules/firms/firms.routes";
import { brokersRouter } from "./modules/brokers/brokers.routes";
import { compareRouter } from "./modules/compare/compare.routes";
import { spreadsRouter } from "./modules/spreads/spreads.routes";
import { newsRouter } from "./modules/news/news.routes";
import { alertsRouter } from "./modules/alerts/alerts.routes";
import { reviewsRouter } from "./modules/reviews/reviews.routes";
import { billingRouter } from "./modules/billing/billing.routes";
import { toolsRouter } from "./modules/tools/tools.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { persistenceRouter } from "./modules/persistence/persistence.routes";

const app = express();
const apiVersion = env.API_VERSION ?? process.env.npm_package_version ?? "0.1.0";
const allowedCorsOrigins = new Set([
  env.FRONTEND_URL,
  "https://myfundedscope.com",
  "https://www.myfundedscope.com",
  ...(env.CORS_ORIGINS ? env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean) : []),
  ...(env.NODE_ENV === "production" ? [] : ["http://localhost:3000"])
].filter(Boolean));

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedCorsOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false
  })
);

async function healthHandler(_req: express.Request, res: express.Response) {
  let database: "ok" | "unavailable" = "ok";
  let statusCode = 200;

  try {
    await prisma.$queryRaw`select 1`;
  } catch {
    database = "unavailable";
    statusCode = 503;
  }

  res.status(statusCode).json({
    status: database === "ok" ? "ok" : "degraded",
    environment: env.NODE_ENV,
    version: apiVersion,
    database,
    timestamp: new Date().toISOString()
  });
}

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/trader-profile", traderProfileRouter);
app.use("/api/firms", firmsRouter);
app.use("/api/brokers", brokersRouter);
app.use("/api/compare", compareRouter);
app.use("/api/spreads", spreadsRouter);
app.use("/api/news", newsRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/billing", billingRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/persistence", persistenceRouter);
app.use("/api/admin", adminRouter);

app.use((_req, _res, next) => {
  next(new HttpError(404, "Route not found"));
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      error: "Validation error",
      details: error.flatten()
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      ok: false,
      error: error.message,
      details: error.details
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    console.error(error instanceof Error ? error.message : "Unhandled API error");
  }
  return res.status(500).json({
    ok: false,
    error: "Internal server error"
  });
});

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`FundedScope API running on 0.0.0.0:${env.PORT}`);
});
