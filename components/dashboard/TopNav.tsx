"use client";

import React, { useState } from "react";
import { 
  Bell, 
  Search, 
  Settings, 
  Sparkles, 
  ShieldAlert, 
  User, 
  LogOut, 
  Menu 
} from "lucide-react";
import Link from "next/link";

interface TopNavProps {
  onToggleSidebar: () => void;
  userFullName: string;
  userEmail: string;
  userEmployeeId: string;
}

export function TopNav({ onToggleSidebar, userFullName, userEmail, userEmployeeId }: TopNavProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-4 flex-1">
        {/* Toggle button */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-xl text-[#063940]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Status indicator badge */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] tracking-wider font-bold text-emerald-800 uppercase">
            Platform Online
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative max-w-xs w-full hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search ERP modules, records, files..."
            className="w-full h-9 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#18A999] focus:ring-2 focus:ring-[#18A999]/10 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Quick Action Badge */}
        <button className="p-2 hover:bg-slate-100 rounded-xl text-[#0B5D67] hidden sm:flex items-center space-x-1 border border-slate-200">
          <Sparkles className="w-4 h-4 text-[#18A999]" />
          <span className="text-[10px] font-bold tracking-wide uppercase">Actions</span>
        </button>

        {/* Notification system */}
        <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 relative">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* User Account / Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B5D67] to-[#18A999] p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-bold font-mono text-xs text-[#0B5D67]">
                {userEmployeeId}
              </div>
            </div>
          </button>

          {showProfileDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfileDropdown(false)}
              />
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-slate-200/80 shadow-xl py-3 z-50 transform origin-top-right transition-all">
                <div className="px-4 py-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-[#0F172A]">{userFullName}</h4>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">{userEmail}</p>
                </div>
                <div className="py-1">
                  <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile View</span>
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center space-x-3 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>User Settings</span>
                  </Link>
                </div>
                <div className="border-t border-slate-100 pt-1.5 px-2">
                  <Link 
                    href="/login" 
                    className="flex items-center space-x-3 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-semibold">Sign Out Gateway</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
export default TopNav;
