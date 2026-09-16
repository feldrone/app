/**
 * Central content source for the FEL DRONE corporate website — V10.
 *
 * V10 reconstruction from Golden V8 (f5b29cc).
 * Preserves V8 legal identity, contacts, leadership structure.
 * Expands services to 7 poles per V10 spec, with truthful wording.
 *
 * EDITORIAL RULES (V10):
 * - No invented prices, drone models, sensors, flight times, accuracy,
 *   payloads, certifications, partnerships, clients, testimonials, stats.
 * - Unknown specs = "À compléter"
 * - Registry fields (rc, rcDate, capital) internal only, never in marketing UI
 * - Amine note exactly "Étudiant en informatique."
 * - Roles use uppercase ACTIONNAIRE per spec
 */

import { serviceImages, type Img } from "../lib/images";

export const company = {
  legalName: "SARL FEL DRONE",
  shortName: "FEL DRONE",
  /** Internal record — Mentions légales only */
  rc: "776099",
  /** Internal record — not rendered */
  rcDate: "28.07.2026",
  /** Internal record only */
  capital: "1 000 000 DA",
  addressLine1: "Cité 150 Logements B",
  addressLine2: "Commune de Aïn El Assel, Wilaya d'El Tarf",
  city: "El Tarf",
  country: "Algérie",
  plusCode: "Q9JM+542",
  email: "contact.feldrone@gmail.com",
  phone: "+213 6 61 61 33 99",
  phoneHref: "+213661613399",
  url: "https://www.feldrone.dz",
  gerant: "Yassine Fellah",
};

export type TeamMember = {
  name: string;
  role: string;
  note?: string;
  initials: string;
};

