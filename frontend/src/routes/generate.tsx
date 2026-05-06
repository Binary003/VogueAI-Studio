import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import { UploadBox } from "@/components/UploadBox";
import { ImageGrid } from "@/components/ImageGrid";
import { useState } from "react";
import { generateModels, type GeneratedImage, uploadImage } from "@/services/api";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/generate")({
  head: () => ({ meta: [{ title: "Generate — ModelAI Studio" }] }),
  component: Generate,
});

const GENDER = ["Female", "Male", "Non-binary"];
const BODY = ["Petite", "Regular", "Athletic", "Curvy", "Plus"];
const SKIN = ["#f5d8c0", "#e6b89c", "#c98e6b", "#8d5524", "#5a3a22"];
const POSE = ["Standing", "Walking", "Side", "Sitting", "Dynamic"];
const BG = ["Studio White", "Outdoor", "Urban", "Minimal Beige", "Editorial"];

const mapGender = (value: string) => {
  if (value === "Male") return "male";
  if (value === "Female") return "female";
  return "neutral";
};

const mapBodyType = (value: string) => {
  if (value === "Athletic") return "athletic";
  if (value === "Curvy") return "curvy";
  if (value === "Plus") return "plus-size";
  if (value === "Petite") return "slim";
  return "average";
};

const mapSkinTone = (value: string) => {
  const map: Record<string, string> = {
    "#f5d8c0": "fair",
    "#e6b89c": "medium",
    "#c98e6b": "olive",
    "#8d5524": "dark",
    "#5a3a22": "dark",
  };
  return map[value] || "medium";
};

const mapPose = (value: string) => {
  if (value === "Walking") return "walking";
  if (value === "Sitting") return "sitting";
  if (value === "Dynamic") return "pose2";
  if (value === "Side") return "pose1";
  return "standing";
};

const mapBackground = (value: string) => {
  if (value === "Outdoor") return "outdoor";
  if (value === "Urban") return "custom";
  if (value === "Minimal Beige") return "indoor";
  if (value === "Editorial") return "custom";
  return "studio";
};

function Generate() {
  const [gender, setGender] = useState(GENDER[0]);
  const [body, setBody] = useState(BODY[1]);
  const [skin, setSkin] = useState(SKIN[1]);
  const [pose, setPose] = useState(POSE[0]);
  const [bg, setBg] = useState(BG[0]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ imageUrl: string; publicId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setError(null);
    setLoading(true);
    try {
      if (!selectedFile && !uploadedImage) {
        setError("Please upload a clothing image first.");
        return;
      }

      let uploaded = uploadedImage;
      if (!uploaded && selectedFile) {
        uploaded = await uploadImage(selectedFile);
        setUploadedImage(uploaded);
      }

      if (!uploaded) {
        setError("Unable to upload the clothing image.");
        return;
      }

      const res = await generateModels({
        imageUrl: uploaded.imageUrl,
        publicId: uploaded.publicId,
        gender: mapGender(gender),
        bodyType: mapBodyType(body),
        skinTone: mapSkinTone(skin),
        pose: mapPose(pose),
        background: mapBackground(bg),
      });
      setImages(res);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Generation failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Generate">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Left: upload + controls */}
        <div className="space-y-6">
          <UploadBox
            onFile={(file) => {
              setSelectedFile(file);
              setUploadedImage(null);
            }}
            onClear={() => {
              setSelectedFile(null);
              setUploadedImage(null);
            }}
          />
          <div className="glass rounded-2xl p-5 space-y-5">
            <Group label="Gender">
              <Dropdown options={GENDER} value={gender} onChange={setGender} />
            </Group>
            <Group label="Body type">
              <Chips options={BODY} value={body} onChange={setBody} />
            </Group>
            <Group label="Skin tone">
              <div className="flex gap-2">
                {SKIN.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSkin(c)}
                    style={{ backgroundColor: c }}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-transform",
                      skin === c ? "border-primary scale-110" : "border-border",
                    )}
                  />
                ))}
              </div>
            </Group>
            <Group label="Pose">
              <Chips options={POSE} value={pose} onChange={setPose} />
            </Group>
            <Group label="Background">
              <Dropdown options={BG} value={bg} onChange={setBg} />
            </Group>

            {error && <div className="text-xs text-destructive">{error}</div>}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerate}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating…" : "Generate models"}
            </motion.button>
          </div>
        </div>

        {/* Right: output */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Output</h2>
            <span className="text-xs text-muted-foreground">
              {loading ? "Working…" : `${images.length} result${images.length === 1 ? "" : "s"}`}
            </span>
          </div>
          <ImageGrid images={images} loading={loading} />
        </div>
      </div>
    </AppShell>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors",
            value === o
              ? "gradient-primary text-primary-foreground border-transparent"
              : "border-border bg-secondary/40 hover:bg-secondary",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Dropdown({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-background">
          {o}
        </option>
      ))}
    </select>
  );
}
