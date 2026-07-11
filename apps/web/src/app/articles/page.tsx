import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "../../components/GlassCard";
import { JsonLd } from "../../components/JsonLd";
import { brand } from "../../lib/brand";
import { articleUrl, brandArticles } from "../../lib/articles";

export const metadata: Metadata = {
  title: "MyFundedScope Articles | Trading Intelligence Company Updates",
  description: "Read MyFundedScope articles about FundedScope, trading intelligence, prop firm comparison, broker research and personal Trading DNA.",
  alternates: { canonical: "/articles" },
  openGraph: {
    title: "MyFundedScope Articles",
    description: "Company updates and trading intelligence articles from MyFundedScope.",
    url: "/articles",
    siteName: "MyFundedScope",
    type: "website",
    images: [brand.logoPath]
  },
  twitter: {
    card: "summary_large_image",
    title: "MyFundedScope Articles",
    description: "Company updates and trading intelligence articles from MyFundedScope.",
    images: [brand.logoPath]
  }
};

export default function ArticlesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MyFundedScope Articles",
    url: `${brand.url}/articles`,
    itemListElement: brandArticles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: article.title,
        description: article.description,
        url: articleUrl(article.slug),
        datePublished: article.publishedAt,
        author: { "@type": "Organization", name: brand.companyName },
        publisher: {
          "@type": "Organization",
          name: brand.companyName,
          logo: { "@type": "ImageObject", url: brand.logoUrl }
        }
      }
    }))
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <JsonLd id="articles-itemlist-jsonld" data={itemListJsonLd} />
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">MyFundedScope articles</p>
      <h1 className="mt-3 max-w-4xl text-3xl font-black text-white sm:text-5xl">Teaching Google and traders what MyFundedScope means.</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
        Company updates and trading intelligence essays that explain why MyFundedScope exists and how FundedScope helps traders make better decisions.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {brandArticles.map((article) => (
          <GlassCard key={article.slug}>
            <p className="text-xs uppercase tracking-[0.24em] text-electric">{article.readingTime}</p>
            <h2 className="mt-3 text-2xl font-black text-white">{article.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{article.description}</p>
            <Link href={`/articles/${article.slug}`} className="mt-5 inline-block rounded-full bg-white px-5 py-3 text-sm font-black text-void">
              Read article
            </Link>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}

