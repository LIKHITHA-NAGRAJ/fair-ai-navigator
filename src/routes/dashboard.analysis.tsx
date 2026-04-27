import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fairnessMetrics } from "@/lib/mock-data";
import { loadAnalysis, type AnalysisResult } from "@/lib/analysis-store";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/analysis")({
  component: Analysis,
});

function TrafficLight({ score }: { score: number }) {
  const status = score >= 75 ? "safe" : score >= 50 ? "warning" : "danger";
  const cfg = {
    safe: { color: "text-success", bg: "bg-success/10", icon: CheckCircle2, label: "Safe" },
    warning: { color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle, label: "Warning" },
    danger: { color: "text-destructive", bg: "bg-destructive/10", icon: XCircle, label: "High Bias" },
  }[status];
  const Icon = cfg.icon;
  return (
    <div className={`inline-flex items-center gap-2 rounded-full ${cfg.bg} ${cfg.color} px-3 py-1.5 text-sm font-medium`}>
      <Icon className="h-4 w-4" /> {cfg.label}
    </div>
  );
}

function MetricCard({ label, value, max = 1, lowerIsBetter = false, fmt = "ratio" }: { label: string; value: number; max?: number; lowerIsBetter?: boolean; fmt?: "ratio" | "percent" }) {
  const pct = (value / max) * 100;
  const good = lowerIsBetter ? pct < 20 : pct > 75;
  const warn = lowerIsBetter ? pct < 35 : pct > 60;
  const color = good ? "bg-success" : warn ? "bg-warning" : "bg-destructive";
  return (
    <Card className="p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-bold">{fmt === "percent" ? `${(value * 100).toFixed(1)}%` : value.toFixed(2)}</div>
      <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </Card>
  );
}

function Analysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  useEffect(() => {
    setResult(loadAnalysis());
  }, []);

  // Adapter — use stored analysis when present, otherwise fall back to demo data.
  const m = result
    ? {
        overall: result.overall,
        selectionRate: result.selectionRate,
        errorRates: result.errorRates,
        statisticalParity: result.statisticalParity,
        equalOpportunity: result.equalOpportunity,
        disparateImpact: result.disparateImpact,
      }
    : fairnessMetrics;

  const attributeBias = result?.attributeBias ?? [
    { label: "Gender bias", value: fairnessMetrics.genderBias },
    { label: "Age bias", value: fairnessMetrics.ageBias },
    { label: "Region bias", value: 9 },
    { label: "Education-level bias", value: 6 },
  ];
  const avgOdds = result?.avgOddsDiff ?? 0.11;

  const headerName = result?.datasetName ?? "Hiring Q4 2025";
  const headerRows = result?.rows ?? 12450;
  const headerDate = result
    ? new Date(result.analyzedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Apr 22, 2026";

  const scoreData = [{ name: "Score", value: m.overall, fill: "oklch(0.55 0.2 250)" }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Bias Analysis</h1>
          <p className="text-muted-foreground mt-1">
            {headerName} • {headerRows.toLocaleString()} rows • analyzed {headerDate}
          </p>
          {result && (
            <p className="text-xs text-muted-foreground mt-1">
              Target: <span className="font-medium text-foreground">{result.target}</span> • Sensitive:{" "}
              <span className="font-medium text-foreground">{result.sensitive.join(", ")}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <TrafficLight score={m.overall} />
          <Link
            to="/dashboard/upload"
            className="text-xs text-primary hover:underline"
          >
            Run new audit →
          </Link>
        </div>
      </div>

      {/* Hero score */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1 bg-[image:var(--gradient-card)]">
          <h3 className="font-semibold">Overall Fairness Score</h3>
          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="75%" outerRadius="100%" data={scoreData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "oklch(0.92 0.015 245)" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="-mt-44 text-center">
              <div className="text-5xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">{m.overall}</div>
              <div className="text-xs text-muted-foreground mt-1">out of 100</div>
            </div>
          </div>
          <div className="mt-12 text-center text-sm text-muted-foreground">Composite of 8 fairness metrics</div>
        </Card>

        {/* Bias scores by attribute */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Bias by sensitive attribute</h3>
          <div className="space-y-5">
            {attributeBias.map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{b.label}</span>
                  <Badge variant="secondary" className={b.value > 15 ? "bg-destructive/10 text-destructive border-0" : b.value > 8 ? "bg-warning/10 text-warning border-0" : "bg-success/10 text-success border-0"}>
                    {b.value}% gap
                  </Badge>
                </div>
                <Progress value={b.value * 3} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-1">Selection rate by group</h3>
          <p className="text-xs text-muted-foreground mb-4">% of group selected for positive outcome</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.selectionRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 245)" />
                <XAxis dataKey="group" stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 250)" fontSize={12} domain={[0, 1]} />
                <Tooltip contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                  {m.selectionRate.map((_, i) => (
                    <Cell key={i} fill={["oklch(0.55 0.2 250)", "oklch(0.7 0.18 245)", "oklch(0.78 0.15 160)"][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-1">Error rates by group</h3>
          <p className="text-xs text-muted-foreground mb-4">False positive vs false negative rates</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.errorRates}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 245)" />
                <XAxis dataKey="group" stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey="fpr" name="False Positive" fill="oklch(0.78 0.17 75)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="fnr" name="False Negative" fill="oklch(0.6 0.24 25)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed metrics */}
      <div>
        <h3 className="font-semibold mb-3">Detailed fairness metrics</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Statistical Parity Diff" value={m.statisticalParity} lowerIsBetter />
          <MetricCard label="Equal Opportunity" value={m.equalOpportunity} fmt="percent" />
          <MetricCard label="Disparate Impact" value={m.disparateImpact} fmt="percent" />
          <MetricCard label="Avg Odds Difference" value={avgOdds} lowerIsBetter />
        </div>
      </div>
    </div>
  );
}