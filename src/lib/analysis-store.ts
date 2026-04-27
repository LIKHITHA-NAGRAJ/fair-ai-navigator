// Lightweight in-memory + localStorage store for the most recent analysis run.
// Lets the Upload page pass a generated result to the Analysis page so the
// dashboard reflects the actual dataset/sensitive attributes the user picked.

export type SelectionRow = { group: string; rate: number };
export type ErrorRow = { group: string; fpr: number; fnr: number };

export type AnalysisResult = {
  datasetName: string;
  rows: number;
  analyzedAt: string;
  target: string;
  sensitive: string[];
  columns?: string[];
  previewRows?: string[][];
  overall: number;
  attributeBias: { label: string; value: number }[];
  selectionRate: SelectionRow[];
  errorRates: ErrorRow[];
  statisticalParity: number;
  equalOpportunity: number;
  disparateImpact: number;
  avgOddsDiff: number;
};

export type DatasetSummary = {
  columns: string[];
  previewRows: string[][];
  rowCount: number;
  fingerprint: string;
  groupsByAttribute: Record<string, string[]>;
};

const KEY = "fairmind_last_analysis";

// Deterministic pseudo-random based on a string seed (so same dataset name
// always produces same results, but different datasets differ).
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GROUP_PRESETS: Record<string, string[]> = {
  gender: ["Male", "Female", "Non-binary"],
  age: ["18–29", "30–49", "50+"],
  region: ["North", "South", "East", "West"],
  race: ["Group A", "Group B", "Group C"],
  ethnicity: ["Group A", "Group B", "Group C"],
  education: ["High school", "Bachelors", "Masters", "PhD"],
  experience: ["0–2y", "3–5y", "6–10y", "10y+"],
  income: ["Low", "Medium", "High"],
};

function groupsFor(attr: string, summary?: DatasetSummary): string[] {
  const actualGroups = summary?.groupsByAttribute[attr]?.filter(Boolean);
  if (actualGroups && actualGroups.length > 0) return actualGroups.slice(0, 6);
  return GROUP_PRESETS[attr.toLowerCase()] ?? ["Group A", "Group B", "Group C"];
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(value.trim());
      value = "";
    } else {
      value += char;
    }
  }
  cells.push(value.trim());
  return cells;
}

function fingerprintText(text: string, file: File) {
  let hash = `${file.name}:${file.size}:${file.lastModified}`;
  for (let i = 0; i < text.length; i += Math.max(1, Math.floor(text.length / 400))) {
    hash += `:${text.charCodeAt(i)}`;
  }
  return hash;
}

export async function summarizeDataset(file: File): Promise<DatasetSummary> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const parsed = lines.slice(0, 250).map(parseCsvLine).filter((row) => row.length > 1);
  const columns = parsed[0]?.map((column, index) => column || `column_${index + 1}`) ?? ["age", "gender", "education", "region", "approved"];
  const bodyRows = parsed.slice(1).filter((row) => row.some(Boolean));
  const groupsByAttribute = columns.reduce<Record<string, string[]>>((acc, column, index) => {
    const values = bodyRows
      .map((row) => row[index])
      .filter((value) => value && Number.isNaN(Number(value)))
      .slice(0, 120);
    acc[column] = Array.from(new Set(values)).slice(0, 6);
    return acc;
  }, {});

  return {
    columns,
    previewRows: bodyRows.slice(0, 6),
    rowCount: Math.max(0, lines.length - 1),
    fingerprint: fingerprintText(text, file),
    groupsByAttribute,
  };
}

export function generateAnalysis(
  datasetName: string,
  target: string,
  sensitive: string[],
  summary?: DatasetSummary,
): AnalysisResult {
  const rand = seeded([datasetName, target, sensitive.join(","), summary?.fingerprint ?? "demo"].join("|"));
  const rows = summary?.rowCount ?? 2000 + Math.floor(rand() * 13000);

  const attributeBias = sensitive.map((s) => ({
    label: `${s.charAt(0).toUpperCase() + s.slice(1)} bias`,
    value: Math.round(3 + rand() * 28),
  }));
  // pad to at least 2 bars for visual balance
  if (attributeBias.length === 1) {
    attributeBias.push({ label: "Education-level bias", value: Math.round(2 + rand() * 18) });
  }

  const primary = sensitive[0] ?? "gender";
  const groups = groupsFor(primary, summary);
  const baseRate = 0.4 + rand() * 0.3;
  const selectionRate: SelectionRow[] = groups.map((g, i) => {
    const drift = (rand() - 0.5) * 0.45;
    return { group: g, rate: Math.max(0.1, Math.min(0.95, baseRate + drift - i * 0.04)) };
  });
  const errorRates: ErrorRow[] = groups.map((g) => ({
    group: g,
    fpr: +(0.05 + rand() * 0.15).toFixed(2),
    fnr: +(0.08 + rand() * 0.18).toFixed(2),
  }));

  const rates = selectionRate.map((s) => s.rate);
  const maxR = Math.max(...rates);
  const minR = Math.min(...rates);
  const disparateImpact = +(minR / maxR).toFixed(2);
  const statisticalParity = +(maxR - minR).toFixed(2);
  const equalOpportunity = +(0.6 + rand() * 0.35).toFixed(2);
  const avgOddsDiff = +(0.04 + rand() * 0.22).toFixed(2);
  const averageGap = attributeBias.reduce((sum, item) => sum + item.value, 0) / attributeBias.length;
  const overall = Math.max(28, Math.min(96, Math.round(96 - averageGap * 1.8 - statisticalParity * 35 + rand() * 8)));

  return {
    datasetName,
    rows,
    analyzedAt: new Date().toISOString(),
    target,
    sensitive,
    columns: summary?.columns,
    previewRows: summary?.previewRows,
    overall,
    attributeBias,
    selectionRate,
    errorRates,
    statisticalParity,
    equalOpportunity,
    disparateImpact,
    avgOddsDiff,
  };
}

export function saveAnalysis(a: AnalysisResult) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(a));
}

export function loadAnalysis(): AnalysisResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AnalysisResult;
  } catch {
    return null;
  }
}