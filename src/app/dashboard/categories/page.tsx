"use client";

import { Button } from "@/components/ui/button";
import { categoriesService } from "@/services/categories.services";
import { Category } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import pencil from "../../../../public/icons/edit-2.svg";
import trash from "../../../../public/icons/trash.svg";
import frame from "../../../../public/images/Frame 16.png";

// ─── helpers
const toSlug = (str: string) =>
  str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

// ─── Schema
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  displayOrder: z.number().min(0).optional(),
});
type CategoryForm = z.infer<typeof categorySchema>;

// ─── Delete Dialog
function DeleteDialog({
  category,
  onClose,
}: {
  category: Category;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutate: deactivateCategory, isPending } = useMutation({
    mutationFn: () => categoriesService.deactivate(category.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
      onClose();
    },
    onError: () => toast.error("Failed to delete category"),
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl text-center">
        <div className="w-14 h-14 bg-[#F4F4F7] rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-[#A0522D]" />
        </div>

        <h2 className="text-[#1C1C2E] text-xl font-bold mb-2">
          Delete this category
        </h2>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
          Are you sure you want to delete this category? All books assigned to
          it will become &quot;Uncategorized.&quot; This action cannot be undone
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 h-11 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-medium hover:bg-[#F4F4F7] transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={() => deactivateCategory()}
            disabled={isPending}
            className="flex-1 h-11 rounded-xl bg-[#A0522D] text-white text-sm font-semibold hover:bg-[#8B4513] transition-colors disabled:opacity-60"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Dialog
function AddCategoryDialog({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [displayOrderValue, setDisplayOrderValue] = useState(0);

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<CategoryForm>({
      resolver: zodResolver(categorySchema),
      defaultValues: { displayOrder: 0 },
    });

  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: categoriesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      onClose();
    },
    onError: () => toast.error("Failed to create category"),
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("name", e.target.value);
    setValue("slug", toSlug(e.target.value));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl">
        <h2 className="text-[#19213D] text-[18px] font-semibold mb-5">Add New Category</h2>

        <form onSubmit={handleSubmit((d) => createCategory(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
              Category name
            </label>
            <input
              {...register("name")}
              onChange={handleNameChange}
              placeholder="e.g. History"
              className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
              Slug{" "}
              <span className="text-[#9CA3AF] font-normal">(auto-generated)</span>
            </label>
            <input
              {...register("slug")}
              placeholder="e.g. history"
              className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm font-mono outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
            />
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
              Display order
            </label>
            <input
              type="number"
              min={0}
              value={displayOrderValue}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setDisplayOrderValue(val);
                setValue("displayOrder", val);
              }}
              placeholder="0"
              className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 text-sm font-medium transition-colors rounded-[12px] bg-[#EBEFF6] border border-[#E5E7EB] text-[#9D4A2F] text-[14px] hover:bg-[#F4F4F7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 h-11 text-sm transition-colors disabled:opacity-60 text-[14px] rounded-[12px] bg-[#A0522D] text-white font-medium hover:bg-[#8B4513]"
            >
              {isPending ? "Creating..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Empty State
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-32">
      <h3 className="text-[#1C1C2E] text-2xl font-bold mb-3">
        No Categories Found
      </h3>
      <p className="text-[#6B7280] text-sm text-center max-w-xs mb-8 leading-relaxed">
        It looks like you haven&apos;t added any categories yet. Start by
        creating your first category to organize your books
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-8 h-12 bg-[#A0522D] text-white text-sm font-semibold rounded-xl hover:bg-[#8B4513] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add New Category
      </button>
    </div>
  );
}

// ─── Main Page
export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const {
    data: result = {
      data: [],
      meta: { page: 1, limit: 100, total: 0, pagesCount: 1 },
    },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories", page, search],
    queryFn: () => categoriesService.getAll({ page, limit: 10, q: search }),
  });

  const categoriesList = result.data;
  const meta = result.meta;
  const totalPages = meta.pagesCount || 1;
  const isEmpty = !isLoading && !isError && categoriesList.length === 0;

  return (
    <div className="p-4 sm:p-6 flex flex-col min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:gap-4">
        {/* Title + mobile add button */}
        <div className="flex items-center justify-between sm:contents">
          <h1 className="text-[#19213D] text-2xl sm:text-[32px] font-semibold">Categories</h1>
          {!isEmpty && !isLoading && (
            <Button
              onClick={() => setShowAdd(true)}
              className="sm:hidden w-10 h-10 bg-[#A0522D] text-white rounded-[12px] hover:bg-[#8B4513] transition-colors flex items-center justify-center p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search a Categories"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-9 pr-4 rounded-full border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
          />
        </div>

        {/* Desktop add button */}
        {!isEmpty && !isLoading && (
          <Button
            onClick={() => setShowAdd(true)}
            className="hidden sm:flex ml-auto items-center gap-2 px-5 h-11 bg-[#A0522D] text-white text-sm font-medium rounded-[12px] hover:bg-[#8B4513] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add New Category
          </Button>
        )}
      </div>

      {/* States */}
      {isError ? (
        <div className="bg-white rounded-2xl p-12 text-center text-[#6B7280]">
          Failed to load categories. Please try again.
        </div>
      ) : isEmpty ? (
        <EmptyState onAdd={() => setShowAdd(true)} />
      ) : (
        <>
          <div className="bg-white rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_90px] sm:grid-cols-[1fr_150px_90px] px-6 py-4 border-b border-[#F4F4F7]">
              <span className="text-[#6B7280] text-sm">Category</span>
              <span className="hidden sm:block text-[#6B7280] text-sm">Book count</span>
              <span />
            </div>

            {/* Rows */}
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[#F4F4F7] last:border-0 animate-pulse">
                  <div className="w-12 h-12 bg-[#F4F4F7] rounded-xl shrink-0" />
                  <div className="h-4 bg-[#F4F4F7] rounded w-32" />
                  <div className="h-4 bg-[#F4F4F7] rounded w-10 ml-auto mr-16" />
                </div>
              ))
              : categoriesList.map((cat: Category) => (
                <div
                  key={cat.id}
                  className="grid grid-cols-[1fr_90px] sm:grid-cols-[1fr_150px_90px] items-center px-6 py-4 border-b border-[#F4F4F7] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                >
                  {/* Name + image */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      {cat.imageUrl && cat.imageUrl !== "test" ? (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={frame}
                          width={48}
                          height={48}
                          alt="category"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#1C1C2E] text-sm font-medium capitalize truncate">
                        {cat.name}
                      </p>
                      <p className="text-[#9CA3AF] text-xs truncate">{cat.slug}</p>
                    </div>
                  </div>

                  {/* Book count — hidden on mobile */}
                  <span className="hidden sm:block text-[#1C1C2E] text-sm">0</span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      onClick={() => setDeleteTarget(cat)}
                      className="w-9 h-9 rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#A0522D] hover:bg-red-100 hover:text-red-600 transition-colors"
                      title="Delete category"
                    >
                      <Image src={trash} width={24} height={24} alt="trash" />
                    </Button>
                    <Button
                      disabled
                      title="Coming soon"
                      className="w-9 h-9 rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#A0522D] opacity-40 cursor-not-allowed"
                    >
                      <Image src={pencil} width={16} height={16} alt="pencil" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-[#6B7280] text-sm">
                Page {page} of {totalPages} • {meta.total} categories
              </span>
            </div>
          )}
        </>
      )}

      {showAdd && <AddCategoryDialog onClose={() => setShowAdd(false)} />}

      {deleteTarget && (
        <DeleteDialog
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
