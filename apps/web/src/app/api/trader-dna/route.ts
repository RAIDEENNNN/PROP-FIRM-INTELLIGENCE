import { readinessLabel, traderDnaProfile } from "../../../lib/trader-dna";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    profile: traderDnaProfile,
    readiness: {
      score: traderDnaProfile.readinessScore,
      label: readinessLabel(traderDnaProfile.readinessScore),
      rule: "Readiness combines recent journal behavior, loss streak, news risk, emotional state, sleep/energy and whether the trader has a written plan."
    },
    memoryAdvantage:
      "A competitor can copy comparison pages, but it cannot instantly recreate a trader's personal trading history, patterns, mistakes and improvement path."
  });
}
