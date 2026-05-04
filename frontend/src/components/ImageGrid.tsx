import { motion } from "framer-motion";
import { Download, Heart } from "lucide-react";
import type { GeneratedImage } from "@/services/api";

export function ImageGrid({
  images,
  loading,
  count = 4,
}: {
  images: GeneratedImage[];
  loading?: boolean;
  count?: number;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] rounded-2xl bg-secondary/60 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/20 px-6 py-16 text-center">
        <div className="h-14 w-14 rounded-2xl gradient-primary opacity-40 blur-md" />
        <h3 className="mt-4 text-sm font-medium">No generations yet</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Upload an image and hit Generate to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {images.map((img, i) => (
        <motion.div
          key={img.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-card"
        >
          <motion.img
            src={img.url}
            alt="generated"
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <button className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-white/20">
              <Heart className="h-3.5 w-3.5" /> Save
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-black hover:bg-white/90">
              <Download className="h-3.5 w-3.5" /> Download
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
