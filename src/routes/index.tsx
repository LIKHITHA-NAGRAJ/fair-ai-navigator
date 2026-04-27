import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/app/logo";
import {
  Shield, Sparkles, BarChart3, FileCheck, Zap, Users,
  ArrowRight, CheckCircle2, Github, Twitter, Linkedin, Brain, Eye, Scale,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FairMind AI — Detect Bias. Build Trust. Deploy Fair AI." },
      { name: "description", content: "Enterprise-grade fairness platform for hiring, lending, admissions and more." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Shield, title: "Bias Detection", desc: "Spot disparate impact, statistical parity gaps, and unfair outcomes across protected groups." },
  { icon: Eye, title: "Explainability", desc: "SHAP-style explanations for every prediction. Know why your model decided what it did." },
  { icon: BarChart3, title: "Live Dashboards", desc: "Real-time fairness scores, traffic-light alerts, and trend analytics." },
  { icon: Sparkles, title: "AI Recommendations", desc: "Auto-generated mitigation steps: reweighting, debiasing, fairness constraints." },
  { icon: FileCheck, title: "Compliance Reports", desc: "Investor-ready PDFs that satisfy EU AI Act, EEOC, and ECOA requirements." },
  { icon: Zap, title: "1-Click Audit", desc: "Upload a CSV, choose sensitive attributes, get a full fairness audit in seconds." },
];

const steps = [
  { n: "01", title: "Upload your dataset", desc: "Drag & drop CSV or XLSX. We auto-detect columns and protected attributes." },
  { n: "02", title: "Run fairness analysis", desc: "Our engine computes 8+ fairness metrics across every sensitive group." },
  { n: "03", title: "Get actionable insights", desc: "Receive ranked recommendations and a downloadable compliance report." },
];

const testimonials = [
  { name: "Dr. Priya Sharma", role: "Chief Data Officer, NovaBank", quote: "FairMind cut our loan-approval bias by 38% in one quarter. The compliance reports alone saved us months of audit work." },
  { name: "Marcus Chen", role: "Head of Talent AI, Helix Corp", quote: "We caught a gender bias in our resume screener that would have cost us millions in lawsuits. FairMind paid for itself in week one." },
  { name: "Aisha Okonkwo", role: "Ethics Lead, MedAI Labs", quote: "The explainability dashboards are stunning. My board finally understands what our models actually do." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</a>
            <a href="#how" className="text-sm text-muted-foreground hover:text-foreground transition">How it works</a>
            <a href="#why" className="text-sm text-muted-foreground hover:text-foreground transition">Why fairness</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition">Customers</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
            <Button asChild size="sm" className="bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-[0.08]" />
        <div aria-hidden className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Trusted by 200+ teams shipping responsible AI
            </div>
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              Detect Bias.{" "}
              <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">Build Trust.</span>
              <br />Deploy Fair AI.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              FairMind AI helps organizations measure, explain, and reduce bias in models that decide hiring, lending, admissions, and more.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elegant)] text-base h-12 px-8">
                <Link to="/signup">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                <Link to="/dashboard">Live Demo</Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              {[["98%", "Bias caught"], ["2.3M", "Decisions audited"], ["200+", "Enterprises"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-3xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">{v}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Everything you need for responsible AI</h2>
            <p className="mt-4 text-lg text-muted-foreground">A complete fairness toolkit in one platform.</p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="group relative overflow-hidden border-border/60 bg-[image:var(--gradient-card)] p-6 transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-1">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-[image:var(--gradient-primary)] group-hover:text-primary-foreground transition">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border/50 bg-secondary/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">How it works</h2>
            <p className="mt-4 text-lg text-muted-foreground">From dataset to compliance report in three steps.</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-border/60 bg-card p-8">
                <div className="text-5xl font-bold text-primary/20">{s.n}</div>
                <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why fairness */}
      <section id="why" className="border-t border-border/50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Why fair AI matters</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Biased models cost businesses millions in lawsuits, regulatory fines, and lost trust.
                The EU AI Act, EEOC, and consumer-protection regulators are watching.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Avoid lawsuits — discrimination claims average $1.2M in settlements",
                  "Comply with EU AI Act, GDPR, and ECOA requirements",
                  "Build models customers and employees actually trust",
                  "Improve performance — debiased models often generalize better",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                    <span className="text-sm">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { i: Scale, l: "Statistical Parity", v: "0.87" },
                { i: Users, l: "Equal Opportunity", v: "0.92" },
                { i: Brain, l: "Disparate Impact", v: "0.81" },
                { i: Shield, l: "Compliance Score", v: "A+" },
              ].map((m) => (
                <Card key={m.l} className="p-6 bg-[image:var(--gradient-card)] border-border/60">
                  <m.i className="h-6 w-6 text-primary" />
                  <div className="mt-4 text-3xl font-bold">{m.v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.l}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t border-border/50 bg-secondary/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Loved by AI teams worldwide</h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 bg-card border-border/60">
                <p className="text-sm leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground font-semibold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 py-24">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-border/60 p-12 md:p-16 text-center bg-[image:var(--gradient-hero)]">
            <div className="relative">
              <h2 className="text-4xl font-bold text-primary-foreground md:text-5xl">Ready to ship fair AI?</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/90">
                Join 200+ teams already auditing their models with FairMind AI.
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base">
                <Link to="/signup">Start your free audit <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <Logo />
              <p className="mt-2 text-sm text-muted-foreground">Fair Decisions for Every Human.</p>
            </div>
            <div className="flex items-center gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">© 2026 FairMind AI. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
