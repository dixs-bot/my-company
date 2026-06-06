import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MY COMPANY ERP - Secure Portal",
  description: "Next-generation Enterprise Resource Planning Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#EDF3F2]">
        {children}
      </body>
    </html>
  );
}
