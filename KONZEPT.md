# Interlexico – Konzept für neue Marketing-Website

Status: Entwurf zur Freigabe. Es wurde noch kein Code geschrieben.

---

## 1. Ziele & Rahmenbedingungen

- Zielgruppe: HR-Entscheider / Unternehmen in der DACH-Region, die Business-English-Training für Mitarbeitende suchen.
- Anfangs: ein Kurstyp (Business English). Muss aber von Grund auf so gebaut sein, dass weitere Kurstypen (Deutsch als Fremdsprache, später Excel, Management-Coaching etc.) ohne Neubau ergänzt werden können.
- Integrierter Shop: Buchung von Einzelunterricht, Gruppen- und Klassenkursen, plus Zusatzprodukte (z. B. digitale Materialien).
- Chatbot-Widget ("Lexi"-artig) für Besucherfragen.
- Deployment zunächst auf `staging.interlexico.com`, später `interlexico.com`.
- Design: hochwertig, dunkel mit Gold-Akzenten, kantig (keine abgerundeten Ecken), keine Emojis, Cormorant Garamond + DM Sans.

---

## 2. Tech-Stack-Vorschlag

| Bereich | Wahl | Begründung |
|---|---|---|
| Framework | **Next.js 14+ (App Router, TypeScript)** | SSR/SSG für SEO-relevante Marketingseiten, gute Performance, passt zum Rest eurer Infrastruktur (ihr nutzt bereits Next.js in `apps/sales/frontend`, `apps/admin/frontend`) |
| Styling | **Tailwind CSS** + eigenes Design-Token-System (Farben, Radien=0, Schriftgrößen) | schnell, konsistent erzwingbar (z. B. `rounded-none` global), keine "Baukasten"-Optik durch generische Komponenten |
| Fonts | Cormorant Garamond, DM Sans via `next/font` (self-hosted, kein FOUC) | |
| Content für Marketinginhalte | **MDX/JSON-Dateien im Repo** (`content/`), kein CMS | Für den Start ausreichend; Content-Änderungen laufen über Deploy. CMS (z. B. Sanity) kann später ergänzt werden, sobald Nicht-Entwickler:innen selbst pflegen sollen. |
| Datenbank | **PostgreSQL** (passend zu eurem bestehenden Stack, z. B. via Prisma – ich sehe `packages/db/prisma` im Monorepo) | Buchungen, Kurse, Nutzer, Bestellungen |
| ORM | **Prisma** | konsistent mit restlichem Stack |
| Zahlungen | **Stripe** (Checkout + Subscriptions/Payment Links für Kurse, Stripe Tax für DACH-USt) | Standard für B2B SaaS, unterstützt Rechnungen, SEPA-Lastschrift, Kreditkarte – wichtig für deutsche Firmenkunden |
| Buchungsflow / Slot-Verwaltung | Eigene Backend-Logik (Node/Next API Routes oder separater NestJS-Service, falls ihr das bereits im Monorepo so handhabt wie bei `apps/sales/backend`) | Kalender-/Slot-Logik für Einzelunterricht vs. feste Gruppentermine unterscheidet sich stark – braucht eigene Datenmodelle |
| Auth | **NextAuth / Auth.js** oder Clerk, je nachdem ob Kunden ein Kundenkonto/Portal brauchen (Rechnungen einsehen, Kurse verwalten) | vermutlich ja, für B2B mit HR-Kontakten, die mehrere Mitarbeitende buchen |
| Chatbot "Lexi" | Eigenes Widget (React-Komponente), ruft neuen öffentlichen Endpunkt `/api/public/lexi-widget` in `interlexico-one` auf, der die bestehende Lexi-KI-Logik wiederverwendet | Kein Duplikat der KI-Logik; Lead-Erfassung landet im bestehenden `Lead`-Modell/CRM. Details siehe Abschnitt "Lexi-Integration" unten. |
| Hosting | Docker-Container hinter eurem bestehenden Traefik-Reverse-Proxy (ich sehe `/opt/deploy/00-traefik`) | passt zu eurer Infrastruktur, ermöglicht `staging.interlexico.com` als eigenen Traefik-Host vor Cutover auf `interlexico.com` |
| E-Mail (Bestätigungen, Rechnungen) | Bestehende Mailcow-Instanz (`/opt/mailcow` ist vorhanden) via SMTP | Wiederverwendung statt Drittanbieter (SendGrid etc.) |
| Analytics | Plausible oder Umami (self-hosted, datenschutzfreundlich – wichtig für DACH/DSGVO) | kein Google Analytics ohne Cookie-Banner-Ärger |

**Entscheidungen (freigegeben):**
1. **Eigenständiges Repo** – `interlexico-com` bleibt getrennt vom Monorepo `/opt/monorepo2`, eigener Deploy-Rhythmus, kein Risiko für die App-Pipeline.
2. **Kein CMS zum Start** – Content-Dateien (MDX/JSON) im Repo. Sanity o. ä. kann später nachgerüstet werden, ohne die Architektur (Abschnitt 4) umzuwerfen, sobald nicht-technische Personen selbst Inhalte pflegen sollen.
3. **Lexi-Backend wiederverwenden, nicht neu bauen** – siehe Detail unten.
4. **Kein Kundenportal/Login zum Start** – Gast-Checkout mit E-Mail-Bestätigung. Buchung/Verwaltung läuft langfristig ohnehin über Interlexico ONE weiter; die neue Seite ist das Schaufenster + Checkout-Einstieg.

