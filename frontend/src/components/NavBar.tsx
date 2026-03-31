"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function SparkIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="text-primary shrink-0"
    >
      <path
        d="M9 1.5L10.5 7.5H16.5L11.5 11.25L13.5 17.25L9 13.5L4.5 17.25L6.5 11.25L1.5 7.5H7.5L9 1.5Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M9 2L10.3 7.2H15.8L11.4 10.5L13 16L9 13L5 16L6.6 10.5L2.2 7.2H7.7L9 2Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NavBar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.push("/login");
    }
  }, [loading, user, pathname, router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initial = user?.username?.[0]?.toUpperCase() ?? "?";

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-border/60 transition-shadow duration-200 data-[scrolled=true]:shadow-sm"
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 text-foreground hover:opacity-80 transition-opacity"
        >
          <SparkIcon />
          <span className="font-semibold text-sm tracking-tight">
            Feature Board
          </span>
        </Link>

        {/* User section */}
        {user && (
          <div className="flex items-center gap-3 shrink-0">
            {/* Initial avatar */}
            <div
              className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center select-none"
              title={user.username}
              aria-label={`Signed in as ${user.username}`}
            >
              {initial}
            </div>

            {/* Username — hidden on very narrow screens */}
            <span className="hidden sm:inline text-sm text-muted-foreground max-w-30 truncate">
              {user.username}
            </span>

            {/* Sign out */}
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              title="Sign out"
              aria-label="Sign out"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogOut size={15} strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
