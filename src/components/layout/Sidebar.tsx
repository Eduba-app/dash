"use client";

import Link from "next/link";
import logo from "../../../public/images/logo.svg";
import { usePathname } from "next/navigation";
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
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation';

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: barchart, iconActive: barchartActive },
  { href: "/dashboard/categories", label: "Categories", icon: layoutgrid, iconActive: layoutgridActive },
  { href: "/dashboard/books", label: "Books", icon: books, iconActive: booksActive },
  { href: "/dashboard/users", label: "Users", icon: users, iconActive: usersActive },
  { href: "/dashboard/book-sets", label: "Book sets", icon: bookmarked, iconActive: bookmarkedActive },
  { href: "/dashboard/notifications", label: "Notification", icon: bell, iconActive: bellActive },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "AA";

  const displayName = session?.user?.name ?? "Admin User";

  const router = useRouter();

  return (
    <aside className="w-62.5 min-h-screen bg-white rounded-[32px] flex flex-col py-7 pb-3 px-2 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center">
          <Image
            src={logo}
            width={60}
            height={60}
            alt="logo of admin dashboard"
          />
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
              className={cn(
                "flex items-center gap-3  p-3 rounded-[12px] text-[16px] font-normal transition-all",
                isActive
                  ? "bg-[#9D4A2F] text-[#FFFFFF] font-medium"
                  : "text-[#5D6481] hover:bg-[#F4F4F7] hover:text-[#1C1C2E]"
              )}
            >
              <Image
                src={IconSrc}
                alt={label}
                width={20}
                height={20}
                className="w-5 h-5 shrink-0"
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User - Clickable to Profile */}
      <div className="mt-6">
        <div
          className={cn(
            "flex items-center gap-3 bg-[#F6F8FC] rounded-4xl px-3 py-2 cursor-pointer hover:bg-[#EEF2F9] transition-colors",
            pathname === "/dashboard/profile" && "border-[1.4px] border-[#9D4A2F]"
          )}
          onClick={() => router.push('/dashboard/profile')}
        >
          <div className="w-8 h-8 bg-[#F3FCF7] rounded-full flex items-center justify-center shrink-0">
            <span className="text-[#036B46] text-xs font-semibold">{initials}</span>
          </div>
          <span className="text-[#5D6481] text-sm font-medium flex-1 truncate">
            {displayName}
          </span>

          {/* Logout Button */}
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              signOut({ callbackUrl: "/login" });
            }}
            className="text-[#9CA3AF] hover:text-[#9D4A2F] transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

{/* User */ }
{/* <div className="mt-6">
        <div className="flex items-center gap-3 bg-[#F6F8FC] rounded-4xl px-3 py-2">
          <div className="w-8 h-8 bg-[#F3FCF7] rounded-full flex items-center justify-center shrink-0">
            <span className="text-[#036B46] text-xs font-semibold">{initials}</span>
          </div>
          <span className="text-[#5D6481] text-sm font-medium flex-1 truncate">
            {displayName}
          </span>
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-[#9CA3AF] hover:text-[#9D4A2F] transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div> */}