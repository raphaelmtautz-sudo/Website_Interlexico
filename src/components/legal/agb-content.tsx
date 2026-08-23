import { LegalH2, LegalP, PH, Val, DateVal } from "@/components/legal/legal";
import { lh, type Locale } from "@/lib/i18n";
import type { LegalData, LegalExtrasData } from "@/lib/cms";

export function AgbContent({
  lang,
  legal,
  extras,
}: {
  lang: Locale;
  legal: LegalData;
  extras: LegalExtrasData;
}) {
  if (lang === "en") return <En legal={legal} lang={lang} extras={extras} />;
  if (lang === "es") return <Es legal={legal} lang={lang} extras={extras} />;
  return <De legal={legal} lang={lang} extras={extras} />;
}

function De({ legal, lang, extras }: { legal: LegalData; lang: Locale; extras: LegalExtrasData }) {
  const jurisdiction = extras.jurisdictionOverride || legal.zipCity;
  return (
    <>
      <div className="space-y-3">
        <LegalH2>§ 1 Geltungsbereich</LegalH2>
        <LegalP>
          Diese AGB gelten für alle Verträge zwischen{" "}
          <Val value={legal.companyName} placeholder="Firmenname" /> (nachfolgend
          „Anbieter“) und dem Kunden über Trainingsleistungen und digitale Produkte.
          Sie gelten gegenüber Unternehmern im Sinne des § 14 BGB. Abweichende
          Bedingungen des Kunden werden nur mit ausdrücklicher schriftlicher
          Zustimmung Vertragsbestandteil.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 2 Vertragsschluss</LegalH2>
        <LegalP>
          Die Darstellung der Trainings und Produkte stellt kein bindendes Angebot
          dar. Mit der Buchung bzw. Anfrage gibt der Kunde ein Angebot ab; der
          Vertrag kommt durch Auftragsbestätigung des Anbieters bzw. durch
          Erbringung der Leistung zustande. Bei individuellen Firmentrainings gilt
          das jeweils gesondert vereinbarte Angebot.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 3 Leistungen</LegalH2>
        <LegalP>
          Umfang, Format (Einzel-, Gruppen- oder Klassentraining), Dauer und Ziele
          ergeben sich aus der jeweiligen Buchung bzw. dem individuellen Angebot.
          Der Anbieter erbringt die Leistungen mit fachlich qualifizierten
          Trainer:innen. Ein bestimmter Lernerfolg wird nicht geschuldet.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 4 Preise und Zahlung</LegalH2>
        <LegalP>
          Es gelten die zum Zeitpunkt der Buchung ausgewiesenen bzw. im Angebot
          genannten Preise. Alle Preise verstehen sich{" "}
          {extras.vatTreatment ? (
            <span className="text-paper">{extras.vatTreatment === "inkl" ? "inkl." : "zzgl."}</span>
          ) : (
            <PH>zzgl. / inkl.</PH>
          )}{" "}
          der gesetzlichen Umsatzsteuer. Die Zahlung erfolgt nach Rechnungsstellung
          innerhalb von{" "}
          {extras.paymentTermDays ? (
            <span className="text-paper">{extras.paymentTermDays} Tagen</span>
          ) : (
            <PH>Zahlungsziel, z. B. 14 Tagen</PH>
          )}{" "}
          bzw. über den angebotenen Zahlungsdienstleister.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 5 Termine, Absage und Stornierung</LegalH2>
        <LegalP>
          Vereinbarte Termine sind verbindlich. Absage- und Stornierungsfristen
          sowie etwaige Ausfallgebühren richten sich nach{" "}
          {extras.cancellationHours ? (
            <span className="text-paper">kostenfrei bis {extras.cancellationHours} Stunden vorher</span>
          ) : (
            <PH>konkrete Stornoregelung, z. B. kostenfrei bis 48 Stunden vorher</PH>
          )}
          . Vom Anbieter abgesagte Einheiten werden nachgeholt oder erstattet.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 6 Digitale Materialien und Nutzungsrechte</LegalH2>
        <LegalP>
          An digitalen Materialien erhält der Kunde ein einfaches, nicht
          übertragbares Nutzungsrecht für den internen Gebrauch. Eine
          Weitergabe, Vervielfältigung oder Veröffentlichung ist ohne Zustimmung
          des Anbieters unzulässig.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 7 Mitwirkung des Kunden</LegalH2>
        <LegalP>
          Der Kunde stellt die für die Durchführung erforderlichen Informationen
          (z. B. Teilnehmerdaten, Sprachniveau) rechtzeitig bereit und sorgt bei
          Online-Trainings für die notwendigen technischen Voraussetzungen.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 8 Haftung</LegalH2>
        <LegalP>
          Der Anbieter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit
          sowie bei Verletzung von Leben, Körper und Gesundheit. Bei einfacher
          Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher
          Vertragspflichten (Kardinalpflichten) und begrenzt auf den
          vertragstypischen, vorhersehbaren Schaden. Im Übrigen ist die Haftung
          ausgeschlossen.{" "}
          <Val value={extras.liabilityClause?.de} placeholder="Vor Verwendung anwaltlich prüfen lassen." />
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 9 Datenschutz</LegalH2>
        <LegalP>
          Informationen zur Verarbeitung personenbezogener Daten enthält unsere{" "}
          <a href={lh(lang, "/rechtliches/datenschutz")} className="link-underline text-gold">
            Datenschutzerklärung
          </a>
          .
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 10 Schlussbestimmungen</LegalH2>
        <LegalP>
          Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist,
          soweit zulässig, <Val value={jurisdiction} placeholder="Sitz des Anbieters" />. Sollten
          einzelne Bestimmungen unwirksam sein, bleibt der übrige Vertrag wirksam. Stand:{" "}
          <DateVal value={extras.lastUpdated} lang="de" placeholder="Datum" />.
        </LegalP>
      </div>
    </>
  );
}

