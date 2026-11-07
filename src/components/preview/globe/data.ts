/* Shared data for the globe preview. Illustrative only: no stats, no brands. */

/** Tech hubs that launch most of the arcs. [lat, lon] */
export const CITIES: [number, number][] = [
  [37.77, -122.42], [47.61, -122.33], [34.05, -118.24], [30.27, -97.74], [40.71, -74.0], [43.65, -79.38],
  [45.5, -73.57], [41.88, -87.63], [19.43, -99.13], [-23.55, -46.63], [-34.6, -58.38], [4.71, -74.07],
  [51.51, -0.13], [48.86, 2.35], [52.52, 13.4], [52.37, 4.9], [59.33, 18.07], [40.42, -3.7], [52.23, 21.01],
  [41.01, 28.98], [32.09, 34.78], [25.2, 55.27], [30.04, 31.24], [6.52, 3.38], [-1.29, 36.82], [-33.92, 18.42],
  [12.97, 77.59], [19.08, 72.88], [28.61, 77.21], [13.76, 100.5], [1.35, 103.82], [-6.21, 106.85], [14.6, 120.98],
  [22.32, 114.17], [31.23, 121.47], [39.9, 116.4], [37.57, 126.98], [35.68, 139.69], [-33.87, 151.21], [-37.81, 144.96],
  [-36.85, 174.76], [21.03, 105.85], [24.71, 46.68], [50.45, 30.52], [55.75, 37.62], [60.17, 24.94], [53.35, -6.26],
  [38.72, -9.14], [45.46, 9.19], [47.38, 8.54],
];

/** Generic developer questions for the floating labels and the idle prompt. */
export const QUESTIONS = [
  "how do I add auth to my nextjs app",
  "best vector database for RAG",
  "cheapest way to host postgres",
  "how to rate limit an api route",
  "which logging tool for a node backend",
  "how do I test webhooks locally",
  "what orm should I use with typescript",
  "add search to my docs site",
  "best email api for transactional email",
  "set up background jobs in node",
  "how to cache api responses",
  "monitor errors in a react app",
  "best way to store user uploads",
  "deploy a python worker",
];

export const FINAL = "best database for my nextjs app";

const DEG = Math.PI / 180;

/** Unit-sphere position for a latitude/longitude, matching three's SphereGeometry UVs. */
export function latLonToVec(lat: number, lon: number, out: Float32Array, i: number, r = 1) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  out[i] = -Math.sin(phi) * Math.cos(theta) * r;
  out[i + 1] = Math.cos(phi) * r;
  out[i + 2] = Math.sin(phi) * Math.sin(theta) * r;
}

export type LandMask = { bits: Uint8Array; w: number; h: number };

export async function loadLandMask(): Promise<LandMask> {
  const res = await fetch("/globe/land-1024x512.bin");
  return { bits: new Uint8Array(await res.arrayBuffer()), w: 1024, h: 512 };
}

export function isLand(mask: LandMask, lat: number, lon: number) {
  const x = Math.min(mask.w - 1, Math.max(0, Math.floor(((lon + 180) / 360) * mask.w)));
  const y = Math.min(mask.h - 1, Math.max(0, Math.floor(((90 - lat) / 180) * mask.h)));
  const k = y * mask.w + x;
  return (mask.bits[k >> 3] >> (k & 7)) & 1;
}

/** Evenly spread points on the sphere, keeping only land. Returns positions and [lat, lon] pairs. */
export function sampleLand(mask: LandMask, total: number) {
  const pos: number[] = [];
  const ll: [number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let k = 0; k < total; k++) {
    const y = 1 - (k / (total - 1)) * 2;
    const lat = Math.asin(y) / DEG;
    const lon = ((((golden * k) / DEG) % 360) + 360) % 360 - 180;
    if (lat < -62) continue;
    if (!isLand(mask, lat, lon)) continue;
    ll.push([lat, lon]);
    pos.push(0, 0, 0);
  }
  const arr = new Float32Array(pos.length);
  ll.forEach(([lat, lon], n) => latLonToVec(lat, lon, arr, n * 3));
  return { positions: arr, latLon: ll };
}
