"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Bell, Search, LogOut, User, Settings, Menu } from "lucide-react";

interface TopNavigationProps {
  pageTitle: string;
  userName?: string;
  userRole?: string;
}

export default function TopNavigation({
  pageTitle,
  userName = "System Administrator",
  userRole = "super_admin"
}: TopNavigationProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 right-0 z-30 h-16 left-64 bg-white/85 backdrop-blur-md border-b border-black/[0.06] px-8 flex items-center justify-between">
      {/* Title & Section Label */}
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 text-[#64748B]">
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">
          {pageTitle}
        </h2>
      </div>

      {/* Profile & Notifications Panel */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors hover:bg-slate-50 rounded-lg">
          <Bell className="h-4.5 w-4.5" />
        </button>

        <div className="h-5 w-px bg-black/[0.08]" />

        {/* User Quick Access dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B5D67]/10 text-[#0B5D67] font-semibold text-xs border border-[#0B5D67]/20 group-hover:bg-[#0B5D67]/15 transition-all">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden lg:block">
              <span className="block text-xs font-bold text-[#0F172A] leading-tight">{userName}</span>
              <span className="block text-[9px] text-[#64748B] font-bold uppercase tracking-wider">{userRole.replace("_", " ")}</span>
            </div>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-3 w-52 rounded-xl bg-white border border-black/[0.08] shadow-lg py-1.5 z-20">
                <button
                  onClick={() => { setDropdownOpen(false); router.push("/dashboard"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-all"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); router.push("/dashboard/settings"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-all"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>System Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-all border-t border-black/[0.04]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
