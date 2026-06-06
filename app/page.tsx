import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#EDF3F2] px-6 py-12 relative overflow-hidden">
      {/* Decorative radial gradients */}
      <div className="absolute top-[10%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-teal-200/20 to-teal-400/5 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-cyan-200/20 to-[#18A999]/5 filter blur-[120px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
          <span className="w-2.5 h-2.5 rounded-full bg-[#18A999] animate-pulse" />
          <span className="text-[10px] tracking-[0.2em] font-semibold text-[#0B5D67] uppercase">
            Active System Status: Secure & Operational
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] leading-tight">
          MY COMPANY <br />
          <span className="bg-gradient-to-r from-[#0B5D67] to-[#18A999] bg-clip-text text-transparent">
            Enterprise Resource Planning
          </span>
        </h1>

        <p className="text-[#64748B] text-base md:text-lg max-w-lg mx-auto">
          Access secure ledgers, operational supply chains, automated talent systems, and high-fidelity real-time executive business intelligence.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto h-[48px] px-8 rounded-[14px] font-medium text-white shadow-lg bg-gradient-to-r from-[#0B5D67] to-[#18A999] hover:shadow-[#18A999]/20 flex items-center justify-center transition duration-200 active:scale-95"
          >
            Enter Secure Portal
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto h-[48px] px-8 rounded-[14px] font-medium text-[#0B5D67] bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition duration-200 active:scale-95"
          >
            Direct Dashboard (Demo)
          </Link>
        </div>

        <p className="text-xs text-slate-400 font-mono pt-8">
          Authorized Terminal • Revision v1.0.4-Build
        </p>
      </div>
    </main>
  );
}
