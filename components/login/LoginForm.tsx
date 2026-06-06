"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmployeeId } from "../../lib/auth";
import { GradientButton } from "./GradientButton";

const loginSchema = z.object({
  employeeId: z
    .string()
    .min(3, { message: "Employee ID must be at least 3 characters" })
    .max(20, { message: "Employee ID must be under 20 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(false),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      employeeId: "",
      password: "",
      rememberMe: false,
    },
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    // Auto close toast after 5 seconds
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    setToast(null);

    try {
      const response = await signInWithEmployeeId(data.employeeId, data.password);
      if (response.success) {
        showToast("success", `Welcome back, ${response.user?.fullName}! Redirecting to your dashboard...`);
        // Store user in sessionStorage or similar for demo persistence
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("erp_user", JSON.stringify(response.user));
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        }
      } else {
        showToast("error", response.error || "Invalid sign-in credentials.");
      }
    } catch (err) {
      showToast("error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Premium Toast Notification System */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`absolute -top-16 left-0 right-0 z-50 p-4 rounded-xl border flex items-center space-x-3 shadow-xl backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800"
                : "bg-rose-500/10 border-rose-500/20 text-rose-850"
            }`}
          >
            {toast.type === "success" ? (
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#64748B] mb-2">
            Employee ID
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="e.g. EMP100"
              {...register("employeeId")}
              className={`w-full h-11 pl-10 pr-4 bg-white/60 backdrop-blur-sm border rounded-xl text-sm text-[#0F172A] outline-none transition-all duration-200 placeholder:text-slate-400 ${
                errors.employeeId
                  ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-[#18A999] focus:ring-2 focus:ring-[#18A999]/10"
              }`}
            />
          </div>
          {errors.employeeId && (
            <span className="text-xs text-rose-500 mt-1.5 block font-medium">
              {errors.employeeId.message}
            </span>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748B]">
              Security Password
            </label>
            <a href="#" className="text-xs font-medium text-[#0B5D67] hover:text-[#18A999] transition-colors">
              Reset Key?
            </a>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`w-full h-11 pl-10 pr-10 bg-white/60 backdrop-blur-sm border rounded-xl text-sm text-[#0F172A] outline-none transition-all duration-200 placeholder:text-slate-400 ${
                errors.password
                  ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-[#18A999] focus:ring-2 focus:ring-[#18A999]/10"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-rose-500 mt-1.5 block font-medium">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between py-1">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 rounded border-slate-300 text-[#0B5D67] focus:ring-[#0B5D67] focus:ring-offset-0 transition duration-150 cursor-pointer"
            />
            <span className="text-xs font-medium text-[#64748B]">Keep me signed in</span>
          </label>
        </div>

        <GradientButton type="submit" isLoading={isLoading} className="mt-2">
          Secure Portal Access
        </GradientButton>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400 font-medium">
            Authorized ERP terminal. Activity is audited.
          </p>
        </div>
      </form>
    </div>
  );
}
export default LoginForm;
