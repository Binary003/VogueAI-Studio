import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import { login, signup } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — ModelAI Studio" }] }),
  component: LoginPage,
});

function LoginPage() {
  return <AuthLayout mode="login" />;
}

export function AuthLayout({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nameError = isSignup && touched && !name.trim() ? "Name is required" : "";
  const emailError = touched && !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email" : "";
  const passError = touched && password.length < 6 ? "Min 6 characters" : "";
  const hasError = Boolean(nameError || emailError || passError);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Wand2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">ModelAI Studio</span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup ? "Start generating in under a minute." : "Sign in to continue creating."}
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setTouched(true);
              setError(null);

              if (hasError) {
                return;
              }

              try {
                setLoading(true);
                if (isSignup) {
                  const res = await signup({ name: name.trim(), email, password });
                  setToken(res.token);
                  setUser(res.user);
                } else {
                  const res = await login({ email, password });
                  setToken(res.token);
                  setUser(res.user);
                }
                navigate({ to: "/generate" });
              } catch (_err) {
                setError(isSignup ? "Could not create account. Try a different email." : "Invalid email or password.");
              } finally {
                setLoading(false);
              }
            }}
          >
            {isSignup && (
              <Field label="Full name" error={nameError}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Alex Kim"
                />
              </Field>
            )}
            <Field label="Email" error={emailError}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@studio.com"
              />
            </Field>
            <Field label="Password" error={passError}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </Field>

            {error && <div className="text-xs text-destructive">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-70"
            >
              {loading ? (isSignup ? "Creating..." : "Signing in...") : isSignup ? "Create account" : "Sign in"}
            </button>

            <button
              type="button"
              className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm font-medium hover:bg-card"
            >
              Continue with Google
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">Sign in</Link>
              </>
            ) : (
              <>
                New here?{" "}
                <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Visual side */}
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-mesh)" }} />
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/40 to-transparent" />
        <div className="relative h-full flex items-end p-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight max-w-md">
              "We replaced 80% of our photo shoots with ModelAI."
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">— Sasha Lin, Creative Director @ NORA</p>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: color-mix(in oklab, var(--color-card) 60%, transparent);
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 25%, transparent); }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</div>
      {children}
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </label>
  );
}
