import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { deleteAccount, getProfile, updatePassword, updateProfile } from "@/services/api";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — ModelAI Studio" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { user, setUser, logout, token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        // Ignore profile load errors; user might be unauthenticated.
      }
    };

    loadProfile();
  }, [setUser, token]);

  const handleProfileSave = async () => {
    setProfileStatus(null);

    if (!name.trim() || !email.trim()) {
      setProfileStatus("Name and email are required.");
      return;
    }

    try {
      setLoadingProfile(true);
      const updated = await updateProfile({ name: name.trim(), email: email.trim() });
      setUser(updated);
      setProfileStatus("Profile updated.");
    } catch (err) {
      setProfileStatus("Unable to update profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    setPasswordStatus(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus("New passwords do not match.");
      return;
    }

    try {
      setLoadingPassword(true);
      await updatePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus("Password updated.");
    } catch (err) {
      setPasswordStatus("Unable to update password.");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteStatus(null);

    const confirmed = window.confirm("This will permanently delete your account. Continue?");
    if (!confirmed) {
      return;
    }

    try {
      setLoadingDelete(true);
      await deleteAccount();
      logout();
      navigate({ to: "/login" });
    } catch (err) {
      setDeleteStatus("Unable to delete account.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const initials = user?.name
    ? user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
    : "U";
  return (
    <AppShell title="Settings">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Profile" desc="Update your personal information.">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground shadow-glow">
              {initials}
            </div>
            <button className="rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium hover:bg-secondary">
              Change avatar
            </button>
          </div>
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} />
          {profileStatus && (
            <div className="text-xs text-muted-foreground">{profileStatus}</div>
          )}
          <button
            onClick={handleProfileSave}
            disabled={loadingProfile}
            className="mt-2 rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-70"
          >
            {loadingProfile ? "Saving..." : "Save changes"}
          </button>
        </Card>

        <Card title="Password" desc="Update your password regularly.">
          <Field
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <Field
            label="New password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <Field
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          {passwordStatus && (
            <div className="text-xs text-muted-foreground">{passwordStatus}</div>
          )}
          <button
            onClick={handlePasswordSave}
            disabled={loadingPassword}
            className="mt-2 rounded-xl border border-border bg-secondary/40 px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-70"
          >
            {loadingPassword ? "Updating..." : "Update password"}
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
          {deleteStatus && (
            <div className="text-xs text-muted-foreground">{deleteStatus}</div>
          )}
          <button
            onClick={handleDeleteAccount}
            disabled={loadingDelete}
            className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 disabled:opacity-70"
          >
            {loadingDelete ? "Deleting..." : "Delete account"}
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

function Field({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
