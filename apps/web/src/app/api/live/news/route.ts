import { newsEvents } from "../../../../lib/data";

export const dynamic = "force-dynamic";

type GNewsArticle = {
  title?: string;
  description?: string;
  url?: string;
  source?: { name?: string };
  publishedAt?: string;
};

export async function GET() {
  const gnewsKey = process.env.GNEWS_API_KEY;

  if (gnewsKey) {
    const url = new URL("https://gnews.io/api/v4/search");
    url.searchParams.set("q", "prop firm OR funded trader OR broker payout OR forex spreads");
    url.searchParams.set("lang", "en");
    url.searchParams.set("max", "10");
    url.searchParams.set("apikey", gnewsKey);

    const response = await fetch(url, { next: { revalidate: 300 } });
    if (response.ok) {
      const payload = (await response.json()) as { articles?: GNewsArticle[] };
      return Response.json({
        ok: true,
        source: "GNews",
        live: true,
        articles:
          payload.articles?.map((article) => ({
            title: article.title,
            summary: article.description,
            url: article.url,
            sourceName: article.source?.name,
            publishedAt: article.publishedAt
          })) ?? []
      });
    }
  }

  return Response.json({
    ok: true,
    source: "FundedScope News Radar",
    live: false,
    message: "Showing curated FundedScope market radar items. Provider-backed ingestion appears when verified.",
    articles: newsEvents.map((event) => ({
      title: event.title,
      impact: event.impact,
      publishedAt: event.time,
      url: event.href
    }))
  });
}
