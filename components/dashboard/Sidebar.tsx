"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, Users, FolderTree, Building2, CalendarCheck, 
  CalendarOff, Coins, Package, ShoppingCart, BadgeDollarSign, 
  BarChart3, Settings, LogOut, ShieldCheck, UserCheck 
} from "lucide-react";

interface SidebarProps {
  currentUser?: {
    full_name: string;
    role: string;
    employee_id: string;
  };
}

export default function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState(currentUser || {
    full_name: "Loading User",
    role: "employee",
    employee_id: "..."
  });

  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
      return;
    }

    async function fetchUserContext() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data } = await supabase
            .from("employees")
            .select("full_name, role, employee_id")
            .eq("auth_user_id", session.user.id)
            .single();
          
          if (data) setProfile(data);
        }
      } catch {
        // Build/Static environment fallback
        setProfile({
          full_name: "Sys Administrator",
          role: "super_admin",
          employee_id: "ADMIN"
        });
      }
    }
    fetchUserContext();
  }, [currentUser]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navGroups = [
    {
      label: "Operational Space",
      items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]
    },
    {
      label: "Master Data",
      items: [
        { label: "Employees", href: "/dashboard/employees", icon: Users },
        { label: "Departments", href: "/dashboard/departments", icon: Building2 },
        { label: "Positions", href: "/dashboard/positions", icon: FolderTree }
      ]
    },
    {
      label: "HR Management",
      items: [
        { label: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
        { label: "Leave Requests", href: "/dashboard/leave", icon: CalendarOff },
        { label: "Payroll Matrix", href: "/dashboard/payroll", icon: Coins }
      ]
    },
    {
      label: "Operations",
      items: [
        { label: "Inventory", href: "/dashboard/inventory", icon: Package },
        { label: "Purchasing", href: "/dashboard/purchasing", icon: ShoppingCart },
        { label: "Sales Pipeline", href: "/dashboard/sales", icon: BadgeDollarSign }
      ]
    },
    {
      label: "System",
      items: [
        { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
        { label: "System Settings", href: "/dashboard/settings", icon: Settings }
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-black/[0.06] bg-[#063940] text-white flex flex-col justify-between">
      <div>
        {/* Brand Banner */}
        <div className="flex h-16 items-center px-6 border-b border-white/[0.06] bg-[#053137]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#18A999] to-[#0B5D67] text-white font-serif font-bold text-lg shadow">
              MC
            </div>
            <div>
              <span className="font-extrabold text-xs tracking-wider block text-white uppercase">My Company</span>
              <span className="text-[9px] uppercase tracking-widest text-[#18A999] font-bold">ERP Hub</span>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Options */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-6 max-h-[calc(100vh-140px)] scrollbar-none">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                {group.label}
              </span>
              <ul className="space-y-0.5 pt-1">
                {group.items.map((item, iIdx) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <li key={iIdx}>
                      <Link
                        href={item.href}
                        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                          isActive
                            ? "text-[#18A999] bg-white/[0.06]"
                            : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeSlide"
                            className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r bg-[#18A999]"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                          isActive ? "text-[#18A999]" : "text-white/30 group-hover:text-white/60"
                        }`} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* User Context Details Panel */}
      <div className="p-4 border-t border-white/[0.06] bg-[#053137]/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#18A999]/15 border border-[#18A999]/30 text-white font-serif font-bold text-sm">
            {profile.full_name.substring(0, 2).toUpperCase()}
          </div>
          <div className="truncate flex-1">
            <span className="block text-xs font-extrabold text-white truncate leading-tight">{profile.full_name}</span>
            <span className="text-[10px] text-white/50 font-medium flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-[#18A999] inline" />
              {profile.role.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full h-9 flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/30 transition-all border border-rose-900/30"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit Account</span>
        </button>
      </div>
    </aside>
  );
}
