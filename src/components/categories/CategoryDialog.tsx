"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { categoriesService } from "@/services/categories.services";
import { Category } from "@/types/category";
import { ImageUpload } from "@/components/categories/ImageUpload";

const toSlug = (str: string) =>
    str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    slug: z.string().min(1, "Slug is required"),
    displayOrder: z.number().min(0).optional(),
});
type CategoryForm = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
    category?: Category;
    onClose: () => void;
}

export function CategoryDialog({ category, onClose }: CategoryDialogProps) {
    const queryClient = useQueryClient();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const isEdit = !!category;

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CategoryForm>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name || "",
            slug: category?.slug || "",
            displayOrder: 0,
        },
    });

    const { mutate: saveCategory, isPending } = useMutation({
        mutationFn: (data: CategoryForm) => {
            if (isEdit) {
                return categoriesService.update(category.id, {
                    name: data.name,
                    image: selectedImage,
                });
            }
            return categoriesService.create({
                ...data,
                image: selectedImage ?? undefined,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["books-for-count"] });
            toast.success(
                isEdit
                    ? "Category updated successfully"
                    : "Category created successfully"
            );
            onClose();
        },
        onError: () =>
            toast.error(
                isEdit ? "Failed to update category" : "Failed to create category"
            ),
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setValue("name", name);
        // Auto-generate slug in background
        if (!isEdit) {
            setValue("slug", toSlug(name));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl">
                <form
                    onSubmit={handleSubmit((d) => saveCategory(d))}
                    className="space-y-6"
                >
                    {/* Image Upload */}
                    <ImageUpload
                        value={selectedImage}
                        onChange={setSelectedImage}
                        existingImageUrl={category?.imageUrl ?? undefined}
                    />

                    {/* Category Name */}
                    <div>
                        <input
                            {...register("name")}
                            onChange={handleNameChange}
                            placeholder="Category name"
                            className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all placeholder:text-[#9CA3AF]"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 h-11 text-sm font-medium transition-colors rounded-[12px] bg-[#EBEFF6] border border-[#E5E7EB] text-[#9D4A2F] hover:bg-[#F4F4F7]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 h-12 rounded-xl bg-[#A0522D] text-white text-sm font-semibold hover:bg-[#8B4513] transition-colors disabled:opacity-60"
                        >
                            {isPending
                                ? isEdit
                                    ? "Updating..."
                                    : "Publishing..."
                                : isEdit
                                    ? "Update"
                                    : "Publish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}