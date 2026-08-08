# Interlexico — Marketing-Website

Marketing-Website für Interlexico (Business-English-Training für Unternehmen
in der DACH-Region) mit anfragebasiertem Lead-Funnel (kein Self-Service-
Checkout). Next.js 16 (App Router, TypeScript) mit Tailwind CSS v4.

Konzept, Ziele und Architektur: siehe [`KONZEPT.md`](./KONZEPT.md).
Aktueller Arbeitsstand: siehe [`.agent-status-website.md`](./.agent-status-website.md).

## Entwicklung

```bash
npm install
npm run dev     # Entwicklungsserver auf http://localhost:3000
npm run build   # Produktions-Build
npm run start   # Produktions-Server
npm run lint    # ESLint
```

## Architektur (Kurzfassung)

- **Kurstypen sind datengetrieben:** Ein Kurstyp ist eine Konfiguration in
  `src/content/course-types/` (Interface: `src/types/course.ts`), keine eigene
  Seiten-Implementierung. Neuer Kurstyp = neue Datei, keine neuen Seiten.
  Die Routen `kurse/[kurstyp]` und `kurse/[kurstyp]/[format]` rendern generische
  Komponenten aus `src/components/course/`.
- **Design-Tokens** (Farben, Fonts) liegen in `src/app/globals.css`
  (`@theme inline`). Formensprache: durchgängig kantig (`border-radius: 0`
  global erzwungen), dunkel mit Gold-Akzenten, Cormorant Garamond + DM Sans.
- **UI-Primitives** (kantig, Gold/Dunkel) in `src/components/ui/`.

- **Anfragen statt Checkout:** Kein Buchungsflow/Stripe. Kontaktformular und
  Kurs-Konfigurator senden an `/api/inquiry` (serverseitige Validierung,
  Rate-Limit, Honeypot), Weiterleitung per SMTP via `src/lib/mailer.ts`.
- **Cookieloses Analytics:** `/api/collect` (first-party, kein Cookie, DNT/GPC-
  respektierend) statt Google Analytics/Plausible.
- **CMS-Anbindung (optional/graduell):** `src/lib/cms.ts` holt Inhalte aus
  Payload CMS mit Fallback auf die statischen `content/`-Dateien (bisher nur
  für FAQ umgesetzt, siehe `getFaq()`).
- **Mehrsprachig (DE/EN/ES):** Routing über `src/app/[lang]/*` + `src/proxy.ts`
  (Next 16: `proxy.ts`, nicht `middleware.ts`; erkennt Sprache per Cookie/
  `Accept-Language` und redirected auf `/de`, `/en` oder `/es`). Feste
  UI-Texte liegen in `src/dictionaries/{de,en,es}.ts`, übersetzte Inhalte
  (Kurse, FAQ, Branchen, Einstufung) in `src/content/**/*.{de,en,es}.ts` mit
  locale-fähigen Loadern (`getCourseTypes(lang)`, `getFaq(lang)`, …).
  Dynamische Text-Templates mit Parametern (z. B. Teilnehmerzahl) liegen
  bewusst **außerhalb** des Dictionary-Objekts in `src/lib/dynamic-strings.ts`
  — Funktionen lassen sich nicht von Server- an Client-Components als Prop
  übergeben (RSC-Grenze). Rechtstexte (AGB/Datenschutz) sind auf Englisch/
  Spanisch übersetzt, mit Hinweis, dass die deutsche Fassung rechtsverbindlich
  bleibt (deutsches Recht/TMG/DSGVO-Verweise gelten unabhängig von der Sprache).

## Deployment

- `Dockerfile` baut ein standalone Next.js-Image (`output: "standalone"`).
- `deploy/docker-compose.yml` ist ein **Entwurf** für die Traefik-Registrierung
  (Vorbild: `/opt/deploy/03-one`) — noch nicht in `/opt/deploy` übernommen.
- `.env.example` listet alle Produktions-Variablen (CMS-URL, SMTP für
  `/api/inquiry`).

## Offene Integrationen (Freigabe/externe Daten erforderlich)

Diese Punkte sind bewusst als Platzhalter angelegt und im Code mit `TODO`
markiert bzw. in `KONZEPT.md` beschrieben:

- **SMTP-Zugangsdaten** für den produktiven Versand (`SMTP_HOST/USER/PASS` in
  `.env.example`) — ohne diese wird nur geloggt, keine Mail verschickt.
- **Rechtstexte** Impressum / Datenschutz / AGB — Platzhalter (`<PH>`) für
  echte Firmendaten (`src/app/rechtliches/*`, `src/components/legal/legal.tsx`)
- **Lexi-Chat-Proxy → interlexico-one** (`src/app/api/lexi-widget/route.ts`,
  aktuell Stub-Antwort ohne echte KI-Anbindung)
- **DNS/Registrierung:** `interlexico.com` zeigt aktuell auf die IONOS-
  Parkseite, nicht auf diesen Server.
