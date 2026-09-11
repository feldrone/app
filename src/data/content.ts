/**
 * Central content source for the FEL DRONE corporate website.
 *
 * Keeping structured data here (rather than hard-coded inside JSX) makes it
 * straightforward to extend later — e.g. adding new team members or poles —
 * without touching component markup or layout logic.
 */

export const company = {
  legalName: "SARL FEL DRONE",
  rc: "776099",
  rcDate: "28.07.2026",
  capital: "1 000 000 DA",
  addressLine1: "Cité 150 Logements",
  addressLine2: "Commune de Aïn El Assel, Wilaya d'El Tarf",
  country: "Algérie",
  email: "contact.feldrone@gmail.com",
  phone: "+213 6 61 61 33 99",
  phoneHref: "+213661613399",
};

/**
 * Leadership — kept intentionally minimal (executive-profile style).
 * FEL DRONE, not the individuals, remains the subject of the website.
 * Add future partners/team members to this array; the layout adapts
 * automatically (1 to N entries).
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
    note: "Colonel à la retraite de l'Armée de l'Air algérienne, ancien commandant C-130 et IL-76, certifications internationales en sécurité aérienne.",
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
  image: string;
  imageAlt: string;
};

export const pillars: Pillar[] = [
  {
    index: "01",
    title: "Commerce",
    summary:
      "Vente en gros et au détail de drones professionnels, capteurs thermiques et LiDAR, ainsi que pièces de rechange.",
    points: ["Drones professionnels et industriels", "Capteurs thermiques & LiDAR", "Pièces de rechange et accessoires"],
    image: "/images/pillar-commerce.jpg",
    imageAlt: "Mallette de matériel professionnel organisée avec drone, batteries et accessoires",
  },
  {
    index: "02",
    title: "Location",
    summary:
      "Flotte d'aéronefs télépilotés disponible à la location, exploitée sous supervision aéronautique rigoureuse.",
    points: ["Flotte entretenue et calibrée", "Supervision opérationnelle stricte", "Mise à disposition pour missions ponctuelles"],
    image: "/images/pillar-location.jpg",
    imageAlt: "Vue aérienne d'une vallée verdoyante, illustrant les capacités de prise de vue de la flotte",
  },
  {
    index: "03",
    title: "Maintenance",
    summary:
      "Atelier spécialisé en réparation, diagnostic et étalonnage des systèmes de drones et de leurs capteurs.",
    points: ["Diagnostic technique approfondi", "Réparation et remise en service", "Étalonnage et calibration de précision"],
    image: "/images/pillar-maintenance.jpg",
    imageAlt: "Technicienne effectuant la maintenance et le calibrage d'un drone en atelier",
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
    image: "/images/pillar-services.jpg",
    imageAlt: "Drone agricole en opération au-dessus d'un champ, agriculture de précision",
  },
];

export const navLinks = [
  { href: "#accueil", label: "Accueil" },
  { href: "#expertise", label: "L'Expertise" },
  { href: "#poles", label: "Nos 4 Pôles" },
  { href: "#direction", label: "Direction & Sécurité" },
  { href: "#contact", label: "Contact" },
];
