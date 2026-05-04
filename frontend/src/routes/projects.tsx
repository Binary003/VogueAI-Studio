import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import { useEffect, useState } from "react";
import { getProjects, type Project } from "@/services/api";
import { motion } from "framer-motion";
import { RefreshCw, Trash2, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — ModelAI Studio" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [items, setItems] = useState<Project[] | null>(null);

  useEffect(() => {
    getProjects().then(setItems);
  }, []);

  return (
    <AppShell title="Projects">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">All your previous generations in one place.</p>
        <Link
          to="/generate"
          className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> New project
        </Link>
      </div>

      {items === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl bg-secondary/60 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              className="group glass rounded-2xl overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.thumbnail} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-3 left-3 rounded-full bg-background/80 backdrop-blur px-2 py-0.5 text-[10px] font-medium">
                  {p.count} images
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-border hover:bg-secondary">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-border text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-secondary/20 px-6 py-20 text-center">
      <div className="h-16 w-16 rounded-2xl gradient-primary opacity-50 blur-md" />
      <h3 className="mt-6 text-lg font-semibold">No projects yet</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Create your first batch of AI fashion models — it takes about 8 seconds.
      </p>
      <Link
        to="/generate"
        className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        <Plus className="h-4 w-4" /> Start generating
      </Link>
    </div>
  );
}
