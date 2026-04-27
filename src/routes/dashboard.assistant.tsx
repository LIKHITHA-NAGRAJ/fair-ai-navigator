import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { AppSidebar } from "@/components/app/sidebar";

export const Route = createFileRoute("/dashboard/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — FairMind AI" }] }),
  component: AssistantPage,
});

type Msg = { role: "user" | "bot"; text: string };

const suggestions = [
  "Why is my model biased against women?",
  "Explain disparate impact in simple terms",
  "How do I fix demographic parity issues?",
  "What's a good fairness threshold for hiring?",
];

function botReply(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("disparate impact"))
    return "Disparate impact measures whether the selection rate for a protected group is at least 80% of the rate for the favored group. A score below 0.8 typically indicates illegal bias under the four-fifths rule. Your current model scores 0.34 on Gender — well below the threshold.";
  if (lower.includes("women") || lower.includes("gender"))
    return "Your model approves 90% of male applicants but only 30.77% of female applicants with comparable financial profiles. Root cause: the training data is 72% male, and 'years of employment' is correlated with gender due to historical workforce gaps. I recommend SMOTE oversampling and removing 'years of employment' as a feature.";
  if (lower.includes("fix") || lower.includes("mitigate"))
    return "Three proven techniques: (1) Pre-processing — re-balance the training set with SMOTE or reweighing. (2) In-processing — add a fairness constraint to the loss function (e.g., adversarial debiasing). (3) Post-processing — calibrate decision thresholds per subgroup using equalized odds. Start with pre-processing — it's the simplest and most effective.";
  if (lower.includes("threshold") || lower.includes("hiring"))
    return "For hiring models, target a disparate impact score above 0.85 and demographic parity difference below 0.05. The EEOC's four-fifths rule (0.80) is the legal floor — but defensible AI systems should aim higher.";
  return "Great question! In short: bias in AI usually stems from imbalanced training data, proxy features, or label noise. Upload your dataset and I can give you specific, quantified recommendations for your model.";
}

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm FairBot, your fairness co-pilot. Ask me anything about bias detection, fairness metrics, or how to interpret your audit results." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: botReply(text) }]);
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col p-6 lg:p-10 max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">FairBot Assistant</h1>
          <span className="ml-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-3 w-3" /> AI-powered
          </span>
        </div>
        <p className="text-muted-foreground mb-6">Your conversational fairness expert.</p>

        <Card className="flex-1 flex flex-col p-4 min-h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-xs p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="mt-4 flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask FairBot anything about fairness…"
              className="flex-1"
            />
            <Button type="submit" className="bg-[image:var(--gradient-primary)]">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}