import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle2, Database, Upload, BarChart3, FileText, Lightbulb } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { mockDatasets, trendData } from "@/lib/mock-data";
import { useAuth } from "@/contexts/auth";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Overview() {
  const { user } = useAuth();
  const avg = Math.round(mockDatasets.reduce((s, d) => s + d.fairnessScore, 0) / mockDatasets.length);
  const risks = mockDatasets.filter((d) => d.status !== "safe").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name ?? "Demo User"} 👋</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your fairness audits.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Database, label: "Datasets analyzed", value: mockDatasets.length, sub: "+2 this week", color: "text-primary" },
          { icon: TrendingUp, label: "Avg fairness score", value: avg, sub: "+4 vs last month", color: "text-accent" },
          { icon: AlertTriangle, label: "Active risk alerts", value: risks, sub: "Needs review", color: "text-warning" },
          { icon: CheckCircle2, label: "Compliance rate", value: "94%", sub: "EU AI Act ready", color: "text-success" },
        ].map((s) => (
          <Card key={s.label} className="p-5 bg-[image:var(--gradient-card)] border-border/60">
            <div className="flex items-center justify-between">
              <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-2">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Fairness score trend</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success border-0">+14 pts</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 245)" />
                <XAxis dataKey="month" stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 250)" fontSize={12} domain={[40, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.015 245)" }} />
                <Area type="monotone" dataKey="score" stroke="oklch(0.55 0.2 250)" strokeWidth={2.5} fill="url(#fg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick actions */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Quick actions</h3>
          <div className="space-y-2">
            {[
              { to: "/dashboard/upload", icon: Upload, label: "Upload dataset" },
              { to: "/dashboard/analysis", icon: BarChart3, label: "View analysis" },
              { to: "/dashboard/recommendations", icon: Lightbulb, label: "Get recommendations" },
              { to: "/dashboard/reports", icon: FileText, label: "Download report" },
            ].map((a) => (
              <Button key={a.to} asChild variant="outline" className="w-full justify-start">
                <Link to={a.to}><a.icon className="h-4 w-4 mr-2" />{a.label}</Link>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent analyses */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent analyses</h3>
        <div className="space-y-3">
          {mockDatasets.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3 hover:bg-secondary/50 transition">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Database className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.rows.toLocaleString()} rows • {d.domain} • {d.uploadedAt}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="hidden md:block w-32">
                  <Progress value={d.fairnessScore} className="h-2" />
                </div>
                <div className="text-sm font-semibold w-10 text-right">{d.fairnessScore}</div>
                <Badge
                  variant="secondary"
                  className={
                    d.status === "safe" ? "bg-success/10 text-success border-0" :
                    d.status === "warning" ? "bg-warning/10 text-warning border-0" :
                    "bg-destructive/10 text-destructive border-0"
                  }
                >
                  {d.status === "safe" ? "Safe" : d.status === "warning" ? "Warning" : "High Risk"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}