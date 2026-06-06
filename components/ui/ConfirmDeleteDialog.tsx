"use client";

import React from "react";

interface StatusBadgeProps {
  value: string;
  type?: "status" | "role";
}

export default function StatusBadge({ value, type = "status" }: StatusBadgeProps) {
  const getColors = () => {
    const val = value.toLowerCase();
    
    if (type === "status") {
      switch (val) {
        case "active":
          return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
        case "inactive":
          return "bg-slate-100 text-slate-600 border-slate-200";
        case "suspended":
          return "bg-rose-50 text-rose-700 border-rose-200/80";
        default:
          return "bg-gray-50 text-gray-600 border-gray-200";
      }
    } else {
      // Role mapping colors
      switch (val) {
        case "super_admin":
          return "bg-purple-50 text-purple-700 border-purple-200/80";
        case "admin":
          return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
        case "hr":
          return "bg-blue-50 text-blue-700 border-blue-200/80";
        case "finance":
          return "bg-amber-50 text-amber-700 border-amber-200/80";
        case "manager":
          return "bg-teal-50 text-teal-700 border-teal-200/80";
        default:
          return "bg-slate-50 text-slate-700 border-slate-200";
      }
    }
  };

  const formatText = (text: string) => {
    return text.replace("_", " ").toUpperCase();
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${getColors()}`}>
      {formatText(value)}
    </span>
  );
}