export const team: TeamMember[] = [
  {
    name: "Yassine Fellah",
    role: "ACTIONNAIRE — DIRECTEUR & GÉRANT",
    note: "Responsable légal et administratif de la société.",
    initials: "YF",
  },
  {
    name: "Menouar Fellah",
    role: "ACTIONNAIRE — CONSEILLER AVIATION & OPÉRATIONS",
    note: "Cadre de l'aviation (à la retraite) — référent de la supervision des vols et de la culture sécurité.",
    initials: "MF",
  },
  {
    name: "Amine Fellah",
    role: "ACTIONNAIRE — RESPONSABLE TECHNIQUE & SYSTÈMES",
    note: "Étudiant en informatique.",
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
  steps: string[];
  cta: ServiceCta;
  image: Img;
  priority: "primary" | "secondary";
};

export const services: Service[] = [
  {
    slug: "topographie",
    index: "01",
    title: "Topographie & photogrammétrie",
    tag: "Relevés",
    intro:
      "Relevés aériens par drone pour orthophotos géoréférencées, modèles numériques et plans — sur devis, étude selon le besoin.",
    points: [
      "Orthophotos géoréférencées — exemple de démonstration",
      "Modèles numériques de terrain (MNT) — À compléter selon capteur",
      "Plans topographiques — tarification selon la mission",
    ],
    steps: [
      "Cadrage du site et définition des livrables",
      "Plan de vol et vérifications réglementaires",
      "Acquisition et contrôle qualité terrain",
      "Traitement et livraison — sur devis",
    ],
    cta: { label: "Demander un devis", verb: "devis" },
    image: serviceImages.topographie,
    priority: "primary",
  },
  {
    slug: "suivi-chantier",
    index: "02",
    title: "Suivi & inspection de chantier",
    tag: "BTP & suivi",
    intro:
      "Suivi d'avancement et inspection visuelle régulière du chantier — documentation horodatée, observations techniques, sans garantie de résultat.",
    points: [
      "Suivi photographique périodique",
      "Documentation des zones sensibles",
      "Observations sécurité et technique — rapport sur devis",
    ],
    steps: [
      "Définition du périmètre et des points d'attention",
      "Plan de vol et autorisations d'accès",
      "Acquisition photo et vidéo",
      "Rapport d'avancement — tarification selon la mission",
    ],
    cta: { label: "Demander une prestation", verb: "prestation" },
    image: serviceImages.inspection,
    priority: "primary",
  },
  {
    slug: "maintenance",
    index: "03",
    title: "Maintenance & diagnostic drone",
    tag: "Atelier",
    intro:
      "Diagnostic, réparation et étalonnage des drones et capteurs — traçabilité à chaque étape, étude selon le besoin.",
    points: [
      "Diagnostic technique approfondi — À compléter selon modèle",
      "Réparation et remise en service — sur devis",
      "Étalonnage et calibration — tarification selon la mission",
    ],
    steps: [
      "Diagnostic et devis — sur devis",
      "Contrôle technique",
      "Intervention en atelier",
      "Vérification finale et restitution",
    ],
    cta: { label: "Demander un devis", verb: "devis" },
    image: serviceImages.maintenance,
    priority: "primary",
  },
  {
    slug: "thermographie",
    index: "04",
    title: "Thermographie",
    tag: "Inspection",
    intro:
      "Inspection thermographique par drone pour relevés thermiques — sur devis, selon le besoin et l'accessibilité du site.",
    points: [
      "Relevés thermiques aériens — exemple de démonstration",
      "Détection d'anomalies thermiques — interprétation à compléter",
      "Rapport visuel — tarification selon la mission",
    ],
    steps: [
      "Cadrage de la zone et des objectifs",
      "Plan de vol et conditions d'acquisition",
      "Acquisition thermique",
      "Livraison des visuels et observations — sur devis",
    ],
    cta: { label: "Demander une prestation", verb: "prestation" },
    image: serviceImages.thermographie,
    priority: "secondary",
  },
  {
    slug: "agriculture",
    index: "05",
    title: "Agriculture",
    tag: "Précision",
    intro:
      "Imagerie agricole par drone (NDVI, suivi de parcelles) — prestations sur étude, sans promesse de rendement.",
    points: [
      "Imagerie NDVI — exemple de démonstration",
      "Suivi de parcelles — À compléter",
      "Cartes de vigueur — tarification selon la mission",
    ],
    steps: [
      "Définition de la parcelle et de l'objectif",
      "Plan de vol et fenêtre d'acquisition",
      "Acquisition",
      "Livraison des cartes — sur devis",
    ],
    cta: { label: "Demander une prestation", verb: "prestation" },
    image: serviceImages.agriculture,
    priority: "secondary",
  },
  {
    slug: "vente",
    index: "06",
    title: "Vente",
    tag: "Commerce",
    intro:
      "Drones professionnels et accessoires — sélection selon l'usage, testés avant remise, sur devis.",
    points: [
      "Aéronefs professionnels — À compléter selon disponibilité",
      "Capteurs et accessoires — sur devis",
      "Pièces de rechange — tarification selon la mission",
    ],
    steps: [
      "Expression du besoin et du cas d'usage",
      "Sélection du matériel et configuration — À compléter",
      "Tests et vérifications avant remise",
      "Livraison et prise en main",
    ],
    cta: { label: "Demander un devis", verb: "devis" },
    image: serviceImages.vente,
    priority: "secondary",
  },
  {
    slug: "location",
    index: "07",
    title: "Location",
    tag: "Flotte",
    intro:
      "Mise à disposition ponctuelle d'aéronefs entretenus, sous supervision opérationnelle stricte — sur devis.",
    points: [
      "Flotte entretenue et calibrée — À compléter",
      "Supervision opérationnelle",
      "Missions ponctuelles — tarification selon la mission",
    ],
    steps: [
      "Définition de la mission et de la durée",
      "Disponibilité et devis — sur devis",
      "Préparation du matériel et briefing",
      "Restitution et contrôle",
    ],
    cta: { label: "Louer un drone", verb: "location" },
    image: serviceImages.location,
    priority: "secondary",
  },
];

export type FaqItem = { q: string; a: string };

export const faq: FaqItem[] = [
  {
    q: "Proposez-vous des relevés topographiques par drone ?",
    a: "Oui — topographie & photogrammétrie : orthophotos géoréférencées, MNT, plans selon le besoin. Chaque demande fait l'objet d'une étude et d'un devis ; la tarification dépend de la surface, de l'accessibilité et des livrables attendus.",
  },
  {
    q: "Comment se déroule un suivi de chantier ?",
    a: "Définition du périmètre et des points d'attention, plan de vol et autorisations d'accès, acquisition photo/vidéo, puis rapport d'avancement horodaté. Sur devis, tarification selon la mission.",
  },
  {
    q: "Le service de location est-il destiné aux particuliers ou aux entreprises ?",
    a: "La flotte est mise à disposition pour des missions ponctuelles, sous supervision opérationnelle stricte — un cadre pensé pour des usages professionnels. Décrivez votre projet : nous évaluons la faisabilité et les conditions adaptées. Sur devis.",
  },
  {
    q: "Combien de temps prend une opération de maintenance ?",
    a: "La durée dépend de la nature de l'intervention. Le diagnostic préalable permet de communiquer un délai avant toute intervention. Sur devis.",
  },
  {
    q: "Intervenez-vous dans toute l'Algérie ?",
    a: "Implantés à El Tarf, commune de Aïn El Assel. Pour les projets hors zone immédiate, indiquez la wilaya du besoin : nous étudions la logistique et répondons sur la faisabilité. Tarification selon la mission.",
  },
  {
    q: "Comment demander un devis ?",
    a: "Formulaire en bas de page (nom, téléphone, société, wilaya du besoin, service demandé, précisions utiles) ou appel direct. Plus le contexte est précis, plus le chiffrage est juste. Sur devis.",
  },
];

export const activities = [
  "Commerce de gros et de détail en drones et accessoires",
  "Location d'aéronefs télépilotés",
  "Maintenance, diagnostic et calibration",
  "Prestations de services par drone — topographie & photogrammétrie, suivi & inspection de chantier, thermographie, agriculture",
];

export const navLinks = [
  { href: "#expertise", label: "Expertise" },
  { href: "#services", label: "Services" },
  { href: "#methode", label: "Méthode" },
  { href: "#demonstration", label: "Démonstration" },
  { href: "#equipement", label: "Équipement" },
  { href: "#securite", label: "Sécurité" },
  { href: "#direction", label: "Entreprise" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export const sectors = [
  { label: "Topographie", value: "Orthophoto, MNT, photogrammétrie — sur devis" },
  { label: "BTP & suivi", value: "Suivi de chantier, inspection — tarification selon la mission" },
  { label: "Maintenance", value: "Diagnostic & étalonnage — étude selon le besoin" },
  { label: "Agriculture", value: "NDVI & suivi de parcelles — exemple de démonstration" },
];

export const methodSteps = [
  {
    n: "01",
    title: "Expression du besoin",
    desc: "Nom, société, wilaya du besoin, service demandé, précisions utiles — le contexte d'abord.",
  },
  {
    n: "02",
    title: "Étude & faisabilité",
    desc: "Vérification de la faisabilité technique et réglementaire, sans promesse.",
  },
  {
    n: "03",
    title: "Devis — sur devis",
    desc: "Tarification selon la mission, livrables et contraintes d'accès.",
  },
  {
    n: "04",
    title: "Planification",
    desc: "Plan de vol, autorisations, météo, briefing — huit étapes, zéro improvisation.",
  },
  {
    n: "05",
    title: "Préparation terrain",
    desc: "Check-list matériel, calibration, sécurité — contrôle pré-vol au sol.",
  },
  {
    n: "06",
    title: "Acquisition",
    desc: "Vol opéré, supervision stricte, traçabilité des prises.",
  },
  {
    n: "07",
    title: "Traitement & contrôle",
    desc: "Traitement des données, vérifications qualité — À compléter selon capteur.",
  },
  {
    n: "08",
    title: "Livraison & archivage",
    desc: "Livraison des livrables convenus, archivage — exemple de démonstration non issu d'une mission client.",
  },
];

export const demonstrationItems = [
  {
    slug: "orthophoto",
    title: "Orthophoto",
    desc: "Exemple de démonstration — non issu d'une mission client. Orthomosaïque géoréférencée — À compléter.",
  },
  {
    slug: "mnt",
    title: "MNT",
    desc: "Exemple de démonstration — non issu d'une mission client. Modèle numérique de terrain — À compléter.",
  },
  {
    slug: "ndvi",
    title: "NDVI",
    desc: "Exemple de démonstration — non issu d'une mission client. Carte de vigueur végétale — À compléter.",
  },
  {
    slug: "rapport",
    title: "Rapport",
    desc: "Exemple de démonstration — non issu d'une mission client. Rapport d'observation — tarification selon la mission.",
  },
];

export const equipmentCapabilities = [
  {
    category: "Aéronefs",
    items: [
      { label: "Multirotores professionnels", value: "À compléter — modèles selon disponibilité" },
      { label: "Autonomie", value: "À compléter" },
      { label: "Charge utile", value: "À compléter" },
    ],
  },
  {
    category: "Capteurs",
    items: [
      { label: "RGB / Photogrammétrie", value: "À compléter — capteur selon mission" },
      { label: "Thermique", value: "À compléter" },
      { label: "Multispectral / NDVI", value: "À compléter" },
    ],
  },
  {
    category: "Traitement",
    items: [
      { label: "Orthophoto", value: "Sur devis — exemple de démonstration" },
      { label: "MNT / Modélisation", value: "À compléter" },
      { label: "Livrables", value: "Tarification selon la mission" },
    ],
  },
];
