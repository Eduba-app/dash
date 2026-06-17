"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { ChevronDown, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bundlesService } from "@/services/bundles.services";
import { categoriesService } from "@/services/categories.services";
import { priceTiersService } from "@/services/price-tiers.services";
import { BundleBooksSection } from "./BundleBooksSection";
import camera from "../../../../../../../public/icons/camera 1.svg";

const bundleSchema = z.object({
    title: z.string().min(1, "Book set name is required"),
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().min(1, "Category is required"),
    priceTierId: z.string().min(1, "Price tier is required"),
    durationDays: z.number().min(1, "Duration must be at least 1 day"),
    isActive: z.boolean().optional(),
});

type BundleFormData = z.infer<typeof bundleSchema>;

/*  Cover Upload  */
function CoverUpload({
    file,
    onSelect,
    onClear,
    existingUrl,
}: {
    file: File | null;
    onSelect: (f: File) => void;
    onClear: () => void;
    existingUrl?: string | null;
}) {
    const [dragging, setDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(existingUrl || null);

    const handleSelect = (f: File) => {
        setPreview(URL.createObjectURL(f));
        onSelect(f);
    };
    const handleClear = () => {
        setPreview(null);
        onClear();
    };

    return (
        <div
            className={`relative rounded-[32px] bg-[#F6F8FC] transition-all cursor-pointer overflow-hidden
        ${dragging ? "border-[#A0522D]" : "border-[#D1D5DB]"}
        ${file || preview ? "border-transparent" : "bg-[#F6F8FC]"}
      `}
            style={{ minHeight: 200 }}
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files[0];
                if (f?.type.startsWith("image/")) handleSelect(f);
            }}
            onClick={() =>
                !file &&
                !preview &&
                document.getElementById("edit-bundle-cover")?.click()
            }
        >
            {preview ? (
                <>
                    <Image
                        src={preview}
                        alt="cover preview"
                        fill
                        className="object-cover"
                    />
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClear();
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white"
                    >
                        <X className="w-3.5 h-3.5 text-[#6B7280]" />
                    </Button>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                    <Image
                        className="mb-3"
                        src={camera}
                        width={24}
                        height={24}
                        alt="camera"
                    />
                    <p className="text-[#5D6481] text-sm">
                        Drag and drop an image, or{" "}
                        <span className="font-bold text-[#19213D]">Browse</span>
                    </p>
                </div>
            )}
            <Input
                id="edit-bundle-cover"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleSelect(f);
                }}
            />
        </div>
    );
}

