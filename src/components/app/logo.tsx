import { Brain } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-bold text-lg ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
        <Brain className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
        FairMind AI
      </span>
    </Link>
  );
}