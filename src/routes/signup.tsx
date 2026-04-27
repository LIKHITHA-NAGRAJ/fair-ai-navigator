import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/app/logo";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — FairMind AI" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signup(name, email, password);
    toast.success("Account created! Welcome to FairMind.");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative bg-[image:var(--gradient-hero)] p-12 flex-col justify-between text-primary-foreground">
        <Logo className="text-primary-foreground" />
        <div>
          <h2 className="text-4xl font-bold leading-tight">Start auditing your AI in minutes.</h2>
          <p className="mt-4 text-primary-foreground/90 max-w-md">
            Free forever for small teams. No credit card required. Detect bias before it ships.
          </p>
          <ul className="mt-8 space-y-2 text-primary-foreground/90">
            <li>✓ Unlimited bias audits on the free tier</li>
            <li>✓ SHAP-style explainability reports</li>
            <li>✓ Exportable PDF audit logs</li>
          </ul>
        </div>
        <div className="text-sm text-primary-foreground/70">© 2026 FairMind AI</div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Get started with FairMind AI — it's free.</p>
          <Card className="mt-8 p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5" placeholder="Jane Doe" />
              </div>
              <div>
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" placeholder="you@company.com" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="mt-1.5" placeholder="At least 8 characters" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[image:var(--gradient-primary)]">
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </Card>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}