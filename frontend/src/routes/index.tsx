import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Layers,
  Zap,
  Shield,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ModelAI Studio — Create AI Fashion Models in Seconds" },
      {
        name: "description",
        content:
          "Turn flat-lay clothing photos into stunning on-model imagery. Built for fashion brands, designers, and e-commerce teams.",
      },
    ],
  }),
  component: Landing,
});

const SHOWCASE = [
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
  "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80",
];

const FEATURES = [
  { icon: Wand2, title: "AI On-Model Photos", desc: "Drop a garment, get studio-grade model shots in seconds." },
  { icon: Layers, title: "Endless Variations", desc: "Skin tone, body type, pose, background — fully controllable." },
  { icon: Zap, title: "Lightning Fast", desc: "Average generation in under 8 seconds on any device." },
  { icon: Shield, title: "Commercial License", desc: "Use every output across web, ads, and packaging." },
];

const PLANS = [
  { name: "Free", price: "$0", desc: "For exploring the platform.", features: ["20 generations / month", "720p exports", "Community support"], cta: "Start free" },
  { name: "Pro", price: "$29", desc: "For working creators & brands.", features: ["Unlimited generations", "4K exports", "Priority queue", "Commercial license"], cta: "Start Pro trial", highlight: true },
  { name: "Enterprise", price: "Custom", desc: "For teams and platforms.", features: ["Dedicated GPUs", "API access", "SSO & SLA", "Custom models"], cta: "Contact sales" },
];

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Wand2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight">ModelAI Studio</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#showcase" className="hover:text-foreground">Showcase</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">Sign in</Link>
          <Link
            to="/signup"
            className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg gradient-primary" />
          <span>© {new Date().getFullYear()} ModelAI Studio</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div>
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-mesh)" }} />
        <div className="mx-auto max-w-7xl px-4 md:px-8 pt-20 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            New · Pose & background presets v2
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 text-5xl md:text-7xl font-bold tracking-tight"
          >
            Create AI Fashion Models <br className="hidden md:inline" />
            <span className="gradient-text">in Seconds</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground"
          >
            Upload any clothing image. Get hyper-realistic on-model photography across skin tones,
            body types, poses, and locations — instantly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/generate"
              className="group inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Start Generating
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#showcase"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-3 text-sm font-medium hover:bg-card"
            >
              <ImageIcon className="h-4 w-4" /> See examples
            </a>
          </motion.div>

          {/* Floating preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div className="glass rounded-3xl p-3 shadow-elegant">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SHOWCASE.slice(0, 4).map((src, i) => (
                  <motion.img
                    key={src}
                    src={src}
                    alt=""
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="aspect-[4/5] w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to ship faster</h2>
          <p className="mt-3 text-muted-foreground">A studio-grade pipeline, no studio required.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow"
            >
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="showcase" className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Real generations, zero retouching</h2>
          <p className="mt-3 text-muted-foreground">A taste of what your team can produce today.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {SHOWCASE.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <motion.img src={src} className="h-full w-full object-cover" whileHover={{ scale: 1.05 }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, scalable pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you ship.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl p-7 ${
                p.highlight
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "glass"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground border border-border">
                  Most Popular
                </div>
              )}
              <div className="text-sm font-medium opacity-80">{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                {p.price !== "Custom" && <span className="text-sm opacity-70">/month</span>}
              </div>
              <p className="mt-2 text-sm opacity-80">{p.desc}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`mt-7 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  p.highlight
                    ? "bg-background text-foreground hover:opacity-90"
                    : "gradient-primary text-primary-foreground"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
