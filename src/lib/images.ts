/**
 * Photography system — FEL DRONE.
 *
 * One coherent direction: authentic operational photography (real pilots,
 * real workshops, real field work). No renders, no sci-fi drones, no staged
 * "cheese". Every asset is licensed stock photography hosted on the Pexels
 * CDN under the Pexels License (free for commercial use, no attribution
 * required — see docs/IMAGES.md for the full inventory).
 *
 * Crops and compression are pinned through CDN parameters, so each image
 * renders at exactly the aspect ratio of its layout container — zero
 * cumulative layout shift — while `srcSet` lets the browser download only
 * the size it needs.
 *
 * NOTE — portability: if the company later hosts optimized files locally
 * (e.g. /images/hero-drone.webp), only the `src`/`srcSet` produced by
 * `photo()` below needs to change; components never hard-code a URL.
 */

export type Img = {
  alt: string;
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
};

/** Build a Pexels CDN URL: cropped to w×h, auto-compressed, sRGB. */
function pexels(id: number, w: number, h: number): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;
}

type PhotoConfig = {
  id: number;
  alt: string;
  /** Natural layout ratio, e.g. [4, 5] for a portrait column. */
  ratio: [number, number];
  /** Match the component's CSS layout to guide `sizes`. */
  sizes: string;
};

/**
 * Master file is 1600 px wide (covers a 5-column desktop image at 2× DPI);
 * a 800 px variant serves phones and narrow tablets.
 */
function photo({ id, alt, ratio, sizes }: PhotoConfig): Img {
  const [rw, rh] = ratio;
  const width = 1600;
  const height = Math.round((width * rh) / rw);
  const mWidth = 800;
  const mHeight = Math.round((mWidth * rh) / rw);
  return {
    alt,
    src: pexels(id, width, height),
    srcSet: `${pexels(id, mWidth, mHeight)} 800w, ${pexels(id, width, height)} 1600w`,
    sizes,
    width,
    height,
  };
}

/* ------------------------------------------------------------------ */
/* Section imagery                                                      */
/* ------------------------------------------------------------------ */

export const heroImage: Img = photo({
  id: 28467369,
  alt: "Télépilote en tenue opérationnelle contrôlant un drone professionnel face à un parc éolien",
  ratio: [4, 5],
  sizes: "(max-width: 1023px) 100vw, 44vw",
});

export const heritageImage: Img = photo({
  id: 15673268,
  alt: "Tableau de bord d'un poste de pilotage d'avion, instruments de vol et commandes",
  ratio: [4, 5],
  sizes: "(max-width: 1023px) 92vw, 38vw",
});

export const safetyImage: Img = photo({
  id: 11075016,
  alt: "Technicien effectuant l'inspection pré-vol d'un petit avion sur un aérodrome",
  ratio: [4, 5],
  sizes: "(max-width: 1023px) 92vw, 32vw",
});

/* ------------------------------------------------------------------ */
/* Business poles — consistent framing: hands-on, documentary, warm   */
/* natural light, no renders.                                           */
/* ------------------------------------------------------------------ */

export const pillarImages: Record<string, Img> = {
  commerce: photo({
    id: 34585109,
    alt: "Vue de dessus d'un drone et de sa radiocommande préparés pour le vol, matériel opérationnel",
    ratio: [16, 10],
    sizes: "(max-width: 1023px) 92vw, 46vw",
  }),
  location: photo({
    id: 9152367,
    alt: "Prise de vue aérienne d'une rivière serpentant entre forêts et montagnes",
    ratio: [16, 10],
    sizes: "(max-width: 1023px) 92vw, 46vw",
  }),
  maintenance: photo({
    id: 32208773,
    alt: "Technicien réparant un drone à l'établi, outils de précision en atelier",
    ratio: [16, 10],
    sizes: "(max-width: 1023px) 92vw, 46vw",
  }),
  services: photo({
    id: 34182316,
    alt: "Agriculteur pilotant un drone de traitement au-dessus d'une parcelle cultivée",
    ratio: [16, 10],
    sizes: "(max-width: 1023px) 92vw, 46vw",
  }),
};

/** 1200×630 crop for social preview cards. */
export const ogImageUrl = pexels(28467369, 1200, 630);
