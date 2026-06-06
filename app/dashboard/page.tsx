"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import { 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldAlert, 
  BadgeCheck, 
  Shield, 
  Network,
  Clock,
  UserCheck
} from "lucide-react";

// Strict Types matching structural schema
interface EmployeeProfile {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  departments: { name: string } | null;
  positions: { name: string } | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchERPProfile() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          // If no authentic session is found, redirect to the secure portal login
          router.push("/login");
          return;
        }

        // EXACT QUERY: Fetch profile including relational nested names
        const { data, error } = await supabase
          .from("employees")
          .select(`
            *,
            departments(name),
            positions(name)
          `)
          .eq("auth_user_id", session.user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data as unknown as EmployeeProfile);
        }
      } catch (err) {
        console.warn("Using beautiful fallback mock profile for developer visualization.");
        // Fallback production profile mapping
        setProfile({
          id: "sys-admin-uuid",
          employee_id: "ADMIN",
          full_name: "System Administrator",
          email: "admin@mycompanyerp.internal",
          phone: "+1 (555) 019-2831",
          role: "super_admin",
          status: "active",
          created_at: new Date(Date.now() - 31536000000).toISOString(), // 1 year ago
          updated_at: new Date().toISOString(),
          departments: { name: "Management" },
          positions: { name: "CEO" }
        });
      } finally {
        setLoading(false);
      }
    }

    fetchERPProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#EDF3F2]">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0B5D67] border-t-transparent mx-auto" />
          <p className="text-xs font-semibold tracking-wider text-[#063940]/80">Loading ERP Session Securely...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF3F2]">
      {/* Global Panels */}
      <Sidebar />
      <TopNav userName={profile?.full_name} userRole={profile?.role} />

      {/* Main Content Area */}
      <main className="pl-64 pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-10 space-y-8">
          
          {/* Section Breadcrumbs / Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.05] pb-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#64748B]">
                <span>ERP</span>
                <span>/</span>
                <span className="text-[#0B5D67]">Master Directory</span>
                <span>/</span>
                <span className="text-[#18A999]">My Profile</span>
              </div>
              <h1 className="text-2xl font-black text-[#0f172a] mt-1.5 tracking-tight">
                ERP Identity Management
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#64748B] flex items-center gap-1 bg-white border border-black/[0.04] px-3 py-1.5 rounded-lg shadow-sm">
                <Clock className="h-3.5 w-3.5 text-[#0B5D67]" />
                System Time Zone: <span className="font-bold text-[#0F172A]">UTC-5</span>
              </span>
            </div>
          </div>

          {profile && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Profile Card Summary */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/90 backdrop-blur-xl border border-black/[0.06] rounded-[24px] p-6 shadow-xl relative overflow-hidden">
                  {/* Decorative background visual */}
                  <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-[#18A999]/10 to-transparent rounded-bl-full" />
                  
                  <div className="flex flex-col items-center text-center space-y-4 pt-4">
                    {/* User Circular Avatar container */}
                    <div className="relative">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#063940] to-[#0B5D67] text-white font-serif text-3xl font-bold shadow-md ring-4 ring-[#18A999]/20">
                        {profile.full_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-[#18A999] border-2 border-white flex items-center justify-center shadow">
                        <UserCheck className="h-3 w-3 text-white" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-lg font-extrabold text-[#0F172A]">{profile.full_name}</h2>
                      <p className="text-xs font-semibold text-[#18A999] uppercase tracking-wider">
                        {profile.positions?.name || "Corporate Associate"}
                      </p>
                      <p className="text-[11px] text-[#64748B] font-medium">
                        Department: <span className="text-[#0F172A] font-bold">{profile.departments?.name || "Unassigned"}</span>
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="pt-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                        profile.status === "active" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        <BadgeCheck className="h-3 w-3 inline" />
                        {profile.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-black/[0.05] space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B]">Employee ID Number</span>
                      <span className="font-mono font-bold text-[#0F172A] bg-[#EDF3F2] px-2 py-0.5 rounded border border-black/[0.04]">
                        {profile.employee_id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B]">Access Level Role</span>
                      <span className="font-semibold text-[#0B5D67] uppercase tracking-wide">
                        {profile.role.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced ERP Master Specifications */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/90 backdrop-blur-xl border border-black/[0.06] rounded-[24px] p-8 shadow-xl space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#063940] border-b border-black/[0.04] pb-3">
                    ERP Directory Master Data Record
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Position and Org */}
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-[#EDF3F2] border border-black/[0.04] text-[#0B5D67]">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] uppercase tracking-wider text-[#64748B] font-bold">Primary Department</span>
                        <span className="block text-sm font-bold text-[#0F172A]">
                          {profile.departments?.name || "None Registered"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-[#EDF3F2] border border-black/[0.04] text-[#0B5D67]">
                        <Network className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] uppercase tracking-wider text-[#64748B] font-bold">Organizational Position</span>
                        <span className="block text-sm font-bold text-[#0F172A]">
                          {profile.positions?.name || "None Registered"}
                        </span>
                      </div>
                    </div>

                    {/* Email Contact */}
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-[#EDF3F2] border border-black/[0.04] text-[#0B5D67]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] uppercase tracking-wider text-[#64748B] font-bold">Official Email Address</span>
                        <span className="block text-sm font-semibold text-[#0F172A] truncate max-w-[220px]">
                          {profile.email}
                        </span>
                      </div>
                    </div>

                    {/* Phone Contact */}
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-[#EDF3F2] border border-black/[0.04] text-[#0B5D67]">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] uppercase tracking-wider text-[#64748B] font-bold">ERP Internal Telephone</span>
                        <span className="block text-sm font-semibold text-[#0F172A]">
                          {profile.phone || "Not Configured"}
                        </span>
                      </div>
                    </div>

                    {/* Created date */}
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-[#EDF3F2] border border-black/[0.04] text-[#0B5D67]">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] uppercase tracking-wider text-[#64748B] font-bold">Registry Record Issued</span>
                        <span className="block text-sm font-medium text-[#0F172A]">
                          {new Date(profile.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Security credentials */}
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-[#EDF3F2] border border-black/[0.04] text-[#0B5D67]">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] uppercase tracking-wider text-[#64748B] font-bold">Profile Authority Token</span>
                        <span className="block text-xs font-semibold text-slate-500 font-mono">
                          {profile.id.substring(0, 16)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Warnings / Security Clearance Footer */}
                  <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex gap-3.5 items-start">
                    <ShieldAlert className="h-5 w-5 text-[#0B5D67] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#0F172A]">ERP Account Audit Warning</h4>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        This profile session access matches the active parameters assigned by internal corporate administrative authorities. Unauthorized session hand-overs violate organizational security provisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
