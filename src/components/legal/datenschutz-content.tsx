import { LegalH2, LegalP, LegalList, PH, Val, DateVal } from "@/components/legal/legal";
import type { Locale } from "@/lib/i18n";
import type { LegalData, LegalExtrasData } from "@/lib/cms";

export function DatenschutzContent({
  lang,
  legal,
  extras,
}: {
  lang: Locale;
  legal: LegalData;
  extras: LegalExtrasData;
}) {
  if (lang === "en") return <En legal={legal} extras={extras} />;
  if (lang === "es") return <Es legal={legal} extras={extras} />;
  return <De legal={legal} extras={extras} />;
}

function De({ legal, extras }: { legal: LegalData; extras: LegalExtrasData }) {
  return (
    <>
      <div className="space-y-3">
        <LegalH2>1. Verantwortlicher</LegalH2>
        <LegalP>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</LegalP>
        <LegalP>
          <Val value={legal.companyName} placeholder="Firmenname" />
          <br />
          <Val value={legal.street} placeholder="Anschrift" />
          <br />
          <Val value={legal.zipCity} placeholder="PLZ, Ort" />
          <br />
          Vertreten durch: <Val value={legal.managingDirector} placeholder="vertretungsberechtigte Person" />
        </LegalP>
        <LegalP>
          Bei Fragen zum Datenschutz erreichen Sie uns unter{" "}
          <Val
            value={legal.dataProtectionContact}
            placeholder="Datenschutz-Kontakt / ggf. Datenschutzbeauftragte:r"
          />
          .
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>2. Hosting und Server-Logfiles</LegalH2>
        <LegalP>
          Die Website wird bei{" "}
          <Val value={extras.hostingProvider} placeholder="Hosting-Anbieter / eigene Serverinfrastruktur" />{" "}
          gehostet. Beim Aufruf werden technisch notwendige Zugriffsdaten
          (Server-Logfiles) verarbeitet, die Ihr Browser automatisch übermittelt:
        </LegalP>
        <LegalList
          items={[
            "aufgerufene Seite / Datei sowie Datum und Uhrzeit",
            "übertragene Datenmenge und Meldung über erfolgreichen Abruf",
            "Browsertyp und -version, Betriebssystem",
            "gekürzte bzw. verarbeitete IP-Adresse (Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO — sicherer, störungsfreier Betrieb)",
          ]}
        />
        <LegalP>
          Speicherdauer der Logfiles:{" "}
          {extras.logRetentionDays ? (
            <span className="text-paper">{extras.logRetentionDays} Tage</span>
          ) : (
            <PH>z. B. 7–30 Tage</PH>
          )}
          , anschließend Löschung bzw. Anonymisierung.
        </LegalP>
        <LegalP>
          Die Website und alle damit verbundenen Anfragedaten werden
          ausschließlich auf Servern innerhalb der Europäischen Union
          verarbeitet und gespeichert. Es findet kein Datenabfluss in
          Drittländer außerhalb der EU/des EWR statt.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>3. Cookies und lokale Speicherung</LegalH2>
        <LegalP>
          Diese Website setzt <span className="text-paper">keine Cookies zu
          Marketing- oder Trackingzwecken</span> und bindet keine
          Drittanbieter-Tracker (z. B. Meta-Pixel, Google Ads) ein. Aus diesem
          Grund ist kein Cookie-Einwilligungsbanner erforderlich.
        </LegalP>
        <LegalP>
          Ausschließlich für die Funktion der Seite nutzen wir den lokalen Speicher
          Ihres Browsers (localStorage/sessionStorage), der keine Daten an uns
          überträgt:
        </LegalP>
        <LegalList
          items={[
            "Darstellungspräferenz (hell/dunkel/Kontrast) — dauerhaft im Browser, rein lokal",
            "Zwischenspeicherung Ihrer Angaben im Buchungsprozess bis zum Abschluss — nur in Ihrer aktuellen Sitzung",
            "ob Ihnen der Gutschein-Hinweis bereits angezeigt wurde bzw. ob Sie einen Gutschein angefordert haben, damit er nicht wiederholt erscheint — im Browser, rein lokal",
          ]}
        />
        <LegalP>
          Rechtsgrundlage ist § 25 Abs. 2 TDDDG (technisch erforderliche
          Speicherung) i. V. m. Art. 6 Abs. 1 lit. f DSGVO.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>4. Schriftarten (lokal gehostet)</LegalH2>
        <LegalP>
          Schriftarten werden lokal von unserem Server ausgeliefert. Es besteht{" "}
          <span className="text-paper">keine Verbindung zu Google Fonts</span> oder
          anderen Drittanbietern; bei der Anzeige der Seite wird deshalb keine
          IP-Adresse an externe Font-Dienste übertragen.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>5. Reichweitenmessung (cookielos, ohne Einwilligung)</LegalH2>
        <LegalP>
          Zur Verbesserung unseres Angebots erfassen wir Seitenaufrufe in
          anonymisierter, cookieloser Form auf eigener Infrastruktur (First-Party).
          Dabei werden:
        </LegalP>
        <LegalList
          items={[
            "keine Cookies gesetzt und keine geräteübergreifende Wiedererkennung vorgenommen",
            "keine IP-Adressen dauerhaft gespeichert — sie werden nur für den Verarbeitungsmoment genutzt, um Land und einen täglich neu berechneten, nicht rückführbaren Prüfwert zu bilden, danach sofort verworfen",
            "aufgerufener Pfad, Referrer-Domain, grobes Land, Browsertyp, Betriebssystem und Gerätetyp (Desktop/Mobil/Tablet) in dieser anonymisierten Form verarbeitet",
          ]}
        />
        <LegalP>
          Die Reichweitenmessung läuft auf eigener, selbst gehosteter Infrastruktur
          (Umami, Server in der EU) — es werden keine Daten an Dritte oder in
          Drittländer übertragen. Die Signale{" "}
          <span className="text-paper">Do Not Track (DNT)</span> und{" "}
          <span className="text-paper">Global Privacy Control (GPC)</span> werden
          respektiert: Ist eines davon in Ihrem Browser aktiv, findet keine Messung
          statt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>6. Kontaktaufnahme und Kontaktformular</LegalH2>
        <LegalP>
          Wenn Sie uns per Formular oder E-Mail kontaktieren, verarbeiten wir die
          von Ihnen angegebenen Daten (z. B. Name, E-Mail, Unternehmen, Nachricht)
          zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
          DSGVO (vorvertragliche Maßnahmen) bzw. lit. f DSGVO (Beantwortung von
          Anfragen). Die Daten werden gelöscht, sobald sie nicht mehr erforderlich
          sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </LegalP>
        <LegalP>
          Beim Englisch-Einstufungstest verarbeiten wir zusätzlich Ihre
          Testantworten (Multiple-Choice, Freitext) sowie optional eine von
          Ihnen aufgenommene Sprachaufnahme (Speaking-Aufgabe), sofern Sie
          den Mikrofonzugriff im Browser erlauben. Diese Daten werden zusammen
          mit den von Ihnen angegebenen Kontaktdaten per E-Mail an unser Team
          gesendet, um Ihre schriftliche und mündliche Antwort individuell
          auszuwerten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
          (vorvertragliche Maßnahmen zur Ermittlung eines passenden
          Trainingsangebots). Die Sprachaufnahme wird nicht dauerhaft auf
          unserer Website gespeichert, sondern ausschließlich per E-Mail
          übermittelt; sie wird gelöscht, sobald sie für die Auswertung nicht
          mehr erforderlich ist. Ohne Ihre Zustimmung zum Mikrofonzugriff
          können Sie den Test ohne die Sprachaufgabe abschließen.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>6a. Marketing-Newsletter (optionale Einwilligung)</LegalH2>
        <LegalP>
          Auf unserem Kontaktformular können Sie zusätzlich, freiwillig und
          unabhängig von Ihrer eigentlichen Anfrage einwilligen, künftig
          E-Mail-Updates zu neuen Kursformaten, E-Learning-Modulen und Terminen
          zu erhalten (Art. 6 Abs. 1 lit. a DSGVO, § 7 Abs. 2 Nr. 3 UWG). Diese
          Einwilligung ist standardmäßig nicht angehakt und keine Voraussetzung
          für die Bearbeitung Ihrer Anfrage.
        </LegalP>
        <LegalP>
          Wir nutzen ein Double-Opt-In-Verfahren: Nach dem Absenden erhalten
          Sie eine Bestätigungs-E-Mail mit einem Link. Erst nach Klick auf
          diesen Link ist die Anmeldung aktiv und der Nachweis Ihrer
          Einwilligung dokumentiert (Zeitpunkt, IP-Adresse). Bestätigen Sie
          nicht, wird der Eintrag automatisch gelöscht. Sie können die
          Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen — einen
          Abmeldelink finden Sie am Ende jeder Werbe-E-Mail.
        </LegalP>
        <LegalP>
          <span className="text-paper">Bestandskund:innen (§ 7 Abs. 3 UWG):</span>{" "}
          Haben Sie bereits ein kostenpflichtiges Training bei uns gebucht,
          dürfen wir die dabei angegebene E-Mail-Adresse ohne gesonderte
          Einwilligung nutzen, um Sie über ähnliche eigene Leistungen (z. B.
          Folgekurse, Fachsprachentrainings) zu informieren. Auf Ihr
          jederzeitiges Widerspruchsrecht — sowohl bei der Buchung als auch in
          jeder weiteren E-Mail — weisen wir dabei klar hin; ein Widerspruch
          ist kostenfrei und formlos möglich (z. B. per Abmeldelink oder an
          unsere Kontaktadresse).
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>6b. Gutschein-Aktion „2 kostenfreie Unterrichtseinheiten“</LegalH2>
        <LegalP>
          Über ein Hinweisfenster auf unserer Website können Sie bis zum
          31.12.2026 einen Gutschein-Code anfordern. Dafür verarbeiten wir Ihren
          Namen, Ihre E-Mail-Adresse, die Sprache der Website sowie den
          Zeitpunkt, zu dem Sie bestätigt haben, diese Datenschutzerklärung
          gelesen zu haben. Den Code erzeugen wir erst, nachdem Sie Ihre
          E-Mail-Adresse über den Link in unserer Bestätigungs-E-Mail bestätigt
          haben. Danach speichern wir zusätzlich den Code, den Zeitpunkt der
          Bestätigung und, sobald Sie ihn einlösen, wann und von wem er als
          eingelöst markiert wurde. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
          DSGVO (Durchführung der von Ihnen angeforderten Aktion).
        </LegalP>
        <LegalP>
          Nach der Bestätigung legen wir in unserem Kundenverwaltungssystem
          einen Interessenten-Eintrag mit Name und E-Mail-Adresse an, damit wir
          den Code Ihrer Anfrage oder Buchung zuordnen und ein passendes Angebot
          vorbereiten können (Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse
          an der Vertragsanbahnung). Dieser Verarbeitung können Sie jederzeit
          widersprechen, z. B. per E-Mail an unsere Kontaktadresse. Ohne Ihre
          gesonderte Newsletter-Einwilligung erhalten Sie von uns keine
          Werbe-E-Mails.
        </LegalP>
        <LegalP>Speicherdauer:</LegalP>
        <LegalList
          items={[
            "nicht bestätigte Anfragen: automatische Löschung nach 30 Tagen",
            "nicht eingelöste Codes: Löschung am 30.06.2027, drei Monate nach Ende des Einlösezeitraums (31.03.2027)",
            "eingelöste Codes: werden Teil Ihrer Buchungsunterlagen und unterliegen den gesetzlichen Aufbewahrungsfristen",
            "Interessenten-Eintrag: Löschung bzw. Anonymisierung, wenn innerhalb von 24 Monaten kein Vertrag zustande kommt",
          ]}
        />
        <LegalP>
          Freiwillig können Sie sich im Hinweisfenster, auf der
          Bestätigungsseite oder über die E-Mail mit Ihrem Code zusätzlich für
          unseren Newsletter anmelden. Der Gutschein hängt davon nicht ab. Die
          Anmeldung wird erst wirksam, wenn Sie sie nach Bestätigung Ihrer
          E-Mail-Adresse mit einem eigenen Klick auslösen; als Nachweis speichern
          wir Zeitpunkt, IP-Adresse und Wortlaut Ihrer Einwilligung. Im Übrigen
          gilt Abschnitt 6a.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>7. Buchung und Zahlungsabwicklung</LegalH2>
        <LegalP>
          Für Buchungen verarbeiten wir die zur Vertragsdurchführung erforderlichen
          Daten (Art. 6 Abs. 1 lit. b DSGVO). Die Zahlungsabwicklung erfolgt über{" "}
          <Val value={extras.paymentProvider} placeholder="Zahlungsdienstleister, z. B. Stripe" /> — sobald
          aktiviert, mit eigener Datenschutzinformation und Auftragsverarbeitung. Details
          ergänzen, sobald die Zahlungsintegration produktiv ist.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>8. Chat-Assistent „Lexi“</LegalH2>
        <LegalP>
          Über den Chat können Sie Fragen stellen. Ihre Eingaben werden zur
          Beantwortung verarbeitet und ggf. zur Kontaktaufnahme gespeichert.
          Verarbeitung/Weiterleitung erfolgt über{" "}
          <Val
            value={extras.aiBackendNote?.de}
            placeholder="eingesetzte KI-/Backend-Komponente und deren Rechtsgrundlage/Auftragsverarbeitung"
          />
          . Bitte geben Sie im Chat keine besonderen Kategorien personenbezogener
          Daten ein.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>9. Ihre Rechte</LegalH2>
        <LegalP>Sie haben nach der DSGVO das Recht auf:</LegalP>
        <LegalList
          items={[
            "Auskunft (Art. 15), Berichtigung (Art. 16) und Löschung (Art. 17)",
            "Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20)",
            "Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f (Art. 21)",
            "Beschwerde bei einer Datenschutz-Aufsichtsbehörde (Art. 77)",
          ]}
        />
        <LegalP>
          Zur Ausübung genügt eine formlose Mitteilung an den oben genannten
          Verantwortlichen. Zuständige Aufsichtsbehörde:{" "}
          <Val
            value={legal.supervisoryAuthority}
            placeholder="zuständige Landes-/Datenschutzaufsichtsbehörde"
          />
          .
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>10. Stand und Änderungen</LegalH2>
        <LegalP>
          Wir passen diese Datenschutzerklärung an, sobald sich die
          Datenverarbeitung ändert (z. B. bei Aktivierung der Zahlungsintegration).
          Stand: <DateVal value={extras.lastUpdated} lang="de" placeholder="Datum" />.
        </LegalP>
      </div>
    </>
  );
}

