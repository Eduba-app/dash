"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import logo from "../../../public/images/logo.svg";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F4F7]">
      {/* Mobile top bar */}
      <header className="lg:hidden flex items-center gap-3 bg-white px-4 py-3 shadow-sm sticky top-0 z-30">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="text-[#5D6481] hover:text-[#1C1C2E] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Image src={logo} width={32} height={32} alt="Eduba logo" />
          <span className="text-[#5D6481] font-semibold text-[14px] tracking-widest">
            EDUBA
          </span>
        </div>
      </header>

      <div className="flex gap-4 p-4">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
