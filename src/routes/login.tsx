import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/app/logo";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — FairMind AI" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@fairmind.ai");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative bg-[image:var(--gradient-hero)] p-12 flex-col justify-between text-primary-foreground">
        <Logo className="text-primary-foreground" />
        <div>
          <h2 className="text-4xl font-bold leading-tight">Fair Decisions for Every Human.</h2>
          <p className="mt-4 text-primary-foreground/90 max-w-md">
            Audit your AI models for bias in seconds. Join 200+ teams shipping responsible AI.
          </p>
        </div>
        <div className="text-sm text-primary-foreground/70">© 2026 FairMind AI</div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your FairMind dashboard.</p>
          <Card className="mt-8 p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1.5" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox defaultChecked /> Remember me
                </label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[image:var(--gradient-primary)]">
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </Card>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}