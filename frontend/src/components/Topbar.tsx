import { Bell, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function Topbar({ title }: { title: string }) {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/60 px-4 md:px-8 backdrop-blur-xl">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        <p className="text-xs text-muted-foreground">Welcome back, ready to create?</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-sm text-muted-foreground w-72">
          <Search className="h-4 w-4" />
          <input
            placeholder="Search projects, presets…"
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary/40 hover:bg-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary/40 hover:bg-secondary transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full gradient-primary" />
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-2 py-1">
          <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
            AK
          </div>
          <div className="hidden md:block pr-2">
            <div className="text-xs font-medium leading-none">Alex Kim</div>
            <div className="text-[10px] text-muted-foreground">Pro Plan</div>
          </div>
        </div>
      </div>
    </header>
  );
}
