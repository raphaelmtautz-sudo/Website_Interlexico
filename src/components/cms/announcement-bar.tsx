import Link from "next/link";
import type { AnnouncementData } from "@/lib/cms";

/** Hinweisleiste aus dem CMS (Global „Hinweisleiste“). */
export function AnnouncementBar({ data }: { data: AnnouncementData | null }) {
  if (!data) return null;
  const cls = data.tone === "highlight" ? "bg-brand text-ink" : "bg-ink-raised text-paper border-b border-line";
  return (
    <div role="region" aria-label="Hinweis" className={`${cls} px-6 py-2 text-center font-sans text-sm`}>
      <span>{data.text}</span>
      {data.link ? (
        <>
          {" "}
          {data.link.href.startsWith("http") ? (
            <a href={data.link.href} className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">{data.link.label}</a>
          ) : (
            <Link href={data.link.href} className="underline underline-offset-2">{data.link.label}</Link>
          )}
        </>
      ) : null}
    </div>
  );
}
