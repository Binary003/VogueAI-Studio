import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function UploadBox({
  onFile,
  className,
}: {
  onFile?: (file: File, previewUrl: string) => void;
  className?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (files) => {
      const f = files[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      setPreview(url);
      onFile?.(f, url);
    },
  });

  return (
    <div className={cn("relative", className)}>
      {preview ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border"
        >
          <img src={preview} alt="upload preview" className="h-full w-full object-cover" />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border hover:bg-background"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border bg-secondary/30 hover:bg-secondary/60",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow">
            <UploadCloud className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-medium">Drop a clothing image here</div>
            <div className="mt-1 text-xs text-muted-foreground">
              or click to browse · PNG, JPG up to 10MB
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