function En({ legal, extras }: { legal: LegalData; extras: LegalExtrasData }) {
  return (
    <>
      <div className="space-y-3">
        <LegalH2>1. Controller</LegalH2>
        <LegalP>The controller responsible for data processing on this website is:</LegalP>
        <LegalP>
          <Val value={legal.companyName} placeholder="company name" />
          <br />
          <Val value={legal.street} placeholder="address" />
          <br />
          <Val value={legal.zipCity} placeholder="zip code, city" />
          <br />
          Represented by: <Val value={legal.managingDirector} placeholder="authorised representative" />
        </LegalP>
        <LegalP>
          For privacy questions, contact us at{" "}
          <Val
            value={legal.dataProtectionContact}
            placeholder="privacy contact / data protection officer, if applicable"
          />
          .
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>2. Hosting and server log files</LegalH2>
        <LegalP>
          The website is hosted by{" "}
          <Val value={extras.hostingProvider} placeholder="hosting provider / own server infrastructure" />.
          When you access it, technically necessary access data (server log
          files) automatically transmitted by your browser are processed:
        </LegalP>
        <LegalList
          items={[
            "page/file accessed, plus date and time",
            "amount of data transferred and confirmation of successful retrieval",
            "browser type and version, operating system",
            "shortened / processed IP address (legal basis: Art. 6(1)(f) GDPR — secure, uninterrupted operation)",
          ]}
        />
        <LegalP>
          Log file retention period:{" "}
          {extras.logRetentionDays ? (
            <span className="text-paper">{extras.logRetentionDays} days</span>
          ) : (
            <PH>e.g. 7–30 days</PH>
          )}
          , after which they are deleted or anonymised.
        </LegalP>
        <LegalP>
          The website and all associated enquiry data are processed and
          stored exclusively on servers within the European Union. No data
          is transferred to third countries outside the EU/EEA.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>3. Cookies and local storage</LegalH2>
        <LegalP>
          This website uses <span className="text-paper">no cookies for
          marketing or tracking purposes</span> and embeds no third-party
          trackers (e.g. Meta Pixel, Google Ads). For this reason, no cookie
          consent banner is required.
        </LegalP>
        <LegalP>
          We use your browser&apos;s local storage (localStorage/sessionStorage)
          exclusively for the site to function, and it transmits no data to us:
        </LegalP>
        <LegalList
          items={[
            "display preference (light/dark/contrast) — stored permanently in the browser, purely local",
            "temporary storage of your inputs during the enquiry configurator until completion — only for your current session",
            "whether the voucher notice has already been shown to you or whether you have requested a voucher, so that it does not appear repeatedly — in the browser, purely local",
          ]}
        />
        <LegalP>
          Legal basis: Section 25(2) TDDDG (German Telecommunications-Digital
          Services Data Protection Act; technically necessary storage) in
          conjunction with Art. 6(1)(f) GDPR.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>4. Fonts (self-hosted)</LegalH2>
        <LegalP>
          Fonts are delivered locally from our own server. There is{" "}
          <span className="text-paper">no connection to Google Fonts</span> or
          other third parties; no IP address is therefore transmitted to
          external font services when the page is displayed.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>5. Traffic measurement (cookieless, without consent)</LegalH2>
        <LegalP>
          To improve our offering, we record page views in anonymised,
          cookieless form on our own first-party infrastructure. In doing so:
        </LegalP>
        <LegalList
          items={[
            "no cookies are set and no cross-device recognition takes place",
            "no IP addresses are stored permanently — they are used only in the moment of processing to derive a country and a non-reversible, daily-rotating check value, then discarded immediately",
            "path accessed, referrer domain, coarse country, browser type, operating system and device type (desktop/mobile/tablet) are processed in this anonymised form",
          ]}
        />
        <LegalP>
          Traffic measurement runs on our own self-hosted infrastructure (Umami,
          servers in the EU) — no data is transferred to third parties or third
          countries. <span className="text-paper">Do Not Track (DNT)</span> and{" "}
          <span className="text-paper">Global Privacy Control (GPC)</span>{" "}
          signals are respected: if either is active in your browser, no
          measurement takes place. Legal basis: Art. 6(1)(f) GDPR.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>6. Contacting us and the contact form</LegalH2>
        <LegalP>
          If you contact us via the form or email, we process the data you
          provide (e.g. name, email, company, message) to handle your enquiry.
          Legal basis: Art. 6(1)(b) GDPR (pre-contractual measures) or Art.
          6(1)(f) GDPR (responding to enquiries). Data is deleted once it is no
          longer required and no statutory retention obligations apply.
        </LegalP>
        <LegalP>
          For the English placement test, we additionally process your test
          answers (multiple choice, free text) and, optionally, a voice
          recording you make for the speaking task, provided you allow
          microphone access in your browser. This data is sent by email to
          our team together with the contact details you provide, so we can
          give you individual feedback on your written and spoken answers.
          Legal basis: Art. 6(1)(b) GDPR (pre-contractual measures to
          determine a suitable training offer). The voice recording is not
          permanently stored on our website — it is only transmitted by
          email — and is deleted once it is no longer needed for the
          assessment. You can complete the test without the speaking task if
          you do not consent to microphone access.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>6a. Marketing newsletter (optional consent)</LegalH2>
        <LegalP>
          On our contact form you can separately and voluntarily agree,
          independently of your actual enquiry, to receive email updates
          about new course formats, e-learning modules, and dates (Art.
          6(1)(a) GDPR). This box is unchecked by default and is not a
          condition for handling your enquiry.
        </LegalP>
        <LegalP>
          We use a double opt-in process: after submitting, you receive a
          confirmation email with a link. Only after clicking that link is
          the subscription active and your consent documented (timestamp,
          IP address). If you do not confirm, the entry is automatically
          deleted. You can withdraw consent at any time with future effect —
          you will find an unsubscribe link at the bottom of every marketing
          email.
        </LegalP>
        <LegalP>
          <span className="text-paper">Existing customers:</span> If you have
          already booked a paid training with us, we may use the email
          address provided at booking to inform you about similar services
          of our own (e.g. follow-up courses) without separate consent,
          where permitted by applicable law — always with a clear,
          cost-free right to object, both at booking and in every further
          email.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>6b. &quot;2 free lessons&quot; voucher promotion</LegalH2>
        <LegalP>
          Via a notice window on our website you can request a voucher code
          until 31 December 2026. For this we process your name, your email
          address, the language of the website and the time at which you
          confirmed that you have read this privacy policy. We only generate the
          code after you have confirmed your email address via the link in our
          confirmation email. We then also store the code, the time of
          confirmation and, once you redeem it, when and by whom it was marked
          as redeemed. Legal basis: Art. 6(1)(b) GDPR (carrying out the
          promotion you requested).
        </LegalP>
        <LegalP>
          After confirmation we create a prospect entry with your name and email
          address in our customer management system so that we can match the
          code to your enquiry or booking and prepare a suitable offer
          (Art. 6(1)(f) GDPR, legitimate interest in preparing a contract). You
          can object to this processing at any time, e.g. by email to our
          contact address. Without your separate newsletter consent you will not
          receive any advertising emails from us.
        </LegalP>
        <LegalP>Storage period:</LegalP>
        <LegalList
          items={[
            "unconfirmed requests: deleted automatically after 30 days",
            "codes not redeemed: deleted on 30 June 2027, three months after the end of the redemption period (31 March 2027)",
            "redeemed codes: become part of your booking records and are subject to the statutory retention periods",
            "prospect entry: deleted or anonymised if no contract is concluded within 24 months",
          ]}
        />
        <LegalP>
          You may also voluntarily subscribe to our newsletter in the notice
          window, on the confirmation page or via the email containing your
          code. The voucher does not depend on this. The subscription only takes
          effect once you trigger it with a separate click after confirming your
          email address; as proof we store the time, IP address and wording of
          your consent. Otherwise section 6a applies.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>7. Bookings and payment processing</LegalH2>
        <LegalP>
          For bookings we process the data required to perform the contract
          (Art. 6(1)(b) GDPR). Payment processing is carried out via{" "}
          <Val value={extras.paymentProvider} placeholder="payment service provider, e.g. Stripe" /> — once
          activated, with its own privacy notice and data processing agreement. Details
          will be added once payment integration goes live.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>8. Chat assistant &quot;Lexi&quot;</LegalH2>
        <LegalP>
          You can ask questions via the chat. Your input is processed to
          provide an answer and may be stored to follow up with you.
          Processing/forwarding is carried out via{" "}
          <Val
            value={extras.aiBackendNote?.en}
            placeholder="the AI/backend component used and its legal basis/data processing agreement"
          />
          . Please do not enter special categories of personal data in the chat.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>9. Your rights</LegalH2>
        <LegalP>Under the GDPR, you have the right to:</LegalP>
        <LegalList
          items={[
            "access (Art. 15), rectification (Art. 16), and erasure (Art. 17)",
            "restriction of processing (Art. 18) and data portability (Art. 20)",
            "object to processing based on Art. 6(1)(f) (Art. 21)",
            "lodge a complaint with a data protection supervisory authority (Art. 77)",
          ]}
        />
        <LegalP>
          An informal message to the controller named above is sufficient to
          exercise these rights. Competent supervisory authority:{" "}
          <Val
            value={legal.supervisoryAuthority}
            placeholder="relevant state/data protection supervisory authority"
          />
          .
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>10. Version and changes</LegalH2>
        <LegalP>
          We will update this privacy policy whenever data processing changes
          (e.g. once payment integration is activated). Last updated:{" "}
          <DateVal value={extras.lastUpdated} lang="en" placeholder="date" />.
        </LegalP>
      </div>
    </>
  );
}

