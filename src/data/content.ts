/**
 * Central content source for the FEL DRONE corporate website.
 *
 * Every factual value below comes from the company-supplied dossier
 * (legal identity, RC registry data, contacts, registered activities,
 * leadership). Nothing here is decorative: if it is not supported by the
 * supplied data, it is not on the site.
 *
 * Keeping structured data here — rather than hard-coded inside JSX — makes
 * it straightforward to extend later (new poles, new leadership entries,
 * localized content) without touching layout logic.
 */

import { pillarImages, type Img } from "../lib/images";

export const company = {
  legalName: "SARL FEL DRONE",
  shortName: "FEL DRONE",
  rc: "776099",
  rcDate: "28.07.2026",
  capital: "1 000 000 DA",
  addressLine1: "Cité 150 Logements",
  addressLine2: "Commune de Aïn El Assel, Wilaya d'El Tarf",
  city: "El Tarf",
  country: "Algérie",
  email: "contact.feldrone@gmail.com",
  phone: "+213 6 61 61 33 99",
  phoneHref: "+213661613399",
  url: "https://www.feldrone.dz",
};

/**
 * Leadership — kept intentionally minimal (one line of context each).
 * FEL DRONE, not the individuals, is the subject of the website.
 * Future partners or employees can be appended to this array; the layout
 * adapts automatically to 1..N entries.
 */
export type TeamMember = {
  name: string;
  role: string;
  note: string;
  initials: string;
};

export const team: TeamMember[] = [
  {
    name: "Yassine Fellah",
    role: "Gérant",
    note: "Responsable légal et administratif de la société.",
    initials: "YF",
  },
  {
    name: "Menouar Fellah",
    role: "Partenaire — Aviation & Opérations",
    note: "Colonel (à la retraite) de l'Armée de l'Air, ancien commandant de bord C-130 et IL-76. Référence de la supervision des vols et de la culture sécurité.",
    initials: "MF",
  },
  {
    name: "Amine Fellah",
    role: "Responsable Technique & Systèmes",
    note: "Télépilote professionnel certifié Classe 3, spécialisé en systèmes embarqués et automatisation.",
    initials: "AF",
  },
];

export type Pillar = {
  index: string;
  title: string;
  summary: string;
  points: string[];
  image: Img;
};

export const pillars: Pillar[] = [
  {
    index: "01",
    title: "Commerce",
    summary:
      "Vente en gros et au détail de drones professionnels, de capteurs thermiques et LiDAR, ainsi que de pièces de rechange.",
    points: [
      "Drones professionnels et industriels",
      "Capteurs thermiques & LiDAR",
      "Pièces de rechange et accessoires",
    ],
    image: pillarImages.commerce,
  },
  {
    index: "02",
    title: "Location",
    summary:
      "Une flotte d'aéronefs télépilotés, entretenue et calibrée, mise à disposition de missions ponctuelles sous supervision aéronautique.",
    points: [
      "Flotte entretenue et calibrée",
      "Supervision opérationnelle stricte",
      "Mise à disposition pour missions ponctuelles",
    ],
    image: pillarImages.location,
  },
  {
    index: "03",
    title: "Maintenance",
    summary:
      "Atelier spécialisé en réparation, diagnostic et étalonnage des systèmes de drones et de leurs capteurs.",
    points: [
      "Diagnostic technique approfondi",
      "Réparation et remise en service",
      "Étalonnage et calibration de précision",
    ],
    image: pillarImages.maintenance,
  },
  {
    index: "04",
    title: "Prestations de services",
    summary:
      "Missions opérées par des télépilotes certifiés, au service de l'agriculture, du BTP, de l'industrie et de la sécurité civile.",
    points: [
      "Agriculture de précision (imagerie NDVI)",
      "Topographie et modélisation 3D pour le BTP",
      "Inspection thermographique industrielle",
      "Appui à la sécurité civile",
    ],
    image: pillarImages.services,
  },
];

/** Registered activities — as stated on the commercial registry. */
export const activities = [
  "Commerce de gros et de détail en drones et accessoires",
  "Location d'aéronefs télépilotés",
  "Maintenance, diagnostic et calibration",
  "Prestations de services par drone",
];

export const navLinks = [
  { href: "#expertise", label: "Expertise" },
  { href: "#poles", label: "Pôles d'activité" },
  { href: "#securite", label: "Sécurité" },
  { href: "#direction", label: "Direction" },
  { href: "#contact", label: "Contact" },
];

/** Corporate facts shown under the hero — strictly legal identity data. */
export const facts = [
  { label: "Siège social", value: "El Tarf, Algérie" },
  { label: "Capital social", value: "1 000 000 DA" },
  { label: "Registre de commerce", value: "N° 776099" },
  { label: "Télépilotes", value: "Certifiés Classe 3" },
];
