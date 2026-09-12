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

import { serviceImages, type Img } from "../lib/images";

export const company = {
  legalName: "SARL FEL DRONE",
  shortName: "FEL DRONE",
  /** Internal record — Mentions légales only, never in marketing UI. */
  rc: "776099",
  /** Internal record — not rendered. */
  rcDate: "28.07.2026",
  /** Internal record only — do not display in the public interface. */
  capital: "1 000 000 DA",
  addressLine1: "Cité 150 Logements B",
  addressLine2: "Commune de Aïn El Assel, Wilaya d'El Tarf",
  city: "El Tarf",
  country: "Algérie",
  /** Precise business pin — Open Location Code (short form, resolved with
   *  the commune context). The map embed and the printed address share it. */
  plusCode: "Q9JM+542",
  email: "contact.feldrone@gmail.com",
  phone: "+213 6 61 61 33 99",
  phoneHref: "+213661613399",
  url: "https://www.feldrone.dz",
  /** Legal gérance (registry fact) — feeds Mentions légales only; never a
   *  marketing label, and never derived from the team array (roles change). */
  gerant: "Yassine Fellah",
};

/**
 * Leadership — kept intentionally minimal (one line of context each).
 * FEL DRONE, not the individuals, is the subject of the website.
 * Future partners or employees can be appended to this array; the layout
 * adapts automatically to 1..N entries.
 */
export type TeamMember = {
  name: string;
  /** Gold uppercase identity line: shareholder status and function as ONE
   *  statement ("Actionnaire — <function>"), rendered on a single line
   *  beside the name. Never split into a label + separate role line. */
  role: string;
  /** Optional one-line context — omitted entirely rather than invented. */
  note?: string;
  initials: string;
};

export const team: TeamMember[] = [
  {
    name: "Yassine Fellah",
    role: "Actionnaire — Directeur & Gérant",
    note: "Responsable légal et administratif de la société.",
    initials: "YF",
  },
  {
    name: "Menouar Fellah",
    role: "Actionnaire — Conseiller Aviation & Opérations",
    note: "Cadre de l'aviation (à la retraite) — référent de la supervision des vols et de la culture sécurité.",
    initials: "MF",
  },
  {
    name: "Amine Fellah",
    role: "Actionnaire — Responsable Technique & Systèmes",
    note: "Étudiant en informatique",
    initials: "AF",
  },
];

export type ServiceCta = { label: string; verb: "devis" | "location" | "prestation" };

export type Service = {
  slug: string;
  index: string;
  title: string;
  tag: string;
  intro: string;
  points: string[];
  /** Delivered workflow — how a standard engagement runs, no promises. */
  steps: string[];
  cta: ServiceCta;
  image: Img;
};

/**
 * The five public-facing services, one card each. Copy stays inside the
 * registered scope of the company (no invented capabilities, certifications
 * or guarantees) and each card carries a four-step "how it works" — process
 * description, not a promise of outcome.
 */
export const services: Service[] = [
  {
    slug: "vente",
    index: "01",
    title: "Vente",
    tag: "Commerce",
    intro:
      "Drones professionnels, capteurs thermiques et LiDAR, pièces de rechange — choisis pour l'usage, testés avant livraison.",
    points: [
      "Aéronefs professionnels et industriels",
      "Capteurs thermiques & LiDAR",
      "Pièces de rechange et accessoires",
    ],
    steps: [
      "Expression du besoin et du cas d'usage",
      "Sélection du matériel et configuration",
      "Tests et vérifications avant remise",
      "Livraison et prise en main",
    ],
    cta: { label: "Demander un devis", verb: "devis" },
    image: serviceImages.vente,
  },
  {
    slug: "location",
    index: "02",
    title: "Location",
    tag: "Flotte",
    intro:
      "Une flotte entretenue et calibrée, mise à disposition pour des missions ponctuelles sous supervision opérationnelle stricte.",
    points: [
      "Flotte entretenue et calibrée",
      "Supervision opérationnelle stricte",
      "Mise à disposition pour missions ponctuelles",
    ],
    steps: [
      "Définition de la mission et de la durée",
      "Disponibilité et devis",
      "Préparation du matériel et briefing",
      "Restitution et contrôle de l'équipement",
    ],
    cta: { label: "Louer un drone", verb: "location" },
    image: serviceImages.location,
  },
  {
    slug: "maintenance",
    index: "03",
    title: "Maintenance",
    tag: "Atelier",
    intro:
      "Réparation, diagnostic et étalonnage des systèmes de drones et de leurs capteurs, avec traçabilité à chaque étape.",
    points: [
      "Diagnostic technique approfondi",
      "Réparation et remise en service",
      "Étalonnage et calibration de précision",
    ],
    steps: [
      "Diagnostic",
      "Contrôle technique",
      "Intervention",
      "Vérification finale",
    ],
    cta: { label: "Demander un devis", verb: "devis" },
    image: serviceImages.maintenance,
  },
  {
    slug: "prestations",
    index: "04",
    title: "Prestations de services",
    tag: "Missions",
    intro:
      "Missions opérées par des télépilotes certifiés : cartographie, imagerie et suivi de sites, du champ à la donnée livrée.",
    points: [
      "Agriculture de précision (imagerie NDVI)",
      "Topographie et modélisation 3D pour le BTP",
      "Inspection thermographique industrielle",
      "Appui à la sécurité civile",
    ],
    steps: [
      "Cadrage du site et des objectifs",
      "Plan de vol et conformité réglementaire",
      "Acquisition sur site",
      "Livraison des données et rapport",
    ],
    cta: { label: "Demander une prestation", verb: "prestation" },
    image: serviceImages.prestations,
  },
  {
    slug: "inspection",
    index: "05",
    title: "Inspection sur chantier",
    tag: "BTP & actifs",
    intro:
      "Suivi d'avancement, documentation visuelle et observations de sécurité ou techniques — une lecture aérienne régulière du chantier.",
    points: [
      "Suivi d'avancement photographique",
      "Documentation visuelle des zones sensibles",
      "Observations sécurité et techniques",
    ],
    steps: [
      "Définition du périmètre et des points d'attention",
      "Plan de vol et autorisations d'accès",
      "Acquisition photo et vidéo",
      "Rapport d'avancement et visuels horodatés",
    ],
    cta: { label: "Demander une prestation", verb: "prestation" },
    image: serviceImages.inspection,
  },
];