**Detail zu Lexi-Integration:**
Der bestehende Lexi-Chat läuft aktuell ausschließlich innerhalb der authentifizierten Dashboard-App `interlexico-one` (Endpunkte `/api/lexi`, `/api/support`, geschützt durch NextAuth-Session) – es existiert kein öffentliches Embed-Script und kein unauthentifizierter Chat-Endpunkt. Vorhanden ist dagegen ein authentifizierter REST-Endpunkt `/api/v1/leads` (Bearer-API-Key, sha256-gehashter Key gegen `ApiKey`-Modell) zur Lead-Erfassung.

Für die neue Marketingseite wird daher:
- ein neuer, schlanker **öffentlicher Endpunkt** in `interlexico-one` ergänzt (z. B. `POST /api/public/lexi-widget`), IP-ratelimitiert, der intern dieselbe KI-Logik wie `/api/lexi` nutzt (kein Session-Login nötig) und bei erkanntem Interesse automatisch einen Eintrag im bestehenden `Lead`-Modell (`db.lead.create`) anlegt – gleiche Datenbank/gleiches Modell wie das übrige CRM, kein Duplikat.
- das `LexiWidget.tsx` auf `interlexico-com` ruft ausschließlich diesen neuen Endpunkt auf; die eigentliche KI-/Prompt-Logik bleibt zentral in `interlexico-one` gepflegt.
- CORS für `interlexico-com` (und später `staging.interlexico.com`) muss auf diesem neuen Endpunkt freigeschaltet werden.

Diese Ergänzung in `interlexico-one` gehört technisch zu diesem Projekt (Marketingseite), berührt aber ein anderes Repo/Deployment – wird als eigener, klar abgegrenzter Schritt umgesetzt.

---

## 3. Seitenstruktur (Sitemap)

```
/                           Startseite
/kurse                      Kursübersicht (alle Kurstypen, Filter: Business English, DaF, ...)
/kurse/[kurstyp]            Kurstyp-Landingpage (z. B. /kurse/business-english)
/kurse/[kurstyp]/[format]   Formatdetail (Einzelunterricht / Gruppe / Klasse) inkl. Preise & Buchen-CTA
/ueber-uns                  Über uns / Team / Methodik
/kontakt                    Kontaktformular, Terminanfrage für Firmenberatung
/buchen                     Buchungsflow (Formatwahl → Termin/Teilnehmerzahl → Kundendaten)
/checkout                   Zahlung (Stripe)
/checkout/erfolg            Bestätigungsseite
/shop/materialien           Zusatzprodukte (digitale Bücher etc.)
/ressourcen (optional)      Blog/Content-Marketing für SEO
/rechtliches/*              Impressum, Datenschutz, AGB
```

---

## 4. Komponenten-Architektur (Modularität für Kurstypen)

Kernidee: **ein Kurstyp ist eine Konfiguration/Content-Objekt, keine eigene Seite.**

```
content/
  course-types/
    business-english.ts      -> { slug, name, heroCopy, formats: [...], seoMeta, testimonials, ... }
    deutsch-als-fremdsprache.ts   (später)
    excel-training.ts             (später)

types/
  CourseType.ts               -> gemeinsames Interface für alle Kurstypen
  CourseFormat.ts              -> Einzelunterricht | Gruppe | Klasse, mit Preis, Dauer, Kapazität

app/
  kurse/
    page.tsx                  -> listet alle course-types aus content/
    [kurstyp]/page.tsx        -> generateStaticParams aus content/course-types, rendert generische <CourseTypeLanding config={...} />
    [kurstyp]/[format]/page.tsx -> generische <CourseFormatDetail />

components/
  course/
    CourseTypeLanding.tsx      -> Hero, Zielgruppen-Nutzen, Formatübersicht, Testimonials – rein datengetrieben
    CourseFormatCard.tsx
    CourseFormatDetail.tsx
    BookingCTA.tsx
  booking/
    BookingFlow.tsx            -> generischer Multi-Step-Flow, nimmt CourseFormat als Prop
    ParticipantForm.tsx
  shop/
    ProductCard.tsx
    Cart.tsx
  checkout/
    CheckoutForm.tsx (Stripe Elements)
  chatbot/
    LexiWidget.tsx
  ui/                          -> Design-System-Primitives (Button, Section, Badge, Divider – alle kantig, Gold/Dunkel)
```

Ein neuer Kurstyp = neue Datei in `content/course-types/`, keine neue Seiten-Implementierung. Formate (Einzel/Gruppe/Klasse) sind ebenfalls datengetrieben, damit z. B. ein Excel-Training nur als Gruppentraining angeboten werden kann, ohne Codeänderung.

