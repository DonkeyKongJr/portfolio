/**
 * SVG-Filter fuer die Lichtbrechung von Liquid Glass (Stufe 3, nur Chromium).
 *
 * Wird einmal im Body gerendert und von glass.module.css per
 * backdrop-filter: url(#lg-refract) referenziert. Safari und Firefox kennen
 * url() in backdrop-filter nicht - dort bleibt es beim Blur aus Stufe 2.
 *
 * Aufbau der Kette:
 *   feImage x2          Displacement-Map als data:-URI (CSP: img-src data:),
 *                       eine fuer die x-Richtung (Rotkanal), eine fuer y
 *                       (Gruenkanal), per preserveAspectRatio="none" auf die
 *                       Flaeche gezogen.
 *   feComposite         addiert beide zu einer RG-Map.
 *   feDisplacementMap   verschiebt den Hintergrund entlang der Map.
 *   feColorMatrix       etwas Saettigung, wie echtes Glas am Rand.
 *
 * Die Map ist in der Mitte neutral (128 = keine Verschiebung) und steigt zum
 * Rand steil an: links/oben > 128, rechts/unten < 128. Am Rand wird also
 * Hintergrund von weiter innen herangezogen - der gestauchte Saum einer
 * Sammellinse.
 *
 * Einheiten: filterUnits und primitiveUnits sind objectBoundingBox. Damit
 * passen Filterregion und Map auf jede Pillengroesse, und auch scale ist ein
 * Anteil der Flaechenbreite (0.05 = 44px bei der 880px-Nav, 7px bei einer
 * 140px-Pille). Weichgezeichnet wird bewusst nicht hier: stdDeviation waere in
 * diesen Einheiten ebenfalls relativ und auf breiten Pillen anisotrop. Das
 * uebernimmt das pixelgenaue blur() direkt hinter url() in der CSS-Kette.
 *
 * color-interpolation-filters="sRGB" ist Pflicht - im Standard linearRGB
 * waere 128 nicht mehr neutral und die ganze Flaeche verrutscht.
 */

/** Anteil der Breite, um den der Rand maximal verschoben wird. */
const SCALE = 0.05;

/** [Position 0..1, Kanalwert 0..255] - steil am Rand, flach zur Mitte. */
type Stops = readonly (readonly [number, number])[];

const STOPS_X: Stops = [
  [0, 255],
  [0.025, 222],
  [0.06, 172],
  [0.1, 128],
  [0.9, 128],
  [0.94, 84],
  [0.975, 34],
  [1, 0],
];

/*
 * Vertikal ist die Pille flach: der Saum darf anteilig breiter sein, der
 * Ausschlag aber nicht voll - scale haengt an der Breite, bei der 880px-Nav
 * waeren sonst 22px Versatz auf 56px Hoehe. 224/32 begrenzt auf rund 16px.
 */
const STOPS_Y: Stops = [
  [0, 224],
  [0.08, 196],
  [0.2, 156],
  [0.34, 128],
  [0.66, 128],
  [0.8, 100],
  [0.92, 60],
  [1, 32],
];

function map(axis: 'x' | 'y', stops: Stops): string {
  const color = (v: number) => (axis === 'x' ? `rgb(${v},0,0)` : `rgb(0,${v},0)`);
  const end = axis === 'x' ? "x2='1' y2='0'" : "x2='0' y2='1'";
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' preserveAspectRatio='none'>" +
    `<linearGradient id='g' x1='0' y1='0' ${end}>` +
    stops.map(([at, v]) => `<stop offset='${at}' stop-color='${color(v)}'/>`).join('') +
    "</linearGradient><rect width='1' height='1' fill='url(#g)'/></svg>";
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const MAP_X = map('x', STOPS_X);
const MAP_Y = map('y', STOPS_Y);

export function GlassFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      // Nicht display:none - sonst ignoriert Chromium den Filter.
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <filter
        id="lg-refract"
        x="0"
        y="0"
        width="1"
        height="1"
        filterUnits="objectBoundingBox"
        primitiveUnits="objectBoundingBox"
        colorInterpolationFilters="sRGB"
      >
        <feImage
          href={MAP_X}
          x="0"
          y="0"
          width="1"
          height="1"
          preserveAspectRatio="none"
          result="mapX"
        />
        <feImage
          href={MAP_Y}
          x="0"
          y="0"
          width="1"
          height="1"
          preserveAspectRatio="none"
          result="mapY"
        />
        <feComposite in="mapX" in2="mapY" operator="arithmetic" k2="1" k3="1" result="map" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale={SCALE}
          xChannelSelector="R"
          yChannelSelector="G"
          result="refracted"
        />
        <feColorMatrix in="refracted" type="saturate" values="1.15" />
      </filter>
    </svg>
  );
}
