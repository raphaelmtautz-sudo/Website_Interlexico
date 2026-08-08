export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Zentrale FAQ-Quelle — wird sowohl in der sichtbaren FAQ-Sektion als auch
 * als Schema.org FAQPage (JSON-LD) genutzt. Knappe, extrahierbare Antworten
 * (gut für Suchmaschinen und generative KI-Systeme / GEO).
 */
export const faq: FaqItem[] = [
  {
    question: "Für wen eignet sich das Sprachtraining?",
    answer:
      "Für Fach- und Führungskräfte sowie ganze Teams in Unternehmen der DACH-Region, die Englisch oder Deutsch in Verhandlungen, Präsentationen, Kundengesprächen oder internationaler Zusammenarbeit sicher einsetzen möchten.",
  },
  {
    question: "Welche Formate gibt es?",
    answer:
      "Einzelunterricht (1:1), Gruppentraining (max. 7 Personen) und Klassentraining für ganze Abteilungen. Jedes Training kalkulieren wir individuell nach Umfang und Zielen — Sie erhalten ein unverbindliches Angebot.",
  },
  {
    question: "Wie wird der Lernfortschritt gemessen?",
    answer:
      "Jedes Training beginnt mit einer präzisen Einstufung. Danach erhalten HR und Führungskräfte ein regelmäßiges Reporting, das den Fortschritt sichtbar und das Budget intern begründbar macht.",
  },
  {
    question: "Sind die Inhalte auf unsere Branche zugeschnitten?",
    answer:
      "Ja. Statt generischer Lehrbuchszenarien arbeiten wir mit Vokabular und Fallbeispielen aus Ihrer Branche und Ihrem Arbeitsalltag.",
  },
  {
    question: "Welche Sprachen und Trainings werden angeboten?",
    answer:
      "Wir bieten Business English (für sechs Kernbranchen) sowie Deutsch als Fremdsprache (branchenübergreifend für jede Rolle). Die Plattform ist modular aufgebaut, sodass weitere Sprach- und Kompetenztrainings ohne Neubau ergänzt werden.",
  },
  {
    question: "Wie starten wir?",
    answer:
      "Über den Konfigurator stellen Sie Ihr Wunsch-Training zusammen und senden eine unverbindliche Anfrage, oder Sie buchen direkt ein Beratungsgespräch. Wir klären Ziele, Teamgröße und Budget und schlagen einen passenden Trainingsplan vor.",
  },
];
