"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, children, isLoading, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref as any}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        disabled={disabled || isLoading}
        className={cn(
          "relative w-full h-[48px] rounded-[14px] font-medium text-white shadow-lg transition-shadow duration-300",
          "bg-gradient-to-r from-[#0B5D67] to-[#18A999] hover:shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-[#18A999]/50 focus:ring-offset-2",
          "disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                path-rule="evenodd"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                clip-rule="evenodd"
              />
            </svg>
            <span className="tracking-wide">Signing In...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

GradientButton.displayName = "GradientButton";
export default GradientButton;