function En({ legal, lang, extras }: { legal: LegalData; lang: Locale; extras: LegalExtrasData }) {
  const jurisdiction = extras.jurisdictionOverride || legal.zipCity;
  return (
    <>
      <div className="space-y-3">
        <LegalH2>§ 1 Scope</LegalH2>
        <LegalP>
          These terms apply to all contracts between{" "}
          <Val value={legal.companyName} placeholder="company name" /> (hereinafter
          the &quot;Provider&quot;) and the customer for training services and
          digital products. They apply to businesses within the meaning of
          Section 14 of the German Civil Code (BGB). Deviating customer terms
          only become part of the contract with the Provider&apos;s express
          written consent.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 2 Formation of contract</LegalH2>
        <LegalP>
          The presentation of trainings and products does not constitute a
          binding offer. By booking or submitting an enquiry, the customer
          makes an offer; the contract is formed upon the Provider&apos;s order
          confirmation or upon performance of the service. For individual
          corporate trainings, the separately agreed proposal applies.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 3 Services</LegalH2>
        <LegalP>
          Scope, format (one-on-one, group, or class training), duration, and
          goals follow from the respective booking or individual proposal. The
          Provider performs the services using professionally qualified
          trainers. No specific learning outcome is owed.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 4 Prices and payment</LegalH2>
        <LegalP>
          The prices shown at the time of booking or stated in the proposal
          apply. All prices are{" "}
          {extras.vatTreatment ? (
            <span className="text-paper">{extras.vatTreatment === "inkl" ? "including" : "plus"}</span>
          ) : (
            <PH>plus / including</PH>
          )}{" "}
          statutory VAT. Payment is due upon invoicing within{" "}
          {extras.paymentTermDays ? (
            <span className="text-paper">{extras.paymentTermDays} days</span>
          ) : (
            <PH>payment term, e.g. 14 days</PH>
          )}{" "}
          or via the payment service provider offered.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 5 Scheduling, cancellation, and rescheduling</LegalH2>
        <LegalP>
          Agreed appointments are binding. Cancellation deadlines and any
          related fees are governed by{" "}
          {extras.cancellationHours ? (
            <span className="text-paper">
              free of charge up to {extras.cancellationHours} hours in advance
            </span>
          ) : (
            <PH>specific cancellation policy, e.g. free of charge up to 48 hours in advance</PH>
          )}
          . Sessions cancelled by the Provider will be rescheduled or refunded.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 6 Digital materials and usage rights</LegalH2>
        <LegalP>
          For digital materials, the customer receives a simple,
          non-transferable right of use for internal purposes. Distribution,
          reproduction, or publication without the Provider&apos;s consent is
          not permitted.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 7 Customer cooperation</LegalH2>
        <LegalP>
          The customer provides the information required for delivery (e.g.
          participant data, language level) in good time and, for online
          training, ensures the necessary technical requirements are met.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 8 Liability</LegalH2>
        <LegalP>
          The Provider is liable without limitation for intent and gross
          negligence, and for injury to life, body, or health. In cases of
          simple negligence, the Provider is only liable for breach of
          material contractual obligations (cardinal obligations) and limited
          to the foreseeable damage typical for the type of contract. Liability
          is otherwise excluded.{" "}
          <Val value={extras.liabilityClause?.en} placeholder="Have this reviewed by a lawyer before use." />
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 9 Data protection</LegalH2>
        <LegalP>
          Information on the processing of personal data can be found in our{" "}
          <a href={lh(lang, "/rechtliches/datenschutz")} className="link-underline text-gold">
            Privacy Policy
          </a>
          .
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 10 Final provisions</LegalH2>
        <LegalP>
          German law applies. To the extent permitted, the place of
          jurisdiction is{" "}
          <Val value={jurisdiction} placeholder="the Provider's registered seat" />. Should
          individual provisions be invalid, the remainder of the contract
          remains in effect. Last updated:{" "}
          <DateVal value={extras.lastUpdated} lang="en" placeholder="date" />.
        </LegalP>
      </div>
    </>
  );
}

