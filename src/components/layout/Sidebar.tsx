"use client";

import Link from "next/link";
import logo from "../../../public/images/logo.svg";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import barchart from "../../../public/icons/chart.svg";
import barchartActive from "../../../public/icons/chartActive.svg";
import layoutgrid from "../../../public/icons/category-2.svg";
import layoutgridActive from "../../../public/icons/categoryActive-2.svg";
import books from "../../../public/icons/book.svg";
import booksActive from "../../../public/icons/bookActive.svg";
import users from "../../../public/icons/user.svg";
import usersActive from "../../../public/icons/userActive.svg";
import bookmarked from "../../../public/icons/clipboard.svg";
import bookmarkedActive from "../../../public/icons/clipboardActive.svg";
import bell from "../../../public/icons/notification.svg";
import bellActive from "../../../public/icons/notificationActive.svg";
import { LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: barchart, iconActive: barchartActive },
  { href: "/dashboard/categories", label: "Categories", icon: layoutgrid, iconActive: layoutgridActive },
  { href: "/dashboard/books", label: "Books", icon: books, iconActive: booksActive },
  { href: "/dashboard/users", label: "Users", icon: users, iconActive: usersActive },
  { href: "/dashboard/book-sets", label: "Book sets", icon: bookmarked, iconActive: bookmarkedActive },
  { href: "/dashboard/notifications", label: "Notification", icon: bell, iconActive: bellActive },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AA";

  const displayName = session?.user?.name ?? "Admin User";
   const handleLogout = async () => {
    onClose();
    await signOut({ redirect: false });   
    router.push("/login");                
    router.refresh();                     
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col py-7 pb-3 px-2 shadow-sm transition-transform duration-300",
          "lg:relative lg:inset-auto lg:z-auto lg:w-62.5 lg:min-h-[calc(100vh-2rem)] lg:rounded-[32px] lg:translate-x-0 lg:transition-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button — mobile only */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5D6481] hover:text-[#1C1C2E] lg:hidden"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-10">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center">
            <Image src={logo} width={60} height={60} alt="logo of admin dashboard" />
          </div>
          <span className="text-[#5D6481] font-semibold text-[14px] tracking-widest">
            EDUBA
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ href, label, icon, iconActive }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);

            const IconSrc = isActive ? iconActive : icon;

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-[12px] text-[16px] font-normal transition-all",
                  isActive
                    ? "bg-[#9D4A2F] text-[#FFFFFF] font-medium"
                    : "text-[#5D6481] hover:bg-[#F4F4F7] hover:text-[#1C1C2E]"
                )}
              >
                <Image src={IconSrc} alt={label} width={20} height={20} className="w-5 h-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="mt-6">
          <div
            className={cn(
              "flex items-center gap-3 bg-[#F6F8FC] rounded-4xl px-3 py-2 cursor-pointer hover:bg-[#EEF2F9] transition-colors",
              pathname === "/dashboard/profile" && "border-[1.4px] border-[#9D4A2F]"
            )}
            onClick={() => {
              router.push("/dashboard/profile");
              onClose();
            }}
          >
            <div className="w-8 h-8 bg-[#F3FCF7] rounded-full flex items-center justify-center shrink-0">
              <span className="text-[#036B46] text-xs font-semibold">{initials}</span>
            </div>
            <span className="text-[#5D6481] text-sm font-medium flex-1 truncate">
              {displayName}
            </span>
            <Button
              type="button"
              variant="ghost"
              onClick={handleLogout}
              className="text-[#9CA3AF] hover:text-[#9D4A2F] transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
