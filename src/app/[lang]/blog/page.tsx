import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { getPosts, getSiteSettings } from "@/lib/cms";
import { hasLocale, lh, type Locale } from "@/lib/i18n";

const t: Record<Locale, { eyebrow: string; title: string; empty: string }> = {
  de: { eyebrow: "Aktuelles", title: "Blog", empty: "Noch keine Artikel veröffentlicht." },
  en: { eyebrow: "Latest", title: "Blog", empty: "No articles published yet." },
  es: { eyebrow: "Actualidad", title: "Blog", empty: "Aún no hay artículos publicados." },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: t[lang].title,
    alternates: { canonical: lh(lang, "/blog") },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { blogEnabled } = await getSiteSettings();
  if (!blogEnabled) notFound();
  const posts = await getPosts(lang);

  return (
    <Section className="pt-24 lg:pt-32">
      <Eyebrow>{t[lang].eyebrow}</Eyebrow>
      <h1 className="kinetic font-display text-5xl mb-12 text-balance sm:text-6xl">{t[lang].title}</h1>

      {posts.length === 0 ? (
        <p className="font-sans text-paper-dim">{t[lang].empty}</p>
      ) : (
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={lh(lang, `/blog/${post.slug}`)}
              className="group flex flex-col bg-ink-raised p-6 transition-colors hover:bg-ink"
            >
              {post.featuredImageUrl && (
                <Image
                  src={post.featuredImageUrl}
                  alt=""
                  width={400}
                  height={225}
                  className="mb-4 aspect-video w-full rounded object-cover"
                />
              )}
              <h2 className="font-display text-xl text-paper mb-2 text-balance group-hover:underline">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="font-sans text-sm leading-relaxed text-paper-dim">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}
