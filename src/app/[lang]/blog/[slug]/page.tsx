import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { getPost, getSiteSettings } from "@/lib/cms";
import { renderLexical } from "@/lib/lexical-render";
import { hasLocale, lh } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const post = await getPost(slug, lang);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const url = lh(lang, `/blog/${slug}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: post.ogImageUrl ? [{ url: post.ogImageUrl }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const { blogEnabled } = await getSiteSettings();
  if (!blogEnabled) notFound();
  const post = await getPost(slug, lang);
  if (!post) notFound();

  return (
    <Section className="pt-24 lg:pt-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="kinetic font-display text-4xl mb-6 text-balance sm:text-5xl">{post.title}</h1>
        {post.featuredImageUrl && (
          <Image
            src={post.featuredImageUrl}
            alt=""
            width={1200}
            height={630}
            className="mb-10 w-full rounded object-cover"
            priority
          />
        )}
        <div className="space-y-6">{renderLexical(post.content)}</div>
      </div>
    </Section>
  );
}
