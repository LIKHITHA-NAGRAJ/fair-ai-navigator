import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { AppSidebar } from "@/components/app/sidebar";

export const Route = createFileRoute("/dashboard/recommendations")({
  head: () => ({ meta: [{ title: "Recommendations — FairMind AI" }] }),
  component: RecommendationsPage,
});

const recs = [
  {
    severity: "high",
    title: "Re-balance training data for the Gender attribute",
    detail: "Female applicants are under-represented (28% of the training set vs 49% of the applicant pool). Apply SMOTE oversampling or stratified resampling to bring representation above 45%.",
    impact: "+0.31 disparate impact",
  },
  {
    severity: "high",
    title: "Apply post-processing equalized odds calibration",
    detail: "True positive rates differ by 22 points across racial subgroups. Use threshold optimization per group to align TPRs within ±5%.",
    impact: "+0.18 equal opportunity",
  },
  {
    severity: "medium",
    title: "Remove zip code as a model feature",
    detail: "Zip code is acting as a proxy for race (correlation 0.71). Drop the feature and re-train; expect a 0.6% accuracy drop but materially fairer outcomes.",
    impact: "Removes proxy bias",
  },
  {
    severity: "medium",
    title: "Audit upstream data labeling pipeline",
    detail: "Label noise is 3.4x higher for the 50+ age group. Review the annotation guidelines and add a second-pass review for senior applicants.",
    impact: "Improves label quality",
  },
  {
    severity: "low",
    title: "Schedule monthly fairness re-audits",
    detail: "Model drift can re-introduce bias over time. Configure FairMind to run an automated audit every 30 days on a fresh sample.",
    impact: "Continuous monitoring",
  },
];

const sevColor = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-warning/10 text-warning-foreground border-warning/30",
  low: "bg-success/10 text-success-foreground border-success/30",
} as const;

function RecommendationsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 p-6 lg:p-10 max-w-6xl">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Mitigation Recommendations</h1>
        </div>
        <p className="text-muted-foreground">Concrete, prioritized actions to reduce bias in your model.</p>

        <div className="mt-8 space-y-4">
          {recs.map((r, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {r.severity === "high" ? (
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={sevColor[r.severity as keyof typeof sevColor]}>
                        {r.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Estimated impact: {r.impact}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{r.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Apply <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}