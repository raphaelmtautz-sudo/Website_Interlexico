import { LegalH2, LegalP, LegalList, PH } from "@/components/legal/legal";
import type { Locale } from "@/lib/i18n";

export function DatenschutzContent({ lang }: { lang: Locale }) {
  if (lang === "en") return <En />;
  if (lang === "es") return <Es />;
  return <De />;
}

function De() {
  return (
    <>
      <div className="space-y-3">
        <LegalH2>1. Verantwortlicher</LegalH2>
        <LegalP>
          Verantwortlich für die Datenverarbeitung auf dieser Website ist:{" "}
          <PH>Firmenname, Anschrift, E-Mail, vertretungsberechtigte Person</PH>. Bei
          Fragen zum Datenschutz erreichen Sie uns unter{" "}
          <PH>Datenschutz-Kontakt / ggf. Datenschutzbeauftragte:r</PH>.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>2. Hosting und Server-Logfiles</LegalH2>
        <LegalP>
          Die Website wird bei <PH>Hosting-Anbieter / eigene Serverinfrastruktur</PH>{" "}
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
          Speicherdauer der Logfiles: <PH>z. B. 7–30 Tage</PH>, anschließend Löschung
          bzw. Anonymisierung.
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
            "keine IP-Adressen und keine personenbeziehbaren Merkmale gespeichert",
            "lediglich aufgerufener Pfad und (sofern vorhanden) die Referrer-Domain in aggregierter Form verarbeitet",
          ]}
        />
        <LegalP>
          Die Signale <span className="text-paper">Do Not Track (DNT)</span> und{" "}
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
      </div>

      <div className="space-y-3">
        <LegalH2>7. Buchung und Zahlungsabwicklung</LegalH2>
        <LegalP>
          Für Buchungen verarbeiten wir die zur Vertragsdurchführung erforderlichen
          Daten (Art. 6 Abs. 1 lit. b DSGVO). Die Zahlungsabwicklung erfolgt über{" "}
          <PH>Zahlungsdienstleister, z. B. Stripe — sobald aktiviert, mit eigener
          Datenschutzinformation und Auftragsverarbeitung</PH>. Details ergänzen,
          sobald die Zahlungsintegration produktiv ist.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>8. Chat-Assistent „Lexi“</LegalH2>
        <LegalP>
          Über den Chat können Sie Fragen stellen. Ihre Eingaben werden zur
          Beantwortung verarbeitet und ggf. zur Kontaktaufnahme gespeichert.
          Verarbeitung/Weiterleitung erfolgt über <PH>eingesetzte
          KI-/Backend-Komponente und deren Rechtsgrundlage/Auftragsverarbeitung</PH>.
          Bitte geben Sie im Chat keine besonderen Kategorien personenbezogener
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
          <PH>zuständige Landes-/Datenschutzaufsichtsbehörde</PH>.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>10. Stand und Änderungen</LegalH2>
        <LegalP>
          Wir passen diese Datenschutzerklärung an, sobald sich die
          Datenverarbeitung ändert (z. B. bei Aktivierung der Zahlungsintegration).
          Stand: <PH>Datum</PH>.
        </LegalP>
      </div>
    </>
  );
}

function En() {
  return (
    <>
      <div className="space-y-3">
        <LegalH2>1. Controller</LegalH2>
        <LegalP>
          The controller responsible for data processing on this website is:{" "}
          <PH>company name, address, email, authorised representative</PH>. For
          privacy questions, contact us at{" "}
          <PH>privacy contact / data protection officer, if applicable</PH>.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>2. Hosting and server log files</LegalH2>
        <LegalP>
          The website is hosted by <PH>hosting provider / own server infrastructure</PH>.
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
          Log file retention period: <PH>e.g. 7–30 days</PH>, after which they
          are deleted or anonymised.
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
            "no IP addresses or personally identifiable characteristics are stored",
            "only the path accessed and (if present) the referrer domain are processed in aggregated form",
          ]}
        />
        <LegalP>
          <span className="text-paper">Do Not Track (DNT)</span> and{" "}
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
      </div>

      <div className="space-y-3">
        <LegalH2>7. Bookings and payment processing</LegalH2>
        <LegalP>
          For bookings we process the data required to perform the contract
          (Art. 6(1)(b) GDPR). Payment processing is carried out via{" "}
          <PH>payment service provider, e.g. Stripe — once activated, with its
          own privacy notice and data processing agreement</PH>. Details will
          be added once payment integration goes live.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>8. Chat assistant &quot;Lexi&quot;</LegalH2>
        <LegalP>
          You can ask questions via the chat. Your input is processed to
          provide an answer and may be stored to follow up with you.
          Processing/forwarding is carried out via{" "}
          <PH>the AI/backend component used and its legal basis/data
          processing agreement</PH>. Please do not enter special categories of
          personal data in the chat.
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
          <PH>relevant state/data protection supervisory authority</PH>.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>10. Version and changes</LegalH2>
        <LegalP>
          We will update this privacy policy whenever data processing changes
          (e.g. once payment integration is activated). Last updated:{" "}
          <PH>date</PH>.
        </LegalP>
      </div>
    </>
  );
}

function Es() {
  return (
    <>
      <div className="space-y-3">
        <LegalH2>1. Responsable del tratamiento</LegalH2>
        <LegalP>
          El responsable del tratamiento de datos en este sitio web es:{" "}
          <PH>nombre de la empresa, dirección, correo electrónico, persona con poder de representación</PH>. Para
          consultas sobre protección de datos, escríbanos a{" "}
          <PH>contacto de protección de datos / delegado de protección de datos, si procede</PH>.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>2. Alojamiento y archivos de registro del servidor</LegalH2>
        <LegalP>
          El sitio web está alojado en <PH>proveedor de alojamiento / infraestructura propia</PH>.
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
          Duración de conservación de los registros: <PH>p. ej., 7–30 días</PH>, tras lo cual
          se eliminan o anonimizan.
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
            "no se almacenan direcciones IP ni características que permitan identificar a personas",
            "solo se procesan, de forma agregada, la ruta visitada y (si existe) el dominio de referencia",
          ]}
        />
        <LegalP>
          Se respetan las señales <span className="text-paper">Do Not Track (DNT)</span> y{" "}
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
      </div>

      <div className="space-y-3">
        <LegalH2>7. Reservas y procesamiento de pagos</LegalH2>
        <LegalP>
          Para las reservas procesamos los datos necesarios para la ejecución del contrato
          (artículo 6.1.b del RGPD). El procesamiento de pagos se realiza a través de{" "}
          <PH>proveedor de servicios de pago, p. ej. Stripe — una vez activado, con su
          propia política de privacidad y contrato de encargo de tratamiento</PH>. Los
          detalles se completarán en cuanto la integración de pagos esté operativa.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>8. Asistente de chat «Lexi»</LegalH2>
        <LegalP>
          A través del chat puede formular preguntas. Sus mensajes se procesan para
          responderle y, en su caso, se almacenan para poder contactarle. El
          procesamiento/reenvío se realiza a través del{" "}
          <PH>componente de IA/backend utilizado y su base jurídica/contrato de encargo de tratamiento</PH>. Por
          favor, no introduzca en el chat categorías especiales de datos personales.
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
          <PH>autoridad de control de protección de datos competente</PH>.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>10. Fecha y modificaciones</LegalH2>
        <LegalP>
          Actualizaremos esta política de privacidad en cuanto cambie el tratamiento de
          datos (p. ej., al activar la integración de pagos). Fecha de la última
          actualización: <PH>fecha</PH>.
        </LegalP>
      </div>
    </>
  );
}
