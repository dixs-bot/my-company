"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TopNavigation from "@/components/dashboard/TopNavigation";
import StatusBadge from "@/components/ui/StatusBadge";
import { ArrowLeft, Edit, Calendar, Mail, Phone, Building2, Shield, User } from "lucide-react";

interface Employee {
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

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecord() {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select(`
            *,
            departments(name),
            positions(name)
          `)
          .eq("id", params.id)
          .single();

        if (error) throw error;
        if (data) setEmployee(data as unknown as Employee);
      } catch {
        // Fallback detailed view mock
        setEmployee({
          id: String(params.id),
          employee_id: "EMP0002",
          full_name: "Sarah Jenkins",
          email: "emp0002@mycompanyerp.internal",
          phone: "+1 (555) 012-3456",
          role: "hr",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          departments: { name: "HRD" },
          positions: { name: "HR Manager" }
        });
      } finally {
        setLoading(false);
      }
    }
    loadRecord();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#EDF3F2]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0B5D67] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopNavigation pageTitle="Employee File Specifications" />

      <main className="flex-1 pt-16 px-8 py-10 max-w-4xl w-full mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/employees"
              className="p-1.5 rounded-lg border border-black/[0.05] bg-white text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xs text-[#64748B] font-semibold">Back to Master Directory</span>
          </div>

          {employee && (
            <Link
              href={`/dashboard/employees/${employee.id}/edit`}
              className="h-9 px-4 rounded-xl text-xs font-bold text-white bg-[#0B5D67] hover:bg-[#063940] transition-colors flex items-center gap-2 shadow"
            >
              <Edit className="h-4 w-4" />
              <span>Modify Employee File</span>
            </Link>
          )}
        </div>

        {employee && (
          <div className="bg-white border border-black/[0.06] rounded-[24px] p-8 shadow-xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-black/[0.05]">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#063940] to-[#0B5D67] text-white font-serif text-2xl font-bold">
                  {employee.full_name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0F172A] leading-tight">{employee.full_name}</h2>
                  <span className="text-xs text-[#64748B] font-semibold">{employee.positions?.name || "Corporate Analyst"}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <StatusBadge value={employee.status} />
                <StatusBadge value={employee.role} type="role" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex gap-3">
                <div className="p-2.5 rounded-xl bg-[#EDF3F2] text-[#0B5D67] shrink-0 h-10 w-10 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Employee ID Number</span>
                  <span className="text-xs font-mono font-bold text-[#0F172A]">{employee.employee_id}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 rounded-xl bg-[#EDF3F2] text-[#0B5D67] shrink-0 h-10 w-10 flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Division Assignment</span>
                  <span className="text-xs font-bold text-[#0F172A]">{employee.departments?.name || "Corporate Hub"}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 rounded-xl bg-[#EDF3F2] text-[#0B5D67] shrink-0 h-10 w-10 flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Email Communication</span>
                  <span className="text-xs font-semibold text-[#0F172A]">{employee.email}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 rounded-xl bg-[#EDF3F2] text-[#0B5D67] shrink-0 h-10 w-10 flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Phone Number</span>
                  <span className="text-xs font-semibold text-[#0F172A]">{employee.phone || "No Connection"}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 rounded-xl bg-[#EDF3F2] text-[#0B5D67] shrink-0 h-10 w-10 flex items-center justify-center">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Creation Date</span>
                  <span className="text-xs font-semibold text-[#0F172A]">
                    {new Date(employee.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 rounded-xl bg-[#EDF3F2] text-[#0B5D67] shrink-0 h-10 w-10 flex items-center justify-center">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Last Directory Update</span>
                  <span className="text-xs font-semibold text-[#0F172A]">
                    {new Date(employee.updated_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