function Es({ legal, lang, extras }: { legal: LegalData; lang: Locale; extras: LegalExtrasData }) {
  const jurisdiction = extras.jurisdictionOverride || legal.zipCity;
  return (
    <>
      <div className="space-y-3">
        <LegalH2>§ 1 Ámbito de aplicación</LegalH2>
        <LegalP>
          Estas condiciones se aplican a todos los contratos entre{" "}
          <Val value={legal.companyName} placeholder="nombre de la empresa" /> (en
          adelante, el «Proveedor») y el cliente relativos a servicios de
          formación y productos digitales. Se aplican frente a empresarios en
          el sentido del artículo 14 del Código Civil alemán (BGB). Las
          condiciones distintas del cliente solo formarán parte del contrato
          con el consentimiento expreso y por escrito del Proveedor.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 2 Celebración del contrato</LegalH2>
        <LegalP>
          La presentación de las formaciones y productos no constituye una
          oferta vinculante. Con la reserva o la solicitud, el cliente realiza
          una oferta; el contrato se perfecciona mediante la confirmación del
          pedido por parte del Proveedor o mediante la prestación del
          servicio. Para formaciones corporativas individuales, se aplica la
          propuesta acordada por separado.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 3 Servicios</LegalH2>
        <LegalP>
          El alcance, el formato (clases individuales, en grupo o por
          departamento), la duración y los objetivos se derivan de la reserva
          correspondiente o de la propuesta individual. El Proveedor presta
          los servicios con formadores cualificados. No se garantiza un
          resultado de aprendizaje concreto.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 4 Precios y pago</LegalH2>
        <LegalP>
          Se aplican los precios indicados en el momento de la reserva o en la
          propuesta. Todos los precios se entienden{" "}
          {extras.vatTreatment ? (
            <span className="text-paper">{extras.vatTreatment === "inkl" ? "incluido" : "más"}</span>
          ) : (
            <PH>más / incluido</PH>
          )}{" "}
          el IVA legal. El pago se realiza tras la emisión de la factura en un
          plazo de{" "}
          {extras.paymentTermDays ? (
            <span className="text-paper">{extras.paymentTermDays} días</span>
          ) : (
            <PH>plazo de pago, p. ej. 14 días</PH>
          )}{" "}
          o a través del proveedor de servicios de pago ofrecido.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 5 Citas, cancelación y anulación</LegalH2>
        <LegalP>
          Las citas acordadas son vinculantes. Los plazos de cancelación y
          anulación, así como las posibles tarifas por inasistencia, se rigen
          por la{" "}
          {extras.cancellationHours ? (
            <span className="text-paper">cancelación gratuita hasta {extras.cancellationHours} horas antes</span>
          ) : (
            <PH>política de cancelación concreta, p. ej. gratuita hasta 48 horas antes</PH>
          )}
          . Las sesiones canceladas por el Proveedor se recuperarán o
          reembolsarán.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 6 Materiales digitales y derechos de uso</LegalH2>
        <LegalP>
          Sobre los materiales digitales, el cliente recibe un derecho de uso
          simple y no transferible para uso interno. Queda prohibida su
          cesión, reproducción o publicación sin el consentimiento del
          Proveedor.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 7 Colaboración del cliente</LegalH2>
        <LegalP>
          El cliente facilitará a tiempo la información necesaria para la
          ejecución (p. ej., datos de los participantes, nivel de idioma) y,
          en el caso de formaciones en línea, se encargará de los requisitos
          técnicos necesarios.
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 8 Responsabilidad</LegalH2>
        <LegalP>
          El Proveedor responde sin limitación en caso de dolo y negligencia
          grave, así como por daños a la vida, el cuerpo o la salud. En caso
          de negligencia leve, el Proveedor solo responde por incumplimiento
          de obligaciones contractuales esenciales y de forma limitada al daño
          previsible y típico del contrato. En todo lo demás, la
          responsabilidad queda excluida.{" "}
          <Val
            value={extras.liabilityClause?.es}
            placeholder="Hacer revisar por un abogado antes de su uso."
          />
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 9 Protección de datos</LegalH2>
        <LegalP>
          Encontrará información sobre el tratamiento de datos personales en
          nuestra{" "}
          <a href={lh(lang, "/rechtliches/datenschutz")} className="link-underline text-gold">
            Política de Privacidad
          </a>
          .
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>§ 10 Disposiciones finales</LegalH2>
        <LegalP>
          Se aplica el derecho de la República Federal de Alemania. El fuero
          competente, en la medida en que sea legalmente admisible, es el{" "}
          <Val value={jurisdiction} placeholder="domicilio social del Proveedor" />. Si alguna
          disposición fuera inválida, el resto del contrato permanecerá vigente. Fecha de la
          última actualización: <DateVal value={extras.lastUpdated} lang="es" placeholder="fecha" />.
        </LegalP>
      </div>
    </>
  );
}
