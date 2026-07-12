"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bundlesService } from "@/services/bundles.services";
import { categoriesService } from "@/services/categories.services";
import { priceTiersService } from "@/services/price-tiers.services";
import { booksService } from "@/services/books.services";
import { Book } from "@/types/book";
import camera from "../../../../../../public/icons/camera 1.svg";
import { PriceTierDropdown } from "@/components/price-tiers/PriceTierDropdown";

const bundleSchema = z.object({
    title: z.string().min(1, "Book set name is required"),
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().min(1, "Category is required"),
    priceTierId: z.string().min(1, "Price tier is required"),
});

type BundleForm = z.infer<typeof bundleSchema>;

/*  Cover Upload (inline)  */
function CoverUpload({
    file,
    onSelect,
    onClear,
}: {
    file: File | null;
    onSelect: (f: File) => void;
    onClear: () => void;
}) {
    const [dragging, setDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

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
        ${file ? "border-transparent" : "bg-[#F6F8FC]"}
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
                !file && document.getElementById("bundle-cover-input")?.click()
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
                id="bundle-cover-input"
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

/*  Custom Dropdown  */
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
                    className={`text-[#9CA3AF] transition-transform duration-200 w-4 h-4 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            {isOpen && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-3xl border border-[#EBEFF6] shadow-2xl max-h-60 overflow-auto">
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            className={`px-5 py-3 text-sm cursor-pointer transition-colors ${value === opt.id ? "bg-[#F6F8FC]" : "hover:bg-[#F6F8FC]"}`}
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

/* ─── Books Picker ───────────────────────────────────────── */
function BooksPicker({
    selectedIds,
    onToggle,
    books,
    isLoading,
}: {
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
    books: Book[];
    isLoading: boolean;
}) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return books;
        return books.filter(
            (b) =>
                b.title.toLowerCase().includes(q) ||
                b.category?.name?.toLowerCase().includes(q)
        );
    }, [books, search]);

    return (
        <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#19213D] font-semibold text-[24px]">Books</h2>
                <span className="text-[#9CA3AF] text-sm">
                    {selectedIds.size} selected
                </span>
            </div>

            {!isLoading && books.length > 0 && (
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search books..."
                    className="w-full h-10 px-4 mb-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                />
            )}

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                            <div className="w-5 h-5 bg-[#F4F4F7] rounded" />
                            <div className="w-10 h-12 bg-[#F4F4F7] rounded-lg" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-4 bg-[#F4F4F7] rounded w-32" />
                                <div className="h-3 bg-[#F4F4F7] rounded w-48" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : books.length === 0 ? (
                <p className="text-[#9CA3AF] text-sm py-6 text-center">
                    No books available. Add some books first.
                </p>
            ) : filtered.length === 0 ? (
                <p className="text-[#9CA3AF] text-sm py-6 text-center">
                    No books match &quot;{search}&quot;
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-[28px_1fr_100px_80px] gap-3 px-3 py-2 border-b border-[#F4F4F7]">
                        <span />
                        <span className="text-[#6B7280] text-xs">Book name</span>
                        <span className="text-[#6B7280] text-xs hidden sm:block">Category</span>
                        <span className="text-[#6B7280] text-xs hidden sm:block">Decks</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {filtered.map((book) => {
                            const isSelected = selectedIds.has(book.id);
                            return (
                                <div
                                    key={book.id}
                                    onClick={() => onToggle(book.id)}
                                    className={`grid grid-cols-[28px_1fr_100px_80px] gap-3 items-center px-3 py-3 border-b border-[#F4F4F7] last:border-0 cursor-pointer transition-colors ${isSelected ? "bg-[#A0522D]/5" : "hover:bg-[#FAFAFA]"}`}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-[#A0522D] border-[#A0522D]" : "border-[#D1D5DB] bg-white"}`}>
                                        {isSelected && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-[#F4F4F7] shrink-0">
                                            {book.coverImageUrl ? (
                                                <Image src={book.coverImageUrl} alt={book.title} width={40} height={48} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-[#E5E7EB]" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[#1C1C2E] text-sm font-medium truncate">{book.title}</p>
                                            <p className="text-[#9CA3AF] text-xs truncate">{book.description}</p>
                                        </div>
                                    </div>
                                    <span className="text-[#1C1C2E] text-sm hidden sm:block truncate">{book.category?.name ?? "—"}</span>
                                    <span className="text-[#1C1C2E] text-sm hidden sm:block">{book.deckCount ?? "—"}</span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

/* ─── Main Form ──────────────────────────────────────────── */
export function AddBundleForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());

    const {
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<BundleForm>({
        resolver: zodResolver(bundleSchema),
        defaultValues: {
            title: "",
            description: "",
            categoryId: "",
            priceTierId: "",
        },
    });

    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoriesService.getAll({ page: 1, limit: 100 }),
    });
    const categories = (categoriesData?.data ?? []).filter((c) => c.isActive);

    const { data: priceTiersData } = useQuery({
        queryKey: ["price-tiers"],
        queryFn: () => priceTiersService.getAll({ page: 1, limit: 50 }),
    });
    const priceTiers = priceTiersData?.data?.data ?? [];

    const { data: booksData, isLoading: booksLoading } = useQuery({
        queryKey: ["books-for-bundle"],
        queryFn: () => booksService.getAll({ page: 1, limit: 100 }),
    });
    const allBooks: Book[] = booksData?.data?.data ?? [];

    const { mutate: createBundle, isPending } = useMutation({
        mutationFn: (data: BundleForm) =>
            bundlesService.create({
                title: data.title,
                description: data.description,
                categoryId: data.categoryId,
                priceTierId: data.priceTierId,
                bookIds: Array.from(selectedBookIds),
                cover: coverFile ?? undefined,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bundles"] });
            toast.success("Book set created successfully!");
            router.push("/dashboard/book-sets");
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })
                ?.response?.data?.message;
            toast.error(msg ?? "Failed to create book set. Please try again.");
        },
    });

    const toggleBook = (bookId: string) => {
        setSelectedBookIds((prev) => {
            const next = new Set(prev);
            if (next.has(bookId)) next.delete(bookId);
            else next.add(bookId);
            return next;
        });
    };

    const onSubmit = (data: BundleForm) => {
        if (selectedBookIds.size === 0) {
            toast.error("Please select at least one book");
            return;
        }
        createBundle(data);
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-y-3">
                <h1 className="text-[#19213D] text-xl sm:text-[24px] font-medium w-full sm:w-auto">
                    Add book set
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
                        form="bundle-form"
                        disabled={isPending}
                        className="h-11 px-6 text-[14px] rounded-[12px] bg-[#A0522D] text-white font-medium hover:bg-[#8B4513] disabled:opacity-60"
                    >
                        {isPending ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            <form id="bundle-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
                    {/* LEFT COLUMN */}
                    <div className="space-y-5">
                        {/* Set Details */}
                        <div className="bg-white rounded-[32px] p-5 space-y-5 border-[1.5px] border-[#EBEFF6]">
                            <h2 className="text-[#19213D] font-semibold text-[24px]">
                                Set details
                            </h2>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-[#19213D] mb-2.5">
                                    Book Set Name
                                </label>
                                <Controller
                                    control={control}
                                    name="title"
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            placeholder="Label"
                                            className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                                        />
                                    )}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-[#19213D] mb-2.5">
                                    Description
                                </label>
                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            rows={5}
                                            placeholder="Book set description..."
                                            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all resize-none"
                                        />
                                    )}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Books Picker */}
                        <BooksPicker
                            selectedIds={selectedBookIds}
                            onToggle={toggleBook}
                            books={allBooks}
                            isLoading={booksLoading}
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
                                    <PriceTierDropdown
                                        value={value}
                                        onChange={(v) => { onChange(v); setValue("priceTierId", v); }}
                                        priceTiers={priceTiers}
                                    />
                                )}
                            />
                            {errors.priceTierId && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.priceTierId.message}
                                </p>
                            )}
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

                        {/* Cover Image */}
                        <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
                            <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">
                                Images
                            </h2>
                            <CoverUpload
                                file={coverFile}
                                onSelect={setCoverFile}
                                onClear={() => setCoverFile(null)}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
