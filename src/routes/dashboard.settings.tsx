import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon } from "lucide-react";
import { AppSidebar } from "@/components/app/sidebar";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — FairMind AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoAudit, setAutoAudit] = useState(false);
  const [strict, setStrict] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 p-6 lg:p-10 max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground mb-8">Manage your profile, notifications, and audit preferences.</p>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <Button onClick={() => toast.success("Profile updated")} className="bg-[image:var(--gradient-primary)]">
              Save changes
            </Button>
          </div>
        </Card>

        <Card className="p-6 mt-6">
          <h2 className="font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <Row label="Email alerts on bias detection" description="Get notified when an audit fails fairness thresholds.">
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </Row>
            <Row label="Weekly summary report" description="Receive a Monday digest of all audits run last week.">
              <Switch defaultChecked />
            </Row>
          </div>
        </Card>

        <Card className="p-6 mt-6">
          <h2 className="font-semibold mb-4">Audit preferences</h2>
          <div className="space-y-4">
            <Row label="Auto-audit new datasets" description="Run a fairness audit automatically when a new dataset is uploaded.">
              <Switch checked={autoAudit} onCheckedChange={setAutoAudit} />
            </Row>
            <Row label="Strict mode (EEOC four-fifths)" description="Flag any disparate impact below 0.80 as a critical violation.">
              <Switch checked={strict} onCheckedChange={setStrict} />
            </Row>
          </div>
        </Card>

        <Card className="p-6 mt-6 border-destructive/40">
          <h2 className="font-semibold mb-2 text-destructive">Danger zone</h2>
          <p className="text-sm text-muted-foreground mb-4">Permanently delete your workspace and all audit data.</p>
          <Button variant="destructive" onClick={() => toast.error("This is a demo — deletion disabled.")}>
            Delete workspace
          </Button>
        </Card>
      </main>
    </div>
  );
}

function Row({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      {children}
    </div>
  );
}