import type { TeamMember } from "@/lib/cms";
import { getCmsLabels } from "@/content/cms-labels";
import type { Locale } from "@/lib/i18n";

/** Personenkarten (Über uns, Kurs- und Leistungsseiten). Rendert nichts ohne Personen. */
export function TeamGrid({ members, lang }: { members: TeamMember[]; lang: Locale }) {
  if (!members.length) return null;
  const t = getCmsLabels(lang);
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <li key={m.id} className="flex flex-col border border-line bg-ink-raised p-6">
          <div className="mb-5 flex items-center gap-4">
            {m.photo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.photo.src}
                alt={m.photo.alt || m.name}
                width={72}
                height={72}
                loading="lazy"
                className="h-[72px] w-[72px] shrink-0 object-cover"
              />
            ) : null}
            <div>
              <h3 className="font-display text-2xl text-paper">{m.name}</h3>
              {m.role ? <p className="font-sans text-sm text-paper-dim">{m.role}</p> : null}
            </div>
          </div>
          {m.bio ? <p className="mb-4 font-sans text-sm leading-relaxed text-paper-dim">{m.bio}</p> : null}
          <dl className="mt-auto space-y-2 font-sans text-xs">
            {m.languages.length ? (
              <div>
                <dt className="inline uppercase tracking-[0.12em] text-gold">{t.languages}: </dt>
                <dd className="inline text-paper">{m.languages.map((l) => t.lang[l] ?? l).join(", ")}</dd>
              </div>
            ) : null}
            {m.qualifications ? (
              <div>
                <dt className="inline uppercase tracking-[0.12em] text-gold">{t.qualifications}: </dt>
                <dd className="inline text-paper">{m.qualifications}</dd>
              </div>
            ) : null}
          </dl>
          {m.linkedin ? (
            <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline mt-4 self-start font-sans text-xs uppercase tracking-[0.08em] text-brand-text">
              LinkedIn
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** Person-Schema für jede veröffentlichte Person (stärkt E-E-A-T). */
export function teamJsonLd(members: TeamMember[], siteUrl: string) {
  return members.map((m) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    ...(m.role ? { jobTitle: m.role } : {}),
    ...(m.photo.src ? { image: `${siteUrl}${m.photo.src}` } : {}),
    ...(m.linkedin ? { sameAs: m.linkedin } : {}),
    worksFor: { "@id": `${siteUrl}#organization` },
  }));
}
