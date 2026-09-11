/**
 * Central content source for the FEL DRONE corporate website.
 *
 * Every factual value below comes from the company-supplied dossier
 * (legal identity, contacts, registered activities, leadership). Nothing
 * here is decorative: if it is not supported by the supplied data, it is
 * not on the site.
 *
 * EDITORIAL RULE — registry and financial fields (`rc`, `rcDate`,
 * `capital`) are internal records only. They are never rendered inside the
 * marketing experience (hero, sections, leadership, footer body); at most
 * the registry number appears in the discreet "Mentions légales" block,
 * reachable from the footer. Share capital is not displayed anywhere.
 *
 * Keeping structured data here — rather than hard-coded inside JSX — makes
 * it straightforward to extend later (new poles, new leadership entries,
 * localized content) without touching layout logic.
 */

import { pillarImages, type Img } from "../lib/images";

export const company = {
  legalName: "SARL FEL DRONE",
  shortName: "FEL DRONE",
  /** Internal record — Mentions légales only, never in marketing UI. */
  rc: "776099",
  /** Internal record — not rendered. */
  rcDate: "28.07.2026",
  /** Internal record only — do not display in the public interface. */
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
    note: "Cadre de l'aviation (à la retraite) — référent de la supervision des vols et de la culture sécurité.",
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
  { href: "#poles", label: "Services" },
  { href: "#securite", label: "Sécurité" },
  { href: "#direction", label: "Entreprise" },
  { href: "#contact", label: "Contact" },
];

/**
 * Application fields — rendered as the hero capability rail. Sourced
 * strictly from the four service poles; replaces the former registry /
 * share-capital strip, which has no place in a marketing layout.
 */
export const sectors = [
  { label: "Agriculture", value: "Imagerie NDVI & traitement de précision" },
  { label: "BTP & Topographie", value: "Relevés, plans et modélisation 3D" },
  { label: "Industrie", value: "Inspection thermographique des actifs" },
  { label: "Sécurité civile", value: "Appui opérationnel par drone" },
];
