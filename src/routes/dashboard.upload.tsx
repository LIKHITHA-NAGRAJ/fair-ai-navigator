import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, Download, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generateAnalysis, saveAnalysis, summarizeDataset, type DatasetSummary } from "@/lib/analysis-store";

export const Route = createFileRoute("/dashboard/upload")({
  component: UploadPage,
});

const SAMPLE_COLUMNS = ["age", "gender", "education", "experience", "income", "region", "approved"];
const SAMPLE_ROWS = [
  ["28", "Female", "Masters", "5", "65000", "North", "1"],
  ["35", "Male", "Bachelors", "10", "82000", "South", "1"],
  ["42", "Male", "PhD", "15", "120000", "East", "1"],
  ["29", "Female", "Bachelors", "4", "58000", "West", "0"],
  ["31", "Non-binary", "Masters", "7", "75000", "North", "1"],
  ["45", "Female", "PhD", "18", "110000", "South", "0"],
];

const SAMPLE_DATASETS = [
  { name: "Hiring decisions (10K rows)", file: "hiring_sample.csv" },
  { name: "Loan approvals (8K rows)", file: "loan_sample.csv" },
  { name: "University admissions (5K rows)", file: "admissions_sample.csv" },
];

function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [datasetSummary, setDatasetSummary] = useState<DatasetSummary | null>(null);
  const [target, setTarget] = useState<string>("approved");
  const [sensitive, setSensitive] = useState<string[]>(["gender", "age"]);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const columns = datasetSummary?.columns?.length ? datasetSummary.columns : SAMPLE_COLUMNS;
  const previewRows = datasetSummary?.previewRows?.length ? datasetSummary.previewRows : SAMPLE_ROWS;
  const rowCount = datasetSummary?.rowCount ?? 12450;

  const handleFile = async (f: File) => {
    setFile(f);
    const summary = await summarizeDataset(f);
    setDatasetSummary(summary);
    const nextTarget = summary.columns.includes("approved") ? "approved" : summary.columns.at(-1) ?? "approved";
    const inferredSensitive = summary.columns.filter((c) => /gender|age|race|ethnicity|region|education|income/i.test(c) && c !== nextTarget).slice(0, 3);
    setTarget(nextTarget);
    setSensitive(inferredSensitive.length ? inferredSensitive : summary.columns.filter((c) => c !== nextTarget).slice(0, 2));
    toast.success(`Loaded ${f.name}`);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) void handleFile(f);
  };

  const toggleSensitive = (col: string) => {
    setSensitive((s) => s.includes(col) ? s.filter((c) => c !== col) : [...s, col]);
  };

  const analyze = () => {
    if (!file) return;
    if (sensitive.length === 0) {
      toast.error("Pick at least one sensitive attribute to audit.");
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      const result = generateAnalysis(file.name, target, sensitive);
      saveAnalysis(result);
      setAnalyzing(false);
      toast.success(`Analysis complete — fairness score ${result.overall}/100`);
      navigate({ to: "/dashboard/analysis" });
    }, 2000);
  };

  const loadSample = (name: string) => {
    setFile(new File([""], name, { type: "text/csv" }));
    toast.success(`Loaded sample: ${name}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Dataset</h1>
        <p className="text-muted-foreground mt-1">CSV or XLSX. We'll auto-detect columns and protected attributes.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Drop zone */}
          <Card
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
            className={`p-12 border-2 border-dashed cursor-pointer transition-all ${
              dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-secondary/30"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Upload className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Drop your file here, or click to browse</h3>
              <p className="mt-1 text-sm text-muted-foreground">Supports CSV, XLSX up to 100MB</p>
              {file && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-success/10 text-success px-3 py-1.5 text-sm">
                  <CheckCircle2 className="h-4 w-4" /> {file.name}
                </div>
              )}
            </div>
          </Card>

          {/* Preview */}
          {file && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Preview (first 6 rows)</h3>
                <Badge variant="secondary">{SAMPLE_ROWS.length} of 12,450 rows</Badge>
              </div>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary">
                    <tr>{SAMPLE_COLUMNS.map((c) => <th key={c} className="px-3 py-2 text-left font-medium">{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {SAMPLE_ROWS.map((r, i) => (
                      <tr key={i} className="border-t border-border">
                        {r.map((v, j) => <td key={j} className="px-3 py-2 text-muted-foreground">{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Config */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Sample datasets</h3>
            <p className="text-xs text-muted-foreground mb-4">Try FairMind with one of our prepared datasets.</p>
            <div className="space-y-2">
              {SAMPLE_DATASETS.map((s) => (
                <button
                  key={s.file}
                  onClick={() => loadSample(s.name)}
                  className="w-full flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-secondary/50 hover:border-primary/50 transition"
                >
                  <FileSpreadsheet className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm flex-1 truncate">{s.name}</span>
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </Card>

          {file && (
            <>
              <Card className="p-6">
                <h3 className="font-semibold mb-3">Target column</h3>
                <p className="text-xs text-muted-foreground mb-3">The outcome variable to audit.</p>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  {SAMPLE_COLUMNS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-3">Sensitive attributes</h3>
                <p className="text-xs text-muted-foreground mb-3">Protected groups to audit for bias.</p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_COLUMNS.filter((c) => c !== target).map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleSensitive(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                        sensitive.includes(c)
                          ? "bg-[image:var(--gradient-primary)] text-primary-foreground border-transparent"
                          : "bg-background border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Card>

              <Button
                onClick={analyze}
                disabled={analyzing}
                size="lg"
                className="w-full bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]"
              >
                {analyzing ? (
                  <><Sparkles className="h-4 w-4 mr-2 animate-pulse" /> Analyzing fairness…</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> Run Fairness Analysis</>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}