import axios from "axios";

// Placeholder API client — swap baseURL to wire to a real backend.
export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ----- Mock data -----
const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
  "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
];

export interface GenerateParams {
  gender?: string;
  bodyType?: string;
  skinTone?: string;
  pose?: string;
  background?: string;
  imageUrl?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: string;
  count: number;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rid = () => Math.random().toString(36).slice(2, 10);

// POST /api/generate
export async function generateModels(_params: GenerateParams, count = 4): Promise<GeneratedImage[]> {
  await delay(1800);
  return Array.from({ length: count }).map(() => ({
    id: rid(),
    url: STOCK_IMAGES[Math.floor(Math.random() * STOCK_IMAGES.length)],
    createdAt: new Date().toISOString(),
  }));
}

// POST /api/upload
export async function uploadImage(file: File): Promise<{ url: string }> {
  await delay(600);
  return { url: URL.createObjectURL(file) };
}

// GET /api/projects
export async function getProjects(): Promise<Project[]> {
  await delay(400);
  return Array.from({ length: 6 }).map((_, i) => ({
    id: rid(),
    name: ["Spring Lookbook", "Streetwear Drop", "Editorial Set", "Summer Capsule", "Athleisure", "Denim Story"][i],
    thumbnail: STOCK_IMAGES[i % STOCK_IMAGES.length],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    count: 4 + i,
  }));
}