/* ─── Dropdown ───────────────────────────────────────────── */
function Dropdown({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { id: string; label: string }[];
    placeholder: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find((o) => o.id === value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] cursor-pointer flex items-center justify-between"
            >
                <span className={`truncate ${!selected ? "text-[#9CA3AF]" : ""}`}>
                    {selected?.label ?? placeholder}
                </span>
                <ChevronDown
                    className={`text-[#9CA3AF] transition-transform duration-200 w-4 h-4 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>
            {isOpen && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-3xl border border-[#EBEFF6] shadow-2xl max-h-60 overflow-auto">
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            className={`px-5 py-3 text-sm cursor-pointer transition-colors ${value === opt.id ? "bg-[#F6F8FC]" : "hover:bg-[#F6F8FC]"
                                }`}
                            onClick={() => {
                                onChange(opt.id);
                                setIsOpen(false);
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                    {options.length === 0 && (
                        <div className="px-5 py-3 text-sm text-[#9CA3AF]">
                            No options available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─── Main Edit Form ─────────────────────────────────────── */
interface EditBundleFormProps {
    bundleId: string;
}

export function EditBundleForm({ bundleId }: EditBundleFormProps) {
    const router = useRouter();
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [durationValue, setDurationValue] = useState(365);

    // Fetch bundle details
    const {
        data: bundle,
        isLoading: bundleLoading,
        isError,
    } = useQuery({
        queryKey: ["bundle", bundleId],
        queryFn: () => bundlesService.getById(bundleId),
    });

    // Fetch categories
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoriesService.getAll(),
    });
    const categories = categoriesData?.data ?? [];

    // Fetch price tiers
    const { data: priceTiersData } = useQuery({
        queryKey: ["price-tiers"],
        queryFn: () => priceTiersService.getAll({ page: 1, limit: 50 }),
    });
    const priceTiers = priceTiersData?.data?.data ?? [];

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors },
    } = useForm<BundleFormData>({
        resolver: zodResolver(bundleSchema),
        defaultValues: {
            title: "",
            description: "",
            categoryId: "",
            priceTierId: "",
            durationDays: 365,
            isActive: true,
        },
    });

    // Pre-fill form when bundle data loads
    useEffect(() => {
        if (!bundle) return;
        reset({
            title: bundle.title,
            description: bundle.description ?? "",
            categoryId: bundle.categoryId,
            priceTierId: bundle.priceTierId,
            durationDays: bundle.durationDays ?? 365,
            isActive: bundle.isActive ?? true,
        });
        setDurationValue(bundle.durationDays ?? 365);
    }, [bundle, reset]);

    // Update mutation
    const { mutate: updateBundle, isPending } = useMutation({
        mutationFn: (data: BundleFormData) =>
            bundlesService.update(bundleId, {
                title: data.title,
                description: data.description,
                categoryId: data.categoryId,
                priceTierId: data.priceTierId,
                durationDays: data.durationDays,
                isActive: data.isActive,
                cover: coverFile,
            }),
        onSuccess: () => {
            toast.success("Book set updated successfully!");
            router.push("/dashboard/book-sets");
        },
        onError: () => toast.error("Failed to update book set."),
    });

    // Extract current book IDs from bundleBooks array
    const currentBookIds: string[] = bundle?.bundleBooks
        ? bundle.bundleBooks.map((bb) => bb.bookId)
        : [];

    // Loading state
    if (bundleLoading) {
        return (
            <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-3 text-[#6B7280]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading book set...</span>
                </div>
            </div>
        );
    }

    if (isError || !bundle) {
        return (
            <div className="p-4 sm:p-6">
                <div className="bg-white rounded-2xl p-12 text-center text-[#6B7280]">
                    Failed to load book set. Please go back and try again.
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-y-3">
                <h1 className="text-[#19213D] text-xl sm:text-[24px] font-medium w-full sm:w-auto">
                    Edit book set
                </h1>
                <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                    <Button
                        type="button"
                        onClick={() => router.back()}
                        variant="outline"
                        className="h-11 px-6 rounded-[12px] bg-[#EBEFF6] border border-[#E5E7EB] text-[#9D4A2F] text-[14px] hover:bg-[#F4F4F7]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="edit-bundle-form"
                        disabled={isPending}
                        className="h-11 px-6 text-[14px] rounded-[12px] bg-[#A0522D] text-white font-medium hover:bg-[#8B4513] disabled:opacity-60"
                    >
                        {isPending ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            <form id="edit-bundle-form" onSubmit={handleSubmit((d) => updateBundle(d))}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
                    {/* LEFT COLUMN */}
                    <div className="space-y-5">
                        {/* Set Details */}
                        <div className="bg-white rounded-[32px] p-5 space-y-5 border-[1.5px] border-[#EBEFF6]">
                            <h2 className="text-[#19213D] font-semibold text-[24px]">
                                Book Set Details
                            </h2>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-[#19213D] mb-2.5">
                                    Book Set Name
                                </label>
                                <input
                                    {...register("title")}
                                    placeholder="Label"
                                    className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-[#19213D] mb-2.5">
                                    Description
                                </label>
                                <textarea
                                    {...register("description")}
                                    rows={7}
                                    placeholder="Book set description..."
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all resize-none"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Books Management */}
                        <BundleBooksSection
                            bundleId={bundleId}
                            currentBookIds={currentBookIds}
                        />
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-3">
                        {/* Price Tier */}
                        <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
                            <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">
                                Price
                            </h2>
                            <label className="block text-sm text-[#19213D] font-semibold mb-1.5">
                                Price Tier
                            </label>
                            <Controller
                                control={control}
                                name="priceTierId"
                                render={({ field: { onChange, value } }) => (
                                    <Dropdown
                                        value={value}
                                        onChange={(v) => {
                                            onChange(v);
                                            setValue("priceTierId", v);
                                        }}
                                        options={priceTiers.map((t) => ({
                                            id: t.id,
                                            label: `${t.displayName} ($${(t.priceCents / 100).toFixed(0)})`,
                                        }))}
                                        placeholder="Select a price tier"
                                    />
                                )}
                            />
                            {errors.priceTierId && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.priceTierId.message}
                                </p>
                            )}
                        </div>

                        {/* Images */}
                        <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
                            <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">
                                Images
                            </h2>
                            <CoverUpload
                                file={coverFile}
                                onSelect={setCoverFile}
                                onClear={() => setCoverFile(null)}
                                existingUrl={bundle.coverImageUrl}
                            />
                        </div>

                        {/* Category */}
                        <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
                            <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">
                                Category
                            </h2>
                            <Controller
                                control={control}
                                name="categoryId"
                                render={({ field: { onChange, value } }) => (
                                    <Dropdown
                                        value={value}
                                        onChange={(v) => {
                                            onChange(v);
                                            setValue("categoryId", v);
                                        }}
                                        options={categories.map((c) => ({
                                            id: c.id,
                                            label: c.name,
                                        }))}
                                        placeholder="Select a category"
                                    />
                                )}
                            />
                            {errors.categoryId && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.categoryId.message}
                                </p>
                            )}
                        </div>

                        {/* Duration */}
                        <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
                            <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">
                                Duration
                            </h2>
                            <label className="block text-sm text-[#19213D] font-semibold mb-1.5">
                                Duration (days)
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={durationValue}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value) || 365;
                                    setDurationValue(v);
                                    setValue("durationDays", v);
                                }}
                                className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                            />
                        </div>

                        {/* Active Toggle */}
                        <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[#19213D] font-semibold text-[20px]">
                                    Status
                                </h2>
                                <Controller
                                    control={control}
                                    name="isActive"
                                    render={({ field: { onChange, value } }) => (
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={value ?? true}
                                                onChange={(e) => onChange(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A0522D]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A0522D]" />
                                        </label>
                                    )}
                                />
                            </div>
                            <p className="text-[#9CA3AF] text-xs mt-2">
                                {bundle.isActive
                                    ? "This book set is currently active and visible to users"
                                    : "This book set is currently inactive"}
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}