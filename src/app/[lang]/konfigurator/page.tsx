import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Accordion } from "@/components/ui/accordion";
import { Configurator } from "@/components/interactive/configurator";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh, type Locale } from "@/lib/i18n";

/**
 * Eigenständige, indexierbare Einstiegsseite des Trainings-Konfigurators.
 * Die Zwischenschritte laufen clientseitig ohne eigene URLs (nichts davon
 * gehört in den Index); die Übergabe-Parameter landen nur auf /kontakt.
 */
const PAGE: Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    text: string;
    home: string;
    faqTitle: string;
    faq: { question: string; answer: string }[];
  }
> = {
  de: {
    metaTitle: "Sprachtraining-Konfigurator für Unternehmen | Interlexico",
    metaDescription:
      "In sieben Schritten zur Empfehlung für Ihr Business-English- oder Deutschtraining: Format, Gruppen, Umfang und Beispiel-Trainingsplan. Kostenfrei und unverbindlich.",
    eyebrow: "Trainings-Konfigurator",
    title: "Ihr Sprachtraining in sieben Schritten",
    text: "Sagen Sie uns, wer teilnimmt, wo Ihr Team steht und was es können soll. Sie erhalten sofort eine begründete Empfehlung mit Format, Gruppenaufteilung, Umfang und Beispiel-Trainingsplan. Daraus erstellen wir Ihr individuelles Angebot.",
    home: "Startseite",
    faqTitle: "Häufige Fragen zum Konfigurator",
    faq: [
      {
        question: "Was kostet die Nutzung des Konfigurators?",
        answer: "Nichts. Der Konfigurator und die anschließende Anfrage sind kostenfrei und unverbindlich. Erst wenn Sie unserem Angebot zustimmen, entsteht ein Vertrag.",
      },
      {
        question: "Warum zeigt der Konfigurator keine Preise?",
        answer: "Weil wir jedes Training individuell kalkulieren: Format, Gruppengröße, Umfang, Anpassung an Ihre Branche und Durchführung verändern den Aufwand deutlich. Nach Ihrer Anfrage erhalten Sie in der Regel innerhalb von zwei Werktagen ein konkretes Angebot.",
      },
      {
        question: "Wie verbindlich ist die Empfehlung?",
        answer: "Sie ist eine fundierte Orientierung. Den genauen Trainingsplan legen wir nach der individuellen Einstufung und einer kurzen Bedarfsanalyse fest.",
      },
      {
        question: "Was passiert mit meinen Angaben?",
        answer: "Ihre Auswahl bleibt in Ihrem Browser, bis Sie selbst eine Anfrage absenden. Erst dann übermitteln wir sie zusammen mit Ihren Kontaktdaten an unser Team, um Ihnen ein Angebot zu erstellen. Details finden Sie in der Datenschutzerklärung.",
      },
    ],
  },
  en: {
    metaTitle: "Language training configurator for companies | Interlexico",
    metaDescription:
      "Seven steps to a recommendation for your Business English or German training: format, groups, scope and a sample training plan. Free and without obligation.",
    eyebrow: "Training configurator",
    title: "Your language training in seven steps",
    text: "Tell us who is taking part, where your team stands and what it needs to be able to do. You immediately get a reasoned recommendation with format, group split, scope and a sample training plan. We turn it into your individual quote.",
    home: "Home",
    faqTitle: "Frequently asked questions about the configurator",
    faq: [
      {
        question: "What does it cost to use the configurator?",
        answer: "Nothing. The configurator and the enquiry that follows are free and without obligation. A contract only comes about once you accept our quote.",
      },
      {
        question: "Why doesn't the configurator show prices?",
        answer: "Because we price every programme individually: format, group size, scope, industry tailoring and delivery change the effort considerably. After your enquiry you usually receive a concrete quote within two business days.",
      },
      {
        question: "How binding is the recommendation?",
        answer: "It is well-founded guidance. We set the exact training plan after the individual placement and a short needs analysis.",
      },
      {
        question: "What happens to my answers?",
        answer: "Your selection stays in your browser until you send an enquiry yourself. Only then do we pass it, together with your contact details, to our team to prepare a quote. See our privacy policy for details.",
      },
    ],
  },
  es: {
    metaTitle: "Configurador de formación de idiomas para empresas | Interlexico",
    metaDescription:
      "Siete pasos hasta una recomendación para su formación de inglés de negocios o alemán: formato, grupos, volumen y plan de ejemplo. Gratis y sin compromiso.",
    eyebrow: "Configurador de formación",
    title: "Su formación de idiomas en siete pasos",
    text: "Díganos quién participa, en qué nivel está su equipo y qué necesita saber hacer. Recibirá al momento una recomendación razonada con formato, división en grupos, volumen y un plan de formación de ejemplo. A partir de ella elaboramos su presupuesto individual.",
    home: "Inicio",
    faqTitle: "Preguntas frecuentes sobre el configurador",
    faq: [
      {
        question: "¿Cuánto cuesta usar el configurador?",
        answer: "Nada. El configurador y la solicitud posterior son gratuitos y sin compromiso. Solo hay contrato cuando usted acepta nuestro presupuesto.",
      },
      {
        question: "¿Por qué el configurador no muestra precios?",
        answer: "Porque calculamos cada formación de forma individual: el formato, el tamaño del grupo, el volumen, la adaptación a su sector y la modalidad cambian mucho el esfuerzo. Tras su solicitud recibirá normalmente un presupuesto concreto en dos días laborables.",
      },
      {
        question: "¿Hasta qué punto es vinculante la recomendación?",
        answer: "Es una orientación fundada. El plan de formación exacto lo definimos tras la evaluación de nivel individual y un breve análisis de necesidades.",
      },
      {
        question: "¿Qué pasa con mis respuestas?",
        answer: "Su selección permanece en su navegador hasta que usted mismo envía una solicitud. Solo entonces la transmitimos, junto con sus datos de contacto, a nuestro equipo para elaborar un presupuesto. Encontrará los detalles en la política de privacidad.",
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = PAGE[lang];
  return pageMetadata({ lang, path: "/konfigurator", title: t.metaTitle, description: t.metaDescription });
}

export default async function KonfiguratorPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = PAGE[lang];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t.home, path: lh(lang, "") },
          { name: t.eyebrow, path: lh(lang, "/konfigurator") },
        ]}
      />
      <Section className="pt-24 lg:pt-32">
        <div className="mb-12 max-w-3xl animate-rise">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="font-display text-5xl leading-[1.05] text-balance sm:text-6xl">{t.title}</h1>
          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-paper-dim">{t.text}</p>
        </div>
        <Configurator lang={lang} dict={dict} />
      </Section>
      <Section className="border-t border-line">
        <Container className="max-w-3xl">
          <h2 className="mb-8 font-display text-3xl text-paper">{t.faqTitle}</h2>
          <Accordion items={t.faq} />
          <FaqJsonLd items={t.faq} />
        </Container>
      </Section>
    </>
  );
}
