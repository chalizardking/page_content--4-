"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Clock,
  Settings,
  X,
  PanelLeftClose,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "New Chat", href: "/app", icon: MessageSquare },
  { name: "History", href: "/app/history", icon: Clock },
  { name: "Settings", href: "/app/profile", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "absolute inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] transition-transform duration-300 ease-in-out w-64",
          "md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/app" className="flex items-center space-x-2">
            <Logo className="text-[var(--primary)]" />
            <span className="font-bold tracking-tight text-[var(--primary)] text-lg">
              AIPrep
            </span>
          </Link>

          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-[var(--sidebar-accent)] rounded-md"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            className="hidden md:flex p-2 hover:bg-[var(--sidebar-accent)] rounded-md transition-colors"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-4 px-5 space-y-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm py-2 px-3 rounded-md transition-colors",
                  isActive
                    ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                    : "hover:bg-[var(--sidebar-accent)] text-[var(--muted-foreground)]"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* History section */}
        <div className="flex-1 flex flex-col overflow-y-auto py-8 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm text-[var(--muted-foreground)]">History</h3>
            <Link
              href="/app/history"
              className="text-xs font-medium text-[var(--primary)] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
            <HistoryPlaceholder />
          </div>
        </div>

        {/* User profile */}
        <div className="p-4 border-t border-[var(--sidebar-border)]">
          <button className="w-full flex items-center gap-3 rounded-xl border border-[var(--sidebar-border)] px-3 py-2 text-left transition hover:bg-[var(--sidebar-accent)]">
            <div className="size-10 rounded-full bg-[var(--muted)] flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Demo User</p>
              <p className="text-xs text-[var(--muted-foreground)] truncate">
                demo@example.com
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}

function HistoryPlaceholder() {
  return (
    <div className="text-sm text-[var(--muted-foreground)] py-4 text-center">
      <p>No recent conversations</p>
      <p className="text-xs mt-1">Start a new chat to see history here</p>
    </div>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 39 41"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
    >
      <path d="M17.0328 12.3023L16.6733 12.5077C13.8487 18.0541 10.0613 23.3694 7.26242 28.9029C7.08267 29.2624 6.77454 29.7631 6.6975 30.1355C6.01705 33.4479 9.84302 35.6176 12.3594 33.358L26.7903 8.63039C29.281 6.03695 33.5435 8.39929 32.4137 11.9428C27.7532 19.6975 23.6319 28.0812 18.8045 35.6947C11.9101 46.5949 -3.35531 38.9557 0.663249 27.1825C4.32232 20.9814 7.64758 14.2923 11.4864 8.21955C13.3865 5.21526 16.5321 3.72595 19.8958 5.63894C21.1797 6.37075 22.7717 8.5662 23.311 9.92711C23.388 10.1197 23.5036 10.2866 23.4394 10.5305L19.7418 16.8601L17.0456 12.3023H17.0328Z" />
      <path d="M29.7436 21.0325L38.4483 36.2723C39.9376 39.7901 35.3285 42.6917 32.8249 39.7131L25.7764 27.6189L29.2429 21.3792L29.7307 21.0325H29.7436Z" />
      <path d="M33.5695 0.00244302C37.0745 -0.125945 38.2814 4.84269 35.0717 6.2678C30.0388 8.5146 28.3056 0.207865 33.5695 0.00244302Z" />
    </svg>
  );
}
