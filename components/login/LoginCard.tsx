"use client";

import React from "react";
import { motion } from "framer-motion";
import CompanyLogo from "./CompanyLogo";
import LoginForm from "./LoginForm";
import HeroSection from "./HeroSection";

export function LoginCard() {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative flex w-full max-w-[980px] h-auto md:h-[580px] rounded-[28px] overflow-hidden bg-white/85 backdrop-blur-xl border border-white/40 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] flex-col md:flex-row"
    >
      {/* Decorative gradient blur inner ring */}
      <div className="absolute inset-0 border border-white/20 rounded-[28px] pointer-events-none" />

      {/* Hero Side Column (Left on Desktop, Top on Mobile) */}
      <div className="w-full md:w-[45%] h-[300px] md:h-full flex-shrink-0">
        <HeroSection />
      </div>

      {/* Login Form Side Column (Right) */}
      <div className="w-full md:w-[55%] h-full flex flex-col justify-center items-center p-8 md:p-12 relative">
        <div className="w-full max-w-[340px] flex flex-col space-y-6">
          <CompanyLogo />
          
          <div className="border-t border-slate-100/80 my-2" />
          
          <LoginForm />
        </div>
      </div>
    </motion.div>
  );
}
export default LoginCard;
