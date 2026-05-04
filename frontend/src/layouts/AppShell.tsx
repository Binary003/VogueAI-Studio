import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { motion } from "framer-motion";

export function AppShell({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-8"
        >
          {children ?? <Outlet />}
        </motion.main>
      </div>
    </div>
  );
}
