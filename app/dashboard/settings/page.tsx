"use client";

import React, { useState } from "react";
import TopNavigation from "@/components/dashboard/TopNavigation";
import { Settings, Shield, Server, Bell, BadgeAlert, Key } from "lucide-react";

export default function SettingsPage() {
  const [envCheck, setEnvCheck] = useState(true);
  const [activityLogs, setActivityLogs] = useState(true);

  return (
    <div className="flex-1 flex flex-col">
      <TopNavigation pageTitle="Security & System Settings" />

      <main className="flex-1 pt-16 px-8 py-10 max-w-4xl w-full mx-auto space-y-6">
        
        {/* Settings blocks */}
        <div className="bg-white border border-black/[0.06] rounded-[24px] p-8 shadow-xl space-y-8">
          
          <div className="border-b border-black/[0.05] pb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#063940] flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-[#18A999]" />
              <span>Identity Verification Settings</span>
            </h3>
            <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
              Enforce authorization matrices, structural rules, and directory standards across ERP nodes.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-bold text-[#0F172A]">Auto Email Translation Mapping</span>
                <span className="block text-[11px] text-[#64748B] mt-0.5">
                  Force standard employee identity mapping conversion rules <code className="bg-[#EDF3F2] text-[#0B5D67] px-1 rounded">id → employeeid@mycompanyerp.internal</code>.
                </span>
              </div>
              <input
                type="checkbox"
                checked={envCheck}
                onChange={() => setEnvCheck(!envCheck)}
                className="h-4.5 w-4.5 accent-[#18A999]"
              />
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-black/[0.04] pt-6">
              <div>
                <span className="block text-xs font-bold text-[#0F172A]">Audit Activity Logging</span>
                <span className="block text-[11px] text-[#64748B] mt-0.5">
                  Record full audit actions for mutations across Employees, Departments, and Positions schemas.
                </span>
              </div>
              <input
                type="checkbox"
                checked={activityLogs}
                onChange={() => setActivityLogs(!activityLogs)}
                className="h-4.5 w-4.5 accent-[#18A999]"
              />
            </div>
          </div>

          {/* Database node statistics */}
          <div className="border-t border-black/[0.05] pt-6 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
              <Server className="h-4 w-4 text-[#0B5D67]" />
              <span>Database Connection Status</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="block text-[9px] uppercase tracking-wider text-emerald-700 font-extrabold">Postgres Pool</span>
                <span className="block text-sm font-black text-[#0f172a] mt-1">Operational</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="block text-[9px] uppercase tracking-wider text-emerald-700 font-extrabold">Supabase API</span>
                <span className="block text-sm font-black text-[#0f172a] mt-1">Active</span>
              </div>
              <div className="p-4 rounded-xl bg-[#EDF3F2] border border-black/[0.05]">
                <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-extrabold">Response Time</span>
                <span className="block text-sm font-black text-[#0F172A] mt-1">14 ms</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
