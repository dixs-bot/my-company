"use client";

import React from "react";
import { motion } from "framer-motion";

const erpFeatures = [
  { id: "01", name: "Executive Finance & Ledger", desc: "Real-time auditing & balance sheets." },
  { id: "02", name: "Dynamic Supply Chain & Purchasing", desc: "Automated vendor matching & invoicing." },
  { id: "03", name: "Unified Payroll & Talent Systems", desc: "Secure employee portals & digital contracts." },
  { id: "04", name: "Sales, CRM & Inventory", desc: "Precision tracking across global warehouses." },
];

export function HeroSection() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#063940] via-[#0B5D67] to-[#18A999] p-12 flex flex-col justify-between overflow-hidden">
      {/* Decorative vector overlays */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#18A999] opacity-20 filter blur-[80px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#063940] opacity-40 filter blur-[80px]" />

      {/* Corporate Badge Header */}
      <div className="relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#18A999] animate-pulse" />
          <span className="text-[10px] tracking-[0.2em] font-semibold text-white/95 uppercase">
            Internal Platform Secure Network
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="font-serif italic text-white/70 text-lg block mb-1">
            Welcome to the Next Generation
          </span>
          <h2 className="text-4xl font-serif font-bold text-white leading-tight tracking-wide">
            MY COMPANY <br />
            <span className="bg-gradient-to-r from-teal-200 to-white bg-clip-text text-transparent">
              Enterprise Suite
            </span>
          </h2>
        </motion.div>

        {/* Features list */}
        <div className="space-y-4">
          {erpFeatures.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="flex items-start space-x-4 p-3.5 rounded-xl hover:bg-white/5 transition-all duration-300"
            >
              <span className="text-xs font-mono font-bold text-teal-300/80 bg-teal-400/10 px-2 py-1 rounded-md mt-0.5">
                {feature.id}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {feature.name}
                </h4>
                <p className="text-xs text-white/70 mt-0.5">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer / Watermark */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
        <div>
          <span className="text-[11px] text-white/50 tracking-wider block">SYSTEM MODULE</span>
          <span className="text-xs text-white/90 font-medium">Core ERP Master Terminal</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-white/50 tracking-wider block">REVISION</span>
          <span className="text-xs font-mono font-semibold text-teal-300">v1.0.4-Build</span>
        </div>
      </div>
    </div>
  );
}
export default HeroSection;
