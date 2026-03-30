export interface Barcode {
  id: string;
  name: string;
  desc: string;
  links: string[];
  expiry?: string | null;
  created: number;
  scans: number;
}

export interface Scan {
  ts: number;
  device: string;
  linkCount: number;
}

const LS = { B: "pbx_barcodes", S: "pbx_scans" };

const load = <T>(k: string): T[] =>
  JSON.parse(localStorage.getItem(k) || "[]");

const save = (k: string, v: unknown) =>
  localStorage.setItem(k, JSON.stringify(v));

export const storage = {
  getBarcodes: () => load<Barcode>(LS.B),
  saveBarcodes: (arr: Barcode[]) => save(LS.B, arr),
  getScans: () => load<Scan>(LS.S),
  saveScans: (arr: Scan[]) => save(LS.S, arr),
};
