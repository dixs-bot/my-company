"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import TopNavigation from "@/components/dashboard/TopNavigation";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";
import { Plus, Trash2, Edit, Save, X, Briefcase } from "lucide-react";

interface Position {
  id: string;
  name: string;
  department_id: string;
  created_at: string;
  departments: { name: string } | null;
}

interface Department {
  id: string;
  name: string;
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPosName, setNewPosName] = useState("");
  const [newPosDeptId, setNewPosDeptId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const { data: posData, error: posErr } = await supabase
        .from("positions")
        .select(`
          *,
          departments(name)
        `)
        .order("created_at", { ascending: false });

      const { data: deptData, error: deptErr } = await supabase
        .from("departments")
        .select("id, name");

      if (posErr || deptErr) throw posErr || deptErr;

      if (posData) setPositions(posData as unknown as Position[]);
      if (deptData) setDepartments(deptData as Department[]);
    } catch {
      // Local seed fallback directories
      setPositions([
        { id: "p1", name: "CEO", department_id: "d1", created_at: new Date().toISOString(), departments: { name: "Management" } },
        { id: "p2", name: "HR Manager", department_id: "d3", created_at: new Date().toISOString(), departments: { name: "HRD" } },
        { id: "p3", name: "Backend Developer", department_id: "d2", created_at: new Date().toISOString(), departments: { name: "IT" } }
      ]);
      setDepartments([
        { id: "d1", name: "Management" },
        { id: "d2", name: "IT" },
        { id: "d3", name: "HRD" }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosName.trim() || !newPosDeptId) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("positions")
        .insert([{ 
          name: newPosName.trim(),
          department_id: newPosDeptId 
        }]);

      if (error) throw error;
      setNewPosName("");
      setNewPosDeptId("");
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      const { error } = await supabase
        .from("positions")
        .update({ name: editingName.trim() })
        .eq("id", id);

      if (error) throw error;
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase
        .from("positions")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <TopNavigation pageTitle="Roles & Positions Matrix" />

      <main className="flex-1 pt-16 px-8 py-10 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Creation Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-black/[0.06] rounded-[24px] p-6 shadow-xl sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#063940] border-b border-black/[0.05] pb-3 mb-4">
              Add New Organizational Position
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Position Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Dev"
                  value={newPosName}
                  onChange={(e) => setNewPosName(e.target.value)}
                  className="h-10 w-full rounded-xl bg-[#EDF3F2]/50 border border-black/[0.05] px-4 text-xs focus:outline-none focus:border-[#0B5D67]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Assigned Department</label>
                <select
                  required
                  value={newPosDeptId}
                  onChange={(e) => setNewPosDeptId(e.target.value)}
                  className="h-10 w-full rounded-xl bg-[#EDF3F2]/50 border border-black/[0.05] px-4 text-xs focus:outline-none focus:border-[#0B5D67]"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-10 rounded-xl bg-gradient-to-r from-[#0B5D67] to-[#18A999] text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition-all"
              >
                <Briefcase className="h-4 w-4" />
                <span>Save Position</span>
              </button>
            </form>
          </div>
        </div>

        {/* List table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[24px] border border-black/[0.06] shadow-md overflow-hidden">
            <div className="p-5 border-b border-black/[0.04]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Current System Roles</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-black/[0.04]">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Position Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Associated Division</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#64748B] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03]">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-xs text-[#64748B]">Loading Directory...</td>
                    </tr>
                  ) : positions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-xs text-[#64748B]">No position mappings exist.</td>
                    </tr>
                  ) : (
                    positions.map((pos) => (
                      <tr key={pos.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          {editingId === pos.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-8 rounded-lg border border-black/[0.06] bg-[#EDF3F2]/40 px-3 text-xs focus:outline-none focus:border-[#0B5D67]"
                            />
                          ) : (
                            <span className="text-xs font-bold text-[#0F172A]">{pos.name}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-[#18A999]">
                          {pos.departments?.name || "Management"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {editingId === pos.id ? (
                              <>
                                <button
                                  onClick={() => handleSaveUpdate(pos.id)}
                                  className="p-1 rounded-lg text-[#18A999] hover:bg-[#EDF3F2] transition-colors"
                                >
                                  <Save className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => { setEditingId(pos.id); setEditingName(pos.name); }}
                                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteId(pos.id)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <ConfirmDeleteDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
