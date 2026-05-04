import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, TrendingUp, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ModelAI Studio" }] }),
  component: Dashboard,
});

const STATS = [
  { label: "Generations", value: "1,284", delta: "+12%", icon: Sparkles },
  { label: "Projects", value: "32", delta: "+4", icon: ImageIcon },
  { label: "Avg. time", value: "6.2s", delta: "-1.1s", icon: Clock },
  { label: "Quota used", value: "62%", delta: "of Pro", icon: TrendingUp },
];

const RECENT = [
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80",
  "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80",
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&q=80",
];

function Dashboard() {
  return (
    <AppShell title="Dashboard">
      {/* Hero CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-primary p-8 shadow-glow"
      >
        <div className="relative z-10 max-w-xl">
          <div className="text-xs font-medium uppercase tracking-widest text-primary-foreground/80">New session</div>
          <h2 className="mt-2 text-3xl font-bold text-primary-foreground">Generate your next campaign</h2>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Drop a clothing image, pick a vibe, and let ModelAI handle the rest.
          </p>
          <Link
            to="/generate"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:opacity-90"
          >
            Start generating <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      </motion.div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.delta}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent */}
      <div className="mt-8 flex items-center justify-between">
        <h3 className="text-base font-semibold">Recent generations</h3>
        <Link to="/projects" className="text-sm text-primary hover:underline">View all</Link>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {RECENT.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3 }}
            className="aspect-[4/5] overflow-hidden rounded-2xl border border-border"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
