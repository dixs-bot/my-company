"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signOut } from "../../lib/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<{
    fullName: string;
    employeeId: string;
    role: string;
    department: string;
    email: string;
  } | null>(null);

  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.sessionStorage.getItem("erp_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        // Display premium toast notification on successful initialization
        setNotif(`System Authorized. Welcome to your operational terminal, ${parsed.fullName}.`);
        setTimeout(() => setNotif(null), 6000);
      } else {
        // Mock default if direct access
        const mock = {
          fullName: "Alexander Sterling",
          employeeId: "EMP100",
          role: "Chief Technology Officer",
          department: "Executive Management",
          email: "emp100@mycompanyerp.internal",
        };
        setUser(mock);
        setNotif("Active Session Restored: Exec Terminal.");
        setTimeout(() => setNotif(null), 5000);
      }
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("erp_user");
      window.location.href = "/login";
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#EDF3F2] text-[#0F172A] p-6 md:p-12 relative font-sans">
      {/* Toast notification */}
      {notif && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed top-6 right-6 z-50 bg-teal-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-teal-500/20 flex items-center space-x-3 text-sm font-medium max-w-md"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
          <span>{notif}</span>
        </motion.div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/75 backdrop-blur-md border border-slate-200/50 p-6 rounded-2xl shadow-sm gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B5D67] to-[#18A999] shadow-lg">
              <span className="text-white text-lg font-serif font-semibold tracking-wider">MC</span>
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-[#0F172A]">MY COMPANY ERP</h1>
              <p className="text-xs text-[#64748B] tracking-wider uppercase font-medium">Enterprise Central Hub</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-left md:text-right">
              <span className="text-sm font-semibold text-[#0F172A] block">{user.fullName}</span>
              <span className="text-xs text-[#64748B] block font-mono">{user.employeeId} • {user.role}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition duration-150 active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* User Card & Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white/75 backdrop-blur-md border border-slate-200/50 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#64748B]">Security Clearance</h3>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                <span className="text-sm font-medium text-[#0F172A]">{user.department}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Operational Key</span>
                <span className="text-xs font-mono text-teal-700 bg-teal-500/10 px-2 py-0.5 rounded-md mt-1 inline-block">
                  {user.email}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Session Status</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  Active / Audited (TLS 1.3)
                </span>
              </div>
            </div>
          </div>

          {/* ERP Core stats */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            {[
              { label: "Pending Requisitions", val: "14 Approved", change: "2 awaiting review", color: "text-[#0B5D67]" },
              { label: "Active Payroll Run", val: "Cycle 06-B", change: "98.2% disbursed", color: "text-[#18A999]" },
              { label: "Inventory Thresholds", val: "99.8% Nominal", change: "0 low stock alerts", color: "text-emerald-700" },
              { label: "Operational Logs", val: "0 Warnings", change: "System stable", color: "text-slate-700" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/75 backdrop-blur-md border border-slate-200/50 p-5 rounded-2xl shadow-sm">
                <span className="text-xs text-[#64748B] font-medium block mb-1">{stat.label}</span>
                <span className={`text-xl font-bold block ${stat.color}`}>{stat.val}</span>
                <span className="text-[10px] text-slate-400 mt-1 block">{stat.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#0F172A] pl-1">Primary Operational Modules</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { title: "Finance", desc: "Ledgers & Ledger Runs", icon: "💰" },
              { title: "Payroll", desc: "Comp & Benefits", icon: "📄" },
              { title: "Purchasing", desc: "Purchase Orders", icon: "🛒" },
              { title: "Inventory", desc: "Warehouses", icon: "📦" },
              { title: "Talent Suite", desc: "HR Management", icon: "👥" },
              { title: "BI Reports", desc: "Executive Analytics", icon: "📈" },
            ].map((module, i) => (
              <button
                key={i}
                className="bg-white/60 hover:bg-white/95 border border-slate-200/50 p-4 rounded-xl text-left transition duration-200 shadow-sm hover:-translate-y-1 active:scale-95"
              >
                <span className="text-2xl block mb-2">{module.icon}</span>
                <span className="text-sm font-semibold text-[#0F172A] block">{module.title}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block line-clamp-1">{module.desc}</span>
              </button>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
