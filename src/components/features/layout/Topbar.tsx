"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu, LogOut, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";

export function Topbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left - breadcrumb placeholder */}
      <div className="flex items-center gap-2">
        <Menu className="h-5 w-5 text-slate-400 md:hidden" />
        <span className="text-sm font-medium text-slate-500">
          {UI_TEXT.TOPBAR.GREETING}
        </span>
      </div>

      {/* Right - user menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition hover:bg-slate-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs">
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="hidden text-left md:block">
            <p className="text-sm font-medium text-slate-800 leading-none">
              {session?.user?.name ?? UI_TEXT.COMMON.FALLBACK_USER_DISPLAY}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{session?.user?.email}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white py-1 shadow-lg ring-1 ring-slate-200">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={cn(
                "flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              )}
            >
              <LogOut className="h-4 w-4" />
              {UI_TEXT.TOPBAR.BTN_LOGOUT}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
