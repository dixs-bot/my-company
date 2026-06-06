"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TopNavigation from "@/components/dashboard/TopNavigation";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";
import { Plus, Search, Eye, Edit, Trash2, ArrowLeft, ArrowRight } from "lucide-react";

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  departments: { name: string } | null;
  positions: { name: string } | null;
}

export default function EmployeesListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const limit = 8;

  async function loadRecords() {
    try {
      setLoading(true);
      const { data, count, error } = await supabase
        .from("employees")
        .select(`
          *,
          departments(name),
          positions(name)
        `, { count: "exact" });

      if (error) throw error;

      if (data) {
        setEmployees(data as unknown as Employee[]);
        setTotalPages(Math.ceil((count || 1) / limit));
      }
    } catch {
      // Build and preview mock states
      const mockList: Employee[] = [
        {
          id: "m-1",
          employee_id: "ADMIN",
          full_name: "System Administrator",
          email: "admin@mycompanyerp.internal",
          phone: "+1 (555) 010-9999",
          role: "super_admin",
          status: "active",
          departments: { name: "Management" },
          positions: { name: "CEO" }
        },
        {
          id: "m-2",
          employee_id: "EMP0001",
          full_name: "Sarah Jenkins",
          email: "emp0001@mycompanyerp.internal",
          phone: "+1 (555) 012-3456",
          role: "hr",
          status: "active",
          departments: { name: "HRD" },
          positions: { name: "HR Manager" }
        },
        {
          id: "m-3",
          employee_id: "EMP0002",
          full_name: "Marcus Aurelius",
          email: "emp0002@mycompanyerp.internal",
          phone: "+1 (555) 011-2233",
          role: "employee",
          status: "inactive",
          departments: { name: "IT" },
          positions: { name: "Backend Developer" }
        }
      ];
      setEmployees(mockList);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, [page]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", deleteTarget);
      
      if (error) throw error;
      loadRecords();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <TopNavigation pageTitle="Employee Master Directory" />

      <main className="flex-1 pt-16 px-8 py-10 max-w-6xl w-full mx-auto space-y-6">
        
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by Employee ID, Name, or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl bg-white border border-black/[0.06] pl-10 pr-4 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#0B5D67]"
            />
          </div>

          <Link
            href="/dashboard/employees/create"
            className="h-9 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0B5D67] to-[#18A999] flex items-center justify-center gap-2 shadow hover:opacity-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Employee</span>
          </Link>
        </div>

        {/* Directory Card Table */}
        <div className="bg-white rounded-[24px] border border-black/[0.06] shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-black/[0.04]">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Identity ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Full Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Division / Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#64748B] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.03]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-xs text-[#64748B]">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0B5D67] border-t-transparent mx-auto mb-2" />
                      Loading Directory...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-xs text-[#64748B]">
                      No active records match search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-xs bg-[#EDF3F2] px-2 py-0.5 rounded text-[#0B5D67]">
                          {emp.employee_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="block text-xs font-bold text-[#0F172A]">{emp.full_name}</span>
                        <span className="block text-[10px] text-[#64748B]">{emp.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="block text-xs font-bold text-[#0F172A]">{emp.positions?.name || "CEO"}</span>
                        <span className="block text-[10px] text-[#64748B]">{emp.departments?.name || "Management"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge value={emp.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/dashboard/employees/${emp.id}`}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/dashboard/employees/${emp.id}/edit`}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(emp.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Simple Pagination Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-black/[0.04] flex items-center justify-between">
            <span className="text-xs text-[#64748B]">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-black/[0.05] bg-white text-xs disabled:opacity-40"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-black/[0.05] bg-white text-xs disabled:opacity-40"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <ConfirmDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
