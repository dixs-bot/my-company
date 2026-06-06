"use client";

import React from "react";
import { motion } from "framer-motion";

export function CompanyLogo() {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center justify-center w-16 h-16 rounded-2xl shadow-xl border border-teal-500/10 bg-gradient-to-br from-[#0B5D67] to-[#18A999]"
      >
        <span className="text-white text-2xl font-serif font-semibold tracking-wider select-none">
          MC
        </span>
      </motion.div>
      <div className="mt-3 text-center">
        <h1 className="text-xl font-serif font-bold tracking-wide text-[#0F172A]">
          MY COMPANY
        </h1>
        <p className="text-xs tracking-[0.2em] font-medium text-[#64748B] uppercase">
          Enterprise Resource Planning
        </p>
      </div>
    </div>
  );
}
export default CompanyLogo;
