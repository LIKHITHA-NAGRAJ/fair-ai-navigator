import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { featureImportance, recentPredictions } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/dashboard/explainability")({
  component: Explain,
});

function Explain() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Explainability</h1>
        <p className="text-muted-foreground mt-1">Understand why the model made each decision.</p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-1">Global feature importance</h3>
        <p className="text-xs text-muted-foreground mb-4">SHAP-style aggregated impact across all predictions.</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureImportance} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 245)" />
              <XAxis type="number" stroke="oklch(0.5 0.03 250)" fontSize={12} />
              <YAxis type="category" dataKey="feature" stroke="oklch(0.5 0.03 250)" fontSize={12} width={80} />
              <Tooltip contentStyle={{ borderRadius: 8 }} />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {featureImportance.map((f, i) => (
                  <Cell key={i} fill={f.feature.toLowerCase().includes("gender") || f.feature.toLowerCase() === "age" ? "oklch(0.6 0.24 25)" : "oklch(0.55 0.2 250)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
          <span><b>Gender</b> and <b>Age</b> appear among top features — these are protected attributes and should not directly influence predictions.</span>
        </div>
      </Card>

      <div>
        <h3 className="font-semibold mb-3">Recent predictions</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {recentPredictions.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">{p.candidate}</div>
                <Badge
                  variant="secondary"
                  className={p.decision === "Approved" ? "bg-success/10 text-success border-0" : "bg-destructive/10 text-destructive border-0"}
                >
                  {p.decision === "Approved" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {p.decision}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-3">Confidence: {(p.confidence * 100).toFixed(1)}%</div>
              <div className="space-y-2">
                {[
                  { f: "Experience (8 yrs)", impact: 0.42, positive: true },
                  { f: "Education (Masters)", impact: 0.28, positive: true },
                  { f: "Skill match (87%)", impact: 0.21, positive: true },
                  { f: p.fairnessFlag ? "Gender (proxy ↓)" : "Region (North)", impact: p.fairnessFlag ? -0.18 : -0.05, positive: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-32 truncate">{s.f}</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden flex">
                      <div className={`h-full ${s.positive ? "bg-success ml-auto" : "bg-destructive"}`} style={{ width: `${Math.abs(s.impact) * 100}%` }} />
                    </div>
                    <span className={`w-12 text-right font-mono ${s.positive ? "text-success" : "text-destructive"}`}>
                      {s.positive ? "+" : ""}{s.impact.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground border-t border-border pt-3">
                <b>Plain English:</b> {p.decision === "Approved" ? "Strong experience and skill match drove approval." : "Skill gap and lower confidence drove rejection."}{p.fairnessFlag && " ⚠ Sensitive feature contributed to this decision."}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}