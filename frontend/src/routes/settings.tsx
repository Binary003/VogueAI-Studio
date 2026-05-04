import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — ModelAI Studio" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  return (
    <AppShell title="Settings">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Profile" desc="Update your personal information.">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground shadow-glow">
              AK
            </div>
            <button className="rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium hover:bg-secondary">
              Change avatar
            </button>
          </div>
          <Field label="Full name" defaultValue="Alex Kim" />
          <Field label="Email" defaultValue="alex@studio.com" />
          <button className="mt-2 rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
            Save changes
          </button>
        </Card>

        <Card title="Password" desc="Update your password regularly.">
          <Field label="Current password" type="password" />
          <Field label="New password" type="password" />
          <Field label="Confirm new password" type="password" />
          <button className="mt-2 rounded-xl border border-border bg-secondary/40 px-4 py-2 text-sm font-medium hover:bg-secondary">
            Update password
          </button>
        </Card>

        <Card title="Appearance" desc="Customize how ModelAI looks on your device.">
          <div className="flex items-center justify-between rounded-2xl border border-border p-4">
            <div>
              <div className="text-sm font-medium">Theme</div>
              <div className="text-xs text-muted-foreground">Switch between light and dark mode.</div>
            </div>
            <button
              onClick={toggle}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium hover:bg-secondary"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </Card>

        <Card title="Danger zone" desc="Irreversible actions.">
          <button className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20">
            Delete account
          </button>
        </Card>
      </div>
    </AppShell>
  );
}

function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div>
        <div className="text-base font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, type = "text", defaultValue }: { label: string; type?: string; defaultValue?: string }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</div>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
