"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PanelLeft } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile header */}
        <header className="md:hidden flex items-center p-4 border-b border-[var(--border)] bg-[var(--background)] z-10 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-[var(--accent)] rounded-md transition-colors"
            aria-label="Open sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <span className="ml-2 font-bold text-lg">AIPrep</span>
        </header>

        {children}
      </main>
    </div>
  );
}