Datenbankseitig spiegelt sich das:

```
CourseType   (slug, name, description, ...)
CourseFormat (courseTypeId, kind: EINZEL|GRUPPE|KLASSE, price, capacity, ...)
Booking      (courseFormatId, customer, participants, status, stripeSessionId)
Product      (Zusatzprodukte, unabhängig von CourseType)
Order        (Product-Käufe)
```

---

## 5. Design-Konzept (Beschreibung)

**Grundstimmung:** ruhiges, selbstbewusstes B2B-Editorial-Design – wirkt eher wie ein Premium-Fachverlag oder eine Private-Banking-Marke als wie ein Sprachschul-Baukasten. Vertrauen und Seriosität für HR-Entscheider, die ein Trainingsbudget verantworten.

**Farbpalette:**
- Basis: sehr dunkles Anthrazit/Nahe-Schwarz (z. B. `#12100E` / `#1A1714`), keine reinen Schwarztöne, leicht warm
- Akzent: gedämpftes Gold/Messing (z. B. `#C6A15B` / `#B8965A`), sparsam eingesetzt – für Linien, kleine Labels, Hover-States, Icons, CTA-Rand statt Fläche
- Sekundär: Off-White/Champagner für Fließtext auf dunklem Grund (`#EDE7DD`), keine reinen Weiß-auf-Schwarz-Kontraste (zu hart)
- Fehlerhafte/erfolgreiche Zustände (Formulare) dezent, nicht grell

**Typografie:**
- Cormorant Garamond: große Headlines, Zitate, Kurstitel – bewusst groß gesetzt, viel Zeilenhöhe, teils in Großbuchstaben mit Letter-Spacing für Eyecatcher-Linien ("BUSINESS ENGLISH FÜR FÜHRUNGSKRÄFTE")
- DM Sans: Fließtext, Navigation, Formulare, Preise – hohe Lesbarkeit, funktional
- Kein drittes Font hinzufügen; Hierarchie über Größe/Gewicht/Spacing, nicht über zusätzliche Schriften

**Formensprache:**
- Konsequent kantig: `border-radius: 0` überall (Buttons, Cards, Inputs, Bilder-Crops)
- Klare, dünne Trennlinien (1px, Gold oder gedämpftes Grau) statt Schatten/Cards mit Schlagschatten
- Großzügige Weißräume (bzw. "Dunkelräume"), Editorial-Grid statt vollflächiger bunter Sektionen
- Bilder: falls Fotografie verwendet wird, hochwertig, gedeckt/monochrom nachbearbeitet, damit sie zur dunklen Palette passt – keine Stock-Foto-Buntheit

**Bewegung/Interaktion:**
- Sehr zurückhaltende Micro-Interactions: feine Unterstreich-Animation bei Links, sanftes Fade/Slide beim Scrollen, keine verspielten Bounce-Effekte
- Hover-States auf Buttons: Goldrand füllt sich, kein Schatten/Rundung

**Layoutprinzipien für Startseite (Beispielfluss, nicht final):**
1. Hero: großer Cormorant-Headline-Claim, knapper Sub-Text (DM Sans), ein primärer CTA ("Kurse entdecken") + sekundärer CTA ("Beratungsgespräch buchen")
2. Vertrauenssignale: Logos von Kundenunternehmen (dezent, monochrom/Gold-getönt)
3. Kurstyp-Auswahl: Karten für Business English (aktiv) und "bald verfügbar" für DaF etc. – zeigt Modularität auch visuell
4. Methodik/Nutzenversprechen in 3–4 kantigen Spalten
5. Testimonial-Zitat großformatig in Cormorant Garamond
6. Ablauf/Prozess (Beratung → Einstufung → Training → Reporting fürs HR)
7. CTA-Sektion + Footer mit Kontakt, rechtlichen Links

**Chatbot-Widget "Lexi":** dezenter Trigger unten rechts, kantig, Goldrand auf Dunkelgrund, kein rundes Bubble-Icon, kein Emoji – eher ein kleines Textlabel "Fragen? — Lexi" das sich beim Hover leicht hervorhebt.

---

## 6. Vorgeschlagene nächste Schritte nach Freigabe

1. Antworten auf die 4 offenen Fragen in Abschnitt 2 einholen
2. Next.js-Projekt aufsetzen (TypeScript, Tailwind, next/font, ESLint/Prettier)
3. Design-Tokens (Farben, Typo, Spacing-Skala) als Tailwind-Config umsetzen + kleine Style-Guide-Seite zur Abstimmung
4. Datenmodell (Prisma-Schema) für CourseType/CourseFormat/Booking/Product/Order
5. Generisches Kurstyp-Grundgerüst inkl. Content für "Business English" befüllen
6. Buchungsflow + Stripe-Checkout
7. Chatbot-Widget integrieren
8. Deployment-Setup für `staging.interlexico.com` über Traefik

---

**Bitte prüfen und freigeben (ggf. mit Antworten auf die 4 offenen Fragen), bevor ich mit der Umsetzung beginne.**
