"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search, ShieldOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import { usersService } from "@/services/users.services";
import { User } from "@/types/user";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { DeactivateUserDialog } from "./DeactivateUserDialog";
import { EmptyState } from "./EmptyState";
import { UserStatusBadge } from "./UserStatusBadge";
import { TableSkeleton } from "./TableSkeleton";
import trash from "../../../public/icons/trash.svg";

const ITEMS_PER_PAGE = 10;

/** Generate avatar initials from name */
function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export function UsersTable() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);
    const search = useDebounce(searchInput, 400);

    const {
        data: response,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["users", page, search],
        queryFn: () =>
            usersService.getAll({
                page,
                limit: ITEMS_PER_PAGE,
                q: search || undefined,
            }),
    });

    const users: User[] = response?.data?.data ?? [];
    const totalPages = response?.data?.meta?.pagesCount ?? 1;

    const isEmpty = !isLoading && !isError && users.length === 0 && !search;
    const noResults = !isLoading && users.length === 0 && !!search;

    return (
        <div className="p-4 sm:p-6 flex flex-col min-h-full">
            {/* Header */}
            <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:gap-4">
                <h1 className="text-[#19213D] text-2xl sm:text-[32px] font-semibold">
                    Users
                </h1>

                {/* Search */}
                <div className="relative flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search a user"
                        className="w-full h-10 pl-9 pr-4 rounded-full border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                    />
                </div>
            </div>

            {/* Content */}
            {isError ? (
                <div className="bg-white rounded-2xl p-12 text-center text-[#6B7280]">
                    Failed to load users. Please try again.
                </div>
            ) : isEmpty ? (
                <EmptyState />
            ) : noResults ? (
                <div className="flex flex-col items-center justify-start pt-16">
                    <p className="text-[#6B7280] text-sm">
                        No users found matching &quot;{search}&quot;
                    </p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-2xl overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-[1fr_90px] sm:grid-cols-[2fr_1fr_90px] lg:grid-cols-[2fr_1fr_1fr_1fr_90px] px-6 py-4 border-b border-[#F4F4F7]">
                            <span className="text-[#6B7280] text-sm">Name</span>
                            <span className="hidden sm:block text-[#6B7280] text-sm">
                                Subscriptions
                            </span>
                            <span className="hidden lg:block text-[#6B7280] text-sm">
                                Status
                            </span>
                            <span className="hidden lg:block text-[#6B7280] text-sm">
                                Joined
                            </span>
                            <span />
                        </div>

                        {/* Table Body */}
                        {isLoading ? (
                            <TableSkeleton />
                        ) : (
                            users.map((user) => (
                                <div
                                    key={user.id}
                                    className="grid grid-cols-[1fr_90px] sm:grid-cols-[2fr_1fr_90px] lg:grid-cols-[2fr_1fr_1fr_1fr_90px] items-center px-6 py-4 border-b border-[#F4F4F7] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                                >
                                    {/* Avatar + Name + Email */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-[#A0522D]/10 flex items-center justify-center shrink-0">
                                            <span className="text-[#A0522D] text-sm font-semibold">
                                                {getInitials(user.name)}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[#1C1C2E] text-sm font-medium truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-[#9CA3AF] text-xs truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Subscriptions */}
                                    <span className="hidden sm:block text-[#1C1C2E] text-sm">
                                        {user.subscriptionCount}
                                    </span>

                                    {/* Status */}
                                    <div className="hidden lg:block">
                                        <UserStatusBadge status={user.status} />
                                    </div>

                                    {/* Joined date */}
                                    <span className="hidden lg:block text-[#9CA3AF] text-sm">
                                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 justify-end">
                                        <Button
                                            onClick={() => setDeleteTarget(user)}
                                            className="w-9 h-9 rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#A0522D] hover:bg-red-100 hover:text-red-600 transition-colors"
                                            title="Delete user"
                                        >
                                            <Image src={trash} width={24} height={24} alt="trash" />
                                        </Button>
                                        {user.status !== "DEACTIVATED" && (
                                            <button
                                                onClick={() => setDeactivateTarget(user)}
                                                title="Deactivate user"
                                                className="w-9 h-9 rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#9D4A2F] hover:bg-amber-100 transition-colors"
                                            >
                                                <ShieldOff className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {!isLoading && totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-9 h-9 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="w-9 h-9 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <span className="text-[#6B7280] text-sm">
                                Page {page} of {totalPages}
                            </span>
                        </div>
                    )}
                </>
            )}

            {/* Dialogs */}
            {deleteTarget && (
                <DeleteUserDialog
                    user={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                />
            )}

            {deactivateTarget && (
                <DeactivateUserDialog
                    user={deactivateTarget}
                    onClose={() => setDeactivateTarget(null)}
                />
            )}
        </div>
    );
}