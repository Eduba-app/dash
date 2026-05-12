"use client";

import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/categories/ImageUpload";
import { booksService } from "@/services/books.services";
import { categoriesService } from "@/services/categories.services";
import { Book } from "@/types/book";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, DollarSign } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  priceUSD: z.number().min(0, "Price must be 0 or more"),
  freeTrialCardCount: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});
type EditBookForm = z.infer<typeof editBookSchema>;

interface EditBookDialogProps {
  book: Book;
  onClose: () => void;
}

export function EditBookDialog({ book, onClose }: EditBookDialogProps) {
  const queryClient = useQueryClient();
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [priceValue, setPriceValue] = useState(book.priceCents / 100);
  const [freeCardsValue, setFreeCardsValue] = useState(book.freeTrialCardCount ?? 0);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<EditBookForm>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      title: book.title,
      description: book.description,
      categoryId: book.category?.id || "",
      priceUSD: book.priceCents / 100,
      freeTrialCardCount: book.freeTrialCardCount ?? 0,
      isActive: book.isActive ?? true,
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getAll(),
  });
  const categories = categoriesData?.data ?? [];

  const { mutate: updateBook, isPending } = useMutation({
    mutationFn: (data: EditBookForm) =>
      booksService.update(book.id, {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        priceCents: Math.round(data.priceUSD * 100),
        freeTrialCardCount: data.freeTrialCardCount,
        isActive: data.isActive,
        cover: selectedCover,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book updated successfully");
      onClose();
    },
    onError: () => toast.error("Failed to update book"),
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
        <h2 className="text-[#19213D] text-[18px] font-semibold mb-5">
          Edit Book
        </h2>

        <form onSubmit={handleSubmit((d) => updateBook(d))} className="space-y-5">
          {/* Cover Image */}
          <div>
            <ImageUpload
              value={selectedCover}
              onChange={setSelectedCover}
              existingImageUrl={book.coverImageUrl ?? undefined}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
              Book Title
            </label>
            <input
              {...register("title")}
              placeholder="Book title"
              className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Book description..."
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Two columns: Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
                Category
              </label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field: { onChange, value } }) => (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">
                        {value
                          ? categories.find((cat) => cat.id === value)?.name
                          : "Select a category"}
                      </span>
                      <ChevronDown
                        className={`text-[#9CA3AF] transition-transform duration-200 w-4 h-4 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border border-[#EBEFF6] shadow-2xl max-h-60 overflow-auto">
                        {categories.map((cat) => (
                          <div
                            key={cat.id}
                            className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                              value === cat.id
                                ? "bg-[#F6F8FC]"
                                : "hover:bg-[#F6F8FC]"
                            }`}
                            onClick={() => {
                              onChange(cat.id);
                              setValue("categoryId", cat.id);
                              setIsOpen(false);
                            }}
                          >
                            {cat.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
              {errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="priceUSD" className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
                Price (USD)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#FFF0EB] border border-[#F0C4A8] rounded-full flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-[#A0522D]" />
                </div>
                <input
                  id="priceUSD"
                  type="number"
                  min={0}
                  step={1}
                  value={priceValue}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    setPriceValue(v);
                    setValue("priceUSD", v);
                  }}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Free Cards */}
          <div>
            <label htmlFor="freeTrialCardCount" className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
              Free trial cards
            </label>
            <input
              id="freeTrialCardCount"
              type="number"
              min={0}
              value={freeCardsValue}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const v = parseInt(e.target.value) || 0;
                setFreeCardsValue(v);
                setValue("freeTrialCardCount", v);
              }}
              placeholder="0"
              className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
            />
          </div>

          {/* Active Status */}
          <Controller
            control={control}
            name="isActive"
            render={({ field: { onChange, value } }) => (
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A0522D]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A0522D]"></div>
                  <span className="text-sm text-[#1C1C2E] ml-3">
                    Book is {value ? "active" : "inactive"}
                  </span>
                </label>
              </div>
            )}
          />

          {/* Note about APKG */}
          <div className="bg-[#FFF9F5] border border-[#FFE5D0] rounded-xl p-3">
            <p className="text-[#A0522D] text-xs">
              <strong>Note:</strong> APKG file cannot be changed after creation.
              Import status: <span className="font-semibold">{book.importStatus}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 text-sm font-medium transition-colors rounded-[12px] bg-[#EBEFF6] border border-[#E5E7EB] text-[#9D4A2F] hover:bg-[#F4F4F7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 h-11 text-sm transition-colors disabled:opacity-60 rounded-[12px] bg-[#A0522D] text-white font-medium hover:bg-[#8B4513]"
            >
              {isPending ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}