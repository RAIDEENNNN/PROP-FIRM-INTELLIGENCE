import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassCard } from "../../../components/GlassCard";
import { JsonLd } from "../../../components/JsonLd";
import { articleUrl, brandArticles, getArticle } from "../../../lib/articles";
import { brand } from "../../../lib/brand";

export function generateStaticParams() {
  return brandArticles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};

  return {
    title: `${article.title} | MyFundedScope`,
    description: article.description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/articles/${article.slug}`,
      siteName: "MyFundedScope",
      type: "article",
      publishedTime: article.publishedAt,
      images: [brand.logoPath]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [brand.logoPath]
    }
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: articleUrl(article.slug),
    image: brand.logoUrl,
    author: {
      "@type": "Organization",
      name: brand.companyName,
      url: brand.url
    },
    publisher: {
      "@type": "Organization",
      name: brand.companyName,
      logo: {
        "@type": "ImageObject",
        url: brand.logoUrl
      }
    }
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: brand.url },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${brand.url}/articles` },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl(article.slug) }
    ]
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-5 sm:py-12">
      <JsonLd id={`${article.slug}-article-jsonld`} data={articleJsonLd} />
      <JsonLd id={`${article.slug}-breadcrumb-jsonld`} data={breadcrumbJsonLd} />
      <Link href="/articles" className="text-sm font-bold text-electric">
        ← Articles
      </Link>
      <p className="mt-8 text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">MyFundedScope</p>
      <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">{article.title}</h1>
      <p className="mt-4 text-sm text-slate-500">
        Published {article.publishedAt} · {article.readingTime}
      </p>
      <GlassCard className="mt-8">
        <p className="text-lg leading-8 text-slate-300">{article.description}</p>
      </GlassCard>
      <article className="mt-6 space-y-5">
        {article.sections.map((section) => (
          <GlassCard key={section.heading}>
            <h2 className="text-2xl font-black text-white">{section.heading}</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">{section.body}</p>
          </GlassCard>
        ))}
      </article>
      <GlassCard className="mt-6 glow-border">
        <h2 className="text-2xl font-black text-white">What to do next</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Explore FundedScope to compare prop firms, understand scoring, check spreads and start building My Trading DNA.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/prop-firms" className="rounded-full bg-white px-5 py-3 text-center text-sm font-black text-void">
            Compare prop firms
          </Link>
          <Link href="/profile" className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-black text-white">
            Build My Trading DNA
          </Link>
        </div>
      </GlassCard>
    </main>
  );
}
