import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Upload, BarChart3, Eye, Lightbulb, FileText, Settings, LogOut, MessageCircle,
} from "lucide-react";
import { Logo } from "./logo";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/upload", icon: Upload, label: "Upload Dataset" },
  { to: "/dashboard/analysis", icon: BarChart3, label: "Bias Analysis" },
  { to: "/dashboard/explainability", icon: Eye, label: "Explainability" },
  { to: "/dashboard/recommendations", icon: Lightbulb, label: "Recommendations" },
  { to: "/dashboard/reports", icon: FileText, label: "Reports" },
  { to: "/dashboard/assistant", icon: MessageCircle, label: "AI Assistant" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
] as const;

export function AppSidebar() {
  const loc = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="p-6"><Logo /></div>
      <nav className="flex-1 px-3 space-y-1">
        {items.map((it) => {
          const active = loc.pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{user?.name ?? "Guest"}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email ?? "demo@fairmind.ai"}</div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => { logout(); navigate({ to: "/" }); }}
        >
          <LogOut className="h-3.5 w-3.5 mr-2" /> Sign out
        </Button>
      </div>
    </aside>
  );
}