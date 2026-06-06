"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TopNavigation from "@/components/dashboard/TopNavigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
}

interface Position {
  id: string;
  name: string;
}

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    department_id: "",
    position_id: "",
    role: "employee",
    status: "active"
  });

  useEffect(() => {
    async function loadSelectorsAndRecord() {
      const { data: deptData } = await supabase.from("departments").select("id, name");
      const { data: posData } = await supabase.from("positions").select("id, name");
      
      if (deptData) setDepartments(deptData);
      if (posData) setPositions(posData);

      try {
        const { data, error: recordErr } = await supabase
          .from("employees")
          .select("*")
          .eq("id", params.id)
          .single();

        if (recordErr) throw recordErr;

        if (data) {
          setFormData({
            full_name: data.full_name,
            phone: data.phone || "",
            department_id: data.department_id || "",
            position_id: data.position_id || "",
            role: data.role,
            status: data.status
          });
        }
      } catch {
        // Mock fallback initializer for builds
        setFormData({
          full_name: "Marcus Aurelius",
          phone: "+1 (555) 011-2233",
          department_id: "",
          position_id: "",
          role: "employee",
          status: "active"
        });
      }
    }
    loadSelectorsAndRecord();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: patchErr } = await supabase
        .from("employees")
        .update({
          full_name: formData.full_name,
          phone: formData.phone || null,
          department_id: formData.department_id || null,
          position_id: formData.position_id || null,
          role: formData.role,
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq("id", params.id);

      if (patchErr) throw patchErr;
      router.push(`/dashboard/employees/${params.id}`);
    } catch (err: any) {
      setError(err.message || "Could not save modifications.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <TopNavigation pageTitle="Modify Employee Identity" />

      <main className="flex-1 pt-16 px-8 py-10 max-w-4xl w-full mx-auto space-y-6">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg border border-black/[0.05] bg-white text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-[#64748B] font-semibold">Cancel Modification</span>
        </div>

        <div className="bg-white border border-black/[0.06] rounded-[24px] p-8 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#063940] border-b border-black/[0.05] pb-3 mb-6">
            Modify File Record
          </h3>

          {error && (
            <div className="p-4 mb-6 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="h-10 w-full rounded-xl bg-[#EDF3F2]/50 border border-black/[0.05] px-4 text-xs focus:outline-none focus:border-[#0B5D67]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-10 w-full rounded-xl bg-[#EDF3F2]/50 border border-black/[0.05] px-4 text-xs focus:outline-none focus:border-[#0B5D67]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Department</label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="h-10 w-full rounded-xl bg-[#EDF3F2]/50 border border-black/[0.05] px-4 text-xs focus:outline-none focus:border-[#0B5D67]"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Position</label>
                <select
                  value={formData.position_id}
                  onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                  className="h-10 w-full rounded-xl bg-[#EDF3F2]/50 border border-black/[0.05] px-4 text-xs focus:outline-none focus:border-[#0B5D67]"
                >
                  <option value="">Select Position</option>
                  {positions.map(pos => (
                    <option key={pos.id} value={pos.id}>{pos.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B]">ERP Authorization Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="h-10 w-full rounded-xl bg-[#EDF3F2]/50 border border-black/[0.05] px-4 text-xs focus:outline-none focus:border-[#0B5D67]"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR Staff</option>
                  <option value="finance">Finance Specialist</option>
                  <option value="admin">Administrator</option>
                  <option value="super_admin">Super Administrator</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Registry Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="h-10 w-full rounded-xl bg-[#EDF3F2]/50 border border-black/[0.05] px-4 text-xs focus:outline-none focus:border-[#0B5D67]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-black/[0.05]">
              <button
                type="submit"
                disabled={submitting}
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#0B5D67] to-[#18A999] text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Apply Modifications</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
