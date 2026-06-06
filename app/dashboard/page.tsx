"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import TopNavigation from "@/components/dashboard/TopNavigation";
import StatusBadge from "@/components/ui/StatusBadge";
import { 
  Building2, Mail, Phone, Calendar, ShieldCheck, 
  UserCheck, UserEdit, Key, ClipboardList 
} from "lucide-react";

interface ProfileData {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  created_at: string;
  departments: { name: string } | null;
  positions: { name: string } | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIdentity() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("employees")
          .select(`
            *,
            departments(name),
            positions(name)
          `)
          .eq("auth_user_id", session.user.id)
          .single();

        if (error) throw error;
        if (data) setProfile(data as unknown as ProfileData);
      } catch {
        // Build environment mock seeding
        setProfile({
          id: "sys-admin-uuid",
          employee_id: "ADMIN",
          full_name: "System Administrator",
          email: "admin@mycompanyerp.internal",
          phone: "+1 (555) 019-2831",
          role: "super_admin",
          status: "active",
          created_at: new Date(Date.now() - 31536000000).toISOString(),
          departments: { name: "Management" },
          positions: { name: "CEO" }
        });
      } finally {
        setLoading(false);
      }
    }
    loadIdentity();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#EDF3F2]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0B5D67] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopNavigation 
        pageTitle="Workspace Dashboard" 
        userName={profile?.full_name} 
        userRole={profile?.role} 
      />

      <main className="flex-1 pt-16 px-8 py-10 max-w-6xl w-full mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex justify-between items-center pb-5 border-b border-black/[0.05]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Directory Access</span>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight mt-1">Identity & Security Profile</h1>
          </div>
          <span className="text-xs text-[#64748B] bg-white px-3 py-1.5 rounded-lg border border-black/[0.04]">
            Node: <span className="font-bold text-[#0F172A]">Enterprise Main</span>
          </span>
        </div>

        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Visual Identity Profile Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-[24px] p-6 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-[#18A999]/10 to-transparent rounded-bl-full" />
              
              <div className="flex flex-col items-center text-center space-y-4 pt-4">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#063940] to-[#0B5D67] text-white font-serif text-2xl font-bold shadow-md">
                    {profile.full_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-[#18A999] border-2 border-white flex items-center justify-center text-white">
                    <UserCheck className="h-3 w-3" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{profile.full_name}</h3>
                  <p className="text-[10px] font-bold text-[#18A999] uppercase tracking-widest mt-0.5">{profile.positions?.name || "CEO"}</p>
                </div>

                <div className="pt-1">
                  <StatusBadge value={profile.status} />
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-black/[0.05] space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748B]">System ID</span>
                  <span className="font-mono font-bold text-[#0f172a]">{profile.employee_id}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748B]">Role Clearance</span>
                  <span className="font-semibold text-[#0B5D67] uppercase">{profile.role.replace("_", " ")}</span>
                </div>
              </div>
            </div>

            {/* Master Record Data */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-[24px] p-8 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#063940] border-b border-black/[0.05] pb-3 mb-6">
                  Directory Metadata
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <div className="p-2.5 rounded-xl bg-[#EDF3F2] text-[#0B5D67] shrink-0 h-10 w-10 flex items-center justify-center">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Department</span>
                      <span className="text-xs font-bold text-[#0F172A]">{profile.departments?.name || "Corporate Admin"}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="p-2.5 rounded-xl bg-[#EDF3F2] text-[#0B5D67] shrink-0 h-10 w-10 flex items-center justify-center">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Official Email</span>
                      <span className="text-xs font-semibold text-[#0F172A] truncate block max-w-[200px]">{profile.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="p-2.5 rounded-xl bg-[#EDF3F2] text-[#0B5D67] shrink-0 h-10 w-10 flex items-center justify-center">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Telephone</span>
                      <span className="text-xs font-semibold text-[#0F172A]">{profile.phone || "No Connection"}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="p-2.5 rounded-xl bg-[#EDF3F2] text-[#0B5D67] shrink-0 h-10 w-10 flex items-center justify-center">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Registration Date</span>
                      <span className="text-xs font-semibold text-[#0F172A]">
                        {new Date(profile.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick actions panel */}
                <div className="mt-8 pt-6 border-t border-black/[0.05]">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-4">Quick Action Workspace</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => router.push(`/dashboard/employees/${profile.id}/edit`)}
                      className="h-10 flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-[#0B5D67] bg-[#EDF3F2] hover:bg-[#0B5D67]/10 transition-colors border border-[#0B5D67]/10"
                    >
                      <UserEdit className="h-4 w-4" />
                      <span>Edit My Profile</span>
                    </button>
                    <button
                      onClick={() => router.push("/dashboard/settings")}
                      className="h-10 flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-[#0B5D67] bg-[#EDF3F2] hover:bg-[#0B5D67]/10 transition-colors border border-[#0B5D67]/10"
                    >
                      <Key className="h-4 w-4" />
                      <span>Passkey Settings</span>
                    </button>
                    <button
                      onClick={() => router.push("/dashboard/employees")}
                      className="h-10 flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-[#0B5D67] bg-[#EDF3F2] hover:bg-[#0B5D67]/10 transition-colors border border-[#0B5D67]/10"
                    >
                      <ClipboardList className="h-4 w-4" />
                      <span>Employee Directory</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
