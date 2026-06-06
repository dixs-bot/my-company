"use client";

import React from "react";
import LoginCard from "../../components/login/LoginCard";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#EDF3F2] px-4 py-8 md:p-12 overflow-hidden select-none">
      {/* Premium background radial highlights */}
      <div className="absolute top-[10%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-teal-200/20 to-teal-400/5 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-cyan-200/20 to-[#18A999]/5 filter blur-[120px] pointer-events-none" />

      {/* Grid Overlay for subtle tech/corporate feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full flex items-center justify-center">
        <LoginCard />
      </div>
    </main>
  );
}
