import axios from "axios";

// Placeholder API client — swap baseURL to wire to a real backend.
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----- Auth -----
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    plan: string;
    generationsUsed: number;
  };
}

export interface ProfileUpdateRequest {
  name: string;
  email: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const response = await api.post("/auth/signup", data);
  const payload = response.data?.data;
  if (payload?.token) {
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
  }
  return payload;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post("/auth/login", data);
  const payload = response.data?.data;
  if (payload?.token) {
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
  }
  return payload;
}

export async function getProfile(): Promise<AuthResponse["user"]> {
  const response = await api.get("/auth/profile");
  return response.data?.data;
}

export async function updateProfile(data: ProfileUpdateRequest): Promise<AuthResponse["user"]> {
  const response = await api.put("/auth/profile", data);
  return response.data?.data;
}

export async function updatePassword(data: PasswordUpdateRequest): Promise<void> {
  await api.put("/auth/password", data);
}

export async function deleteAccount(): Promise<void> {
  await api.delete("/auth/profile");
}

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
  publicId?: string;
  imageUrl?: string;
  clothingDescription?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  publicId?: string;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: string;
  count: number;
}

// POST /api/generate
export async function generateModels(params: GenerateParams): Promise<GeneratedImage[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    // This prevents the request from being made if the user is not logged in.
    // You might want to handle this more gracefully, e.g., by redirecting to the login page.
    console.error("Authentication token not found. Please log in.");
    return Promise.reject(new Error("User not authenticated"));
  }
  const response = await api.post("/generate", params);
  const payload = response.data?.data;
  const generated = payload?.generatedImages || [];
  return generated.map((img: { url: string; publicId?: string }, index: number) => ({
    id: `${payload?.projectId || "gen"}-${index}`,
    url: img.url,
    publicId: img.publicId,
    createdAt: new Date().toISOString(),
  }));
}

// POST /api/upload
export async function uploadImage(file: File): Promise<{ imageUrl: string; publicId: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data?.data;
}

// GET /api/projects
export async function getProjects(): Promise<Project[]> {
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const rid = () => Math.random().toString(36).slice(2, 10);
  await delay(400);
  return Array.from({ length: 6 }).map((_, i) => ({
    id: rid(),
    name: ["Spring Lookbook", "Streetwear Drop", "Editorial Set", "Summer Capsule", "Athleisure", "Denim Story"][i],
    thumbnail: STOCK_IMAGES[i % STOCK_IMAGES.length],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    count: 4 + i,
  }));
}
