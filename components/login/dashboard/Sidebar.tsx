"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  FolderTree, 
  UserSquare2, 
  Clock, 
  CalendarOff, 
  BadgeDollarSign, 
  Warehouse, 
  ShoppingCart, 
  Coins, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userFullName: string;
  userRole: string;
}

const menuGroups = [
  {
    title: "General",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }
    ]
  },
  {
    title: "Master Data",
    items: [
      { name: "Employees", href: "/dashboard/employees", icon: Users },
      { name: "Departments", href: "/dashboard/departments", icon: FolderTree },
      { name: "Positions", href: "/dashboard/positions", icon: UserSquare2 }
    ]
  },
  {
    title: "Human Resources",
    items: [
      { name: "Attendance", href: "/dashboard/attendance", icon: Clock },
      { name: "Leave", href: "/dashboard/leave", icon: CalendarOff },
      { name: "Payroll", href: "/dashboard/payroll", icon: BadgeDollarSign }
    ]
  },
  {
    title: "Operations",
    items: [
      { name: "Inventory", href: "/dashboard/inventory", icon: Warehouse },
      { name: "Purchasing", href: "/dashboard/purchasing", icon: ShoppingCart },
      { name: "Sales", href: "/dashboard/sales", icon: Coins }
    ]
  },
  {
    title: "Intelligence & Settings",
    items: [
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { name: "Settings", href: "/dashboard/settings", icon: Settings }
    ]
  }
];

export function Sidebar({ isOpen, setIsOpen, userFullName, userRole }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#063940]/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar Panel */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 bottom-0 left-0 w-[280px] bg-[#063940] text-[#EDF3F2] z-50 flex flex-col justify-between border-r border-[#0B5D67]/30 shadow-2xl lg:translate-x-0 lg:static lg:z-auto"
      >
        {/* Header Branding */}
        <div className="p-6 border-b border-[#0B5D67]/30 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B5D67] to-[#18A999] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <span className="text-white text-base font-serif font-bold tracking-wider">MC</span>
            </div>
            <div>
              <h2 className="text-md font-serif font-bold text-white tracking-wide group-hover:text-[#18A999] transition-colors">
                MY COMPANY ERP
              </h2>
              <span className="text-[10px] tracking-widest text-[#18A999] font-semibold uppercase">
                Enterprise Hub
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-white/5 text-slate-300 lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Navigation Options */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-teal-900">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-2">
              <span className="px-3 text-[10px] uppercase font-bold tracking-[0.15em] text-slate-400 block mb-1">
                {group.title}
              </span>
              <ul className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <li key={itemIdx}>
                      <Link href={item.href} className="block">
                        <motion.div
                          whileHover={{ x: 4 }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                            isActive 
                              ? "bg-gradient-to-r from-[#0B5D67] to-[#18A999]/80 text-white shadow-md border-l-4 border-[#18A999]"
                              : "hover:bg-white/5 text-[#EDF3F2]/85 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#18A999]"}`} />
                            <span className="tracking-wide">{item.name}</span>
                          </div>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                        </motion.div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Admin Summary */}
        <div className="p-4 border-t border-[#0B5D67]/30 bg-[#063940]/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-teal-950 border border-[#18A999]/30 flex items-center justify-center font-bold text-[#18A999] text-sm">
              {userFullName.charAt(0)}
            </div>
            <div className="max-w-[150px]">
              <h4 className="text-xs font-semibold text-white truncate">{userFullName}</h4>
              <p className="text-[10px] text-slate-400 truncate uppercase font-mono tracking-wider">{userRole}</p>
            </div>
          </div>
          <Link href="/login" className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
export default Sidebar;
