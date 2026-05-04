import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import { Check } from "lucide-react";

export const Route = createFileRoute("/subscription")({
  head: () => ({ meta: [{ title: "Subscription — ModelAI Studio" }] }),
  component: SubscriptionPage,
});

const PLANS = [
  { name: "Free", price: "$0", features: ["20 generations / month", "720p exports", "Community support"], cta: "Current" },
  { name: "Pro", price: "$29", features: ["Unlimited generations", "4K exports", "Priority queue", "Commercial license"], cta: "Upgrade", highlight: true },
  { name: "Enterprise", price: "Custom", features: ["Dedicated GPUs", "API access", "SSO & SLA", "Custom models"], cta: "Contact sales" },
];

function SubscriptionPage() {
  const used = 624;
  const total = 1000;
  const pct = Math.round((used / total) * 100);

  return (
    <AppShell title="Subscription">
      {/* Usage */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Current plan</div>
            <div className="mt-1 text-xl font-semibold">Pro · Monthly</div>
          </div>
          <button className="rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium hover:bg-secondary">
            Manage billing
          </button>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Generations this month</span>
            <span>
              {used} / {total}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full gradient-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Plans */}
      <h2 className="mt-10 text-base font-semibold">Choose a plan</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-3xl p-7 ${p.highlight ? "gradient-primary text-primary-foreground shadow-glow" : "glass"}`}
          >
            {p.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground border border-border">
                Recommended
              </div>
            )}
            <div className="text-sm font-medium opacity-80">{p.name}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{p.price}</span>
              {p.price !== "Custom" && <span className="text-sm opacity-70">/month</span>}
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4" /> {f}
                </li>
              ))}
            </ul>
            <button
              className={`mt-7 w-full rounded-xl px-4 py-2.5 text-sm font-semibold ${
                p.highlight
                  ? "bg-background text-foreground hover:opacity-90"
                  : "border border-border bg-secondary/40 hover:bg-secondary"
              }`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