/**
 * FAQ — answers stay inside what the company can actually commit to:
 * process, contact routes, registered scope. No prices, no delays,
 * no coverage claims.
 */
export type FaqItem = { q: string; a: string };

export const faq: FaqItem[] = [
  {
    q: "Le service de location est-il destiné aux particuliers ou aux entreprises ?",
    a: "La flotte est mise à disposition pour des missions ponctuelles, sous supervision opérationnelle stricte — un cadre pensé avant tout pour des usages professionnels. Décrivez-nous votre projet : nous évaluons ensemble la faisabilité et les conditions adaptées.",
  },
  {
    q: "Combien de temps prend une opération de maintenance ?",
    a: "La durée dépend de la nature de l'intervention — un simple étalonnage n'engage pas le même temps d'atelier qu'une réparation. Le diagnostic préalable permet de communiquer un délai avant toute intervention ; envoyez-nous les symptômes constatés et nous revenons vers vous avec une évaluation.",
  },
  {
    q: "Quels types d'inspections pouvez-vous réaliser ?",
    a: "Nous intervenons sur chantier (suivi d'avancement, documentation visuelle, observations de sécurité) et sur des actifs industriels via l'inspection thermographique. Chaque mission combine le vol d'acquisition et une restitution exploitable : visuels géolocalisés, rapports et données.",
  },
  {
    q: "Intervenez-vous dans toute l'Algérie ?",
    a: "FEL DRONE est implantée à El Tarf, à la frontière tunisienne. Pour les projets en dehors de notre zone immédiate, indiquez-nous le lieu de la mission : nous étudions la logistique et vous répondons clairement sur la faisabilité.",
  },
  {
    q: "Comment demander un devis ?",
    a: "Le plus simple : le formulaire « Demander un devis » en bas de page (nom, téléphone, service, contexte), ou un appel direct. Précisez le lieu, la période souhaitée et l'objectif de la mission — c'est ce qui nous permet de chiffrer juste, au plus près du besoin réel.",
  },
  {
    q: "Quels types de drones proposez-vous ?",
    a: "Des aéronefs professionnels et industriels — plates-formes multirotores pour l'inspection et les relevés, capteurs thermiques et LiDAR, accessoires et pièces de rechange — choisis pour l'usage visé, testés avant remise. Nous conseillons la configuration adaptée plutôt que le catalogue le plus large.",
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
  { href: "#services", label: "Services" },
  { href: "#securite", label: "Sécurité" },
  { href: "#direction", label: "Entreprise" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

/**
 * Application fields — rendered as the hero capability rail. Sourced
 * strictly from the four service poles; replaces the former registry /
 * share-capital strip, which has no place in a marketing layout.
 */
export const sectors = [
  { label: "Agriculture", value: "Imagerie NDVI & traitement de précision" },
  { label: "BTP & Topographie", value: "Relevés, modélisation 3D, suivi de chantier" },
  { label: "Industrie", value: "Inspection thermographique des actifs" },
  { label: "Sécurité civile", value: "Appui opérationnel par drone" },
];
