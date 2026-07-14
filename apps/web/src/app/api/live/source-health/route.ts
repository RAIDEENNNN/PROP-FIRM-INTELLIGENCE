import { liveSources } from "../../../../lib/live-sources";

export const dynamic = "force-dynamic";

export function GET() {
  const sources = liveSources.map((source) => {
    const configuredKeys = source.envKeys.filter((key) => Boolean(process.env[key]));
    const configured = source.envKeys.length === 0 || configuredKeys.length === source.envKeys.length;

    return {
      ...source,
      configured,
      configuredKeys,
      missingKeys: source.envKeys.filter((key) => !process.env[key])
    };
  });

  return Response.json({
    ok: true,
    mode: "production",
    message: "FundedScope source registry is online. Provider-backed feeds are shown only when configured and verified.",
    sources
  });
}