function Es({ legal, extras }: { legal: LegalData; extras: LegalExtrasData }) {
  return (
    <>
      <div className="space-y-3">
        <LegalH2>1. Responsable del tratamiento</LegalH2>
        <LegalP>El responsable del tratamiento de datos en este sitio web es:</LegalP>
        <LegalP>
          <Val value={legal.companyName} placeholder="nombre de la empresa" />
          <br />
          <Val value={legal.street} placeholder="dirección" />
          <br />
          <Val value={legal.zipCity} placeholder="código postal, ciudad" />
          <br />
          Representado por: <Val value={legal.managingDirector} placeholder="persona con poder de representación" />
        </LegalP>
        <LegalP>
          Para consultas sobre protección de datos, escríbanos a{" "}
          <Val
            value={legal.dataProtectionContact}
            placeholder="contacto de protección de datos / delegado de protección de datos, si procede"
          />
          .
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>2. Alojamiento y archivos de registro del servidor</LegalH2>
        <LegalP>
          El sitio web está alojado en{" "}
          <Val value={extras.hostingProvider} placeholder="proveedor de alojamiento / infraestructura propia" />.
          Al acceder, se procesan los datos de acceso técnicamente necesarios
          (archivos de registro del servidor) que su navegador transmite
          automáticamente:
        </LegalP>
        <LegalList
          items={[
            "página/archivo consultado, así como fecha y hora",
            "cantidad de datos transferidos y confirmación de la recuperación correcta",
            "tipo y versión del navegador, sistema operativo",
            "dirección IP acortada o procesada (base jurídica: art. 6.1.f RGPD — funcionamiento seguro y sin interrupciones)",
          ]}
        />
        <LegalP>
          Duración de conservación de los registros:{" "}
          {extras.logRetentionDays ? (
            <span className="text-paper">{extras.logRetentionDays} días</span>
          ) : (
            <PH>p. ej., 7–30 días</PH>
          )}
          , tras lo cual se eliminan o anonimizan.
        </LegalP>
        <LegalP>
          El sitio web y todos los datos de consultas asociados se procesan y
          almacenan exclusivamente en servidores dentro de la Unión Europea.
          No se produce transferencia de datos a terceros países fuera de la
          UE/EEE.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>3. Cookies y almacenamiento local</LegalH2>
        <LegalP>
          Este sitio web <span className="text-paper">no utiliza cookies con fines de
          marketing o seguimiento</span> ni integra rastreadores de terceros (p. ej.,
          Meta Pixel, Google Ads). Por este motivo, no se requiere un banner de
          consentimiento de cookies.
        </LegalP>
        <LegalP>
          Utilizamos el almacenamiento local de su navegador (localStorage/sessionStorage)
          exclusivamente para el funcionamiento del sitio, sin transmitirnos ningún dato:
        </LegalP>
        <LegalList
          items={[
            "preferencia de visualización (claro/oscuro/contraste) — almacenada de forma permanente en el navegador, puramente local",
            "almacenamiento temporal de sus datos durante el proceso del configurador hasta su finalización — solo en su sesión actual",
            "si ya se le ha mostrado el aviso del vale o si ha solicitado un vale, para que no aparezca repetidamente — en el navegador, puramente local",
          ]}
        />
        <LegalP>
          Base jurídica: artículo 25.2 de la TDDDG (ley alemana de protección de datos en
          telecomunicaciones; almacenamiento técnicamente necesario) en relación con el
          artículo 6.1.f del RGPD.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>4. Tipografías (alojadas localmente)</LegalH2>
        <LegalP>
          Las tipografías se sirven localmente desde nuestro propio servidor. No existe{" "}
          <span className="text-paper">conexión con Google Fonts</span> ni con otros
          terceros; por ello, al mostrar la página no se transmite ninguna dirección IP a
          servicios de tipografías externos.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>5. Medición de audiencia (sin cookies, sin consentimiento)</LegalH2>
        <LegalP>
          Para mejorar nuestra oferta, registramos las visitas a la página de forma
          anonimizada y sin cookies en nuestra propia infraestructura (first-party). En
          este proceso:
        </LegalP>
        <LegalList
          items={[
            "no se establecen cookies ni se realiza reconocimiento entre dispositivos",
            "no se almacenan direcciones IP de forma permanente — solo se usan en el momento del procesamiento para derivar el país y un valor de verificación no reversible que rota diariamente, y se descartan de inmediato",
            "se procesan, de forma anonimizada, la ruta visitada, el dominio de referencia, el país aproximado, el tipo de navegador, el sistema operativo y el tipo de dispositivo (escritorio/móvil/tableta)",
          ]}
        />
        <LegalP>
          La medición de audiencia se ejecuta en nuestra propia infraestructura
          autoalojada (Umami, servidores en la UE) — no se transfieren datos a
          terceros ni a terceros países. Se respetan las señales{" "}
          <span className="text-paper">Do Not Track (DNT)</span> y{" "}
          <span className="text-paper">Global Privacy Control (GPC)</span>: si alguna de
          ellas está activa en su navegador, no se realiza ninguna medición. Base jurídica:
          artículo 6.1.f del RGPD.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>6. Contacto y formulario de contacto</LegalH2>
        <LegalP>
          Si nos contacta a través del formulario o por correo electrónico, procesamos los
          datos que nos facilite (p. ej., nombre, correo electrónico, empresa, mensaje)
          para gestionar su consulta. Base jurídica: artículo 6.1.b del RGPD (medidas
          precontractuales) o artículo 6.1.f (respuesta a consultas). Los datos se eliminan
          en cuanto dejan de ser necesarios y no existen obligaciones legales de
          conservación.
        </LegalP>
        <LegalP>
          En el test de nivel de inglés procesamos además sus respuestas
          (opción múltiple, texto libre) y, opcionalmente, una grabación de voz
          que usted realiza para la tarea de expresión oral, siempre que
          permita el acceso al micrófono en su navegador. Estos datos se
          envían por correo electrónico a nuestro equipo junto con los datos
          de contacto facilitados, para poder valorar de forma individual su
          respuesta escrita y oral. Base jurídica: artículo 6.1.b del RGPD
          (medidas precontractuales para determinar una oferta formativa
          adecuada). La grabación de voz no se almacena de forma permanente en
          nuestra web — solo se transmite por correo electrónico — y se
          elimina en cuanto ya no es necesaria para la valoración. Puede
          completar el test sin la tarea de expresión oral si no consiente el
          acceso al micrófono.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>6a. Boletín de marketing (consentimiento opcional)</LegalH2>
        <LegalP>
          En nuestro formulario de contacto puede además, de forma voluntaria
          e independiente de su consulta, dar su consentimiento para recibir
          actualizaciones por correo electrónico sobre nuevos formatos de
          curso, módulos de e-learning y fechas (art. 6.1.a RGPD). Esta
          casilla no está marcada por defecto y no es un requisito para
          tramitar su consulta.
        </LegalP>
        <LegalP>
          Utilizamos un procedimiento de doble consentimiento (double opt-in):
          tras el envío recibirá un correo de confirmación con un enlace.
          Solo tras hacer clic en dicho enlace se activa la suscripción y
          queda documentado su consentimiento (fecha/hora, dirección IP). Si
          no confirma, el registro se elimina automáticamente. Puede revocar
          su consentimiento en cualquier momento con efecto futuro — al final
          de cada correo publicitario encontrará un enlace de baja.
        </LegalP>
        <LegalP>
          <span className="text-paper">Clientes existentes:</span> Si ya ha
          reservado una formación de pago con nosotros, podemos utilizar la
          dirección de correo facilitada en la reserva para informarle sobre
          servicios propios similares (p. ej., cursos de continuación) sin
          consentimiento independiente, cuando la legislación aplicable lo
          permita — siempre con un derecho de oposición claro y gratuito,
          tanto en la reserva como en cada correo posterior.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>6b. Promoción «2 clases gratuitas»</LegalH2>
        <LegalP>
          A través de una ventana informativa de nuestro sitio web puede
          solicitar un código de vale hasta el 31/12/2026. Para ello tratamos su
          nombre, su dirección de correo electrónico, el idioma del sitio web y
          el momento en que confirmó haber leído esta política de privacidad.
          Solo generamos el código después de que haya confirmado su dirección
          de correo mediante el enlace de nuestro correo de confirmación. A
          continuación almacenamos además el código, el momento de la
          confirmación y, cuando lo canjee, cuándo y por quién se marcó como
          canjeado. Base jurídica: artículo 6.1.b del RGPD (ejecución de la
          promoción que usted ha solicitado).
        </LegalP>
        <LegalP>
          Tras la confirmación creamos en nuestro sistema de gestión de clientes
          una entrada de cliente potencial con su nombre y dirección de correo,
          para poder asignar el código a su solicitud o contratación y preparar
          una oferta adecuada (artículo 6.1.f del RGPD, interés legítimo en la
          preparación de un contrato). Puede oponerse a este tratamiento en
          cualquier momento, p. ej., por correo electrónico a nuestra dirección
          de contacto. Sin su consentimiento específico para el boletín no
          recibirá de nosotros correos publicitarios.
        </LegalP>
        <LegalP>Plazo de conservación:</LegalP>
        <LegalList
          items={[
            "solicitudes no confirmadas: eliminación automática a los 30 días",
            "códigos no canjeados: eliminación el 30/06/2027, tres meses después del fin del periodo de canje (31/03/2027)",
            "códigos canjeados: pasan a formar parte de la documentación de su contratación y están sujetos a los plazos legales de conservación",
            "entrada de cliente potencial: eliminación o anonimización si no se celebra ningún contrato en un plazo de 24 meses",
          ]}
        />
        <LegalP>
          De forma voluntaria, puede suscribirse además a nuestro boletín en la
          ventana informativa, en la página de confirmación o a través del correo
          con su código. El vale no depende de ello. La suscripción solo es
          efectiva cuando usted la activa con un clic propio tras confirmar su
          dirección de correo; como prueba almacenamos la fecha y hora, la
          dirección IP y el texto de su consentimiento. Por lo demás, se aplica
          el apartado 6a.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>7. Reservas y procesamiento de pagos</LegalH2>
        <LegalP>
          Para las reservas procesamos los datos necesarios para la ejecución del contrato
          (artículo 6.1.b del RGPD). El procesamiento de pagos se realiza a través de{" "}
          <Val value={extras.paymentProvider} placeholder="proveedor de servicios de pago, p. ej. Stripe" /> — una
          vez activado, con su propia política de privacidad y contrato de encargo de
          tratamiento. Los detalles se completarán en cuanto la integración de pagos esté
          operativa.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>8. Asistente de chat «Lexi»</LegalH2>
        <LegalP>
          A través del chat puede formular preguntas. Sus mensajes se procesan para
          responderle y, en su caso, se almacenan para poder contactarle. El
          procesamiento/reenvío se realiza a través del{" "}
          <Val
            value={extras.aiBackendNote?.es}
            placeholder="componente de IA/backend utilizado y su base jurídica/contrato de encargo de tratamiento"
          />
          . Por favor, no introduzca en el chat categorías especiales de datos personales.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>9. Sus derechos</LegalH2>
        <LegalP>Conforme al RGPD, usted tiene derecho a:</LegalP>
        <LegalList
          items={[
            "acceso (art. 15), rectificación (art. 16) y supresión (art. 17)",
            "limitación del tratamiento (art. 18) y portabilidad de los datos (art. 20)",
            "oposición al tratamiento basado en el art. 6.1.f (art. 21)",
            "presentar una reclamación ante una autoridad de control de protección de datos (art. 77)",
          ]}
        />
        <LegalP>
          Para ejercer estos derechos basta con una comunicación informal al responsable
          mencionado anteriormente. Autoridad de control competente:{" "}
          <Val
            value={legal.supervisoryAuthority}
            placeholder="autoridad de control de protección de datos competente"
          />
          .
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>10. Fecha y modificaciones</LegalH2>
        <LegalP>
          Actualizaremos esta política de privacidad en cuanto cambie el tratamiento de
          datos (p. ej., al activar la integración de pagos). Fecha de la última
          actualización: <DateVal value={extras.lastUpdated} lang="es" placeholder="fecha" />.
        </LegalP>
      </div>
    </>
  );
}
