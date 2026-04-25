"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { booksService } from "@/services/books.services";
import { categoriesService } from "@/services/categories.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronDown,  DollarSign, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import camera from "../../../../../public/icons/camera 1.svg";
import upload from "../../../../../public/icons/folder-upload 1.svg";
import { Controller } from "react-hook-form";
// ─── Schema 
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  priceUSD: z.number().min(0, "Price must be 0 or more"),
  freeTrialCardCount: z.number().min(0).optional(),
});
type BookForm = z.infer<typeof bookSchema>;

// ─── File Drop Zone
function FileDropZone({
  accept,
  file,
  onSelect,
  onClear,
  icon,
  label,
}: {
  accept: string;
  file: File | null;
  onSelect: (f: File) => void;
  onClear: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputId = `file-${label.replace(/\s/g, "-")}`;

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) onSelect(f);
    },
    [onSelect]
  );

  return (
    <div
      className={`relative rounded-[32px] transition-all cursor-pointer p-3
        ${dragging ? "border-[#A0522D] bg-[#A0522D]/5" : "border-[#D1D5DB] bg-[#F6F8FC]"}
        ${file ? "border-[#A0522D]/40 bg-[#A0522D]/5" : ""}
      `}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && document.getElementById(inputId)?.click()}
    >
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        {file ? (
          <>
            <div className="text-[#A0522D] mb-2">{icon}</div>
            <p className="text-[#1C1C2E] text-sm font-medium truncate max-w-full px-4">
              {file.name}
            </p>
            <p className="text-[#9CA3AF] text-xs mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </>
        ) : (
          <>
            <div className="text-[#9CA3AF] mb-3">{icon}</div>
            <p className="text-[#6B7280] text-sm">
              Drag and drop an APKG file, or{" "}
              <span className="font-bold text-[#1C1C2E]">Browse</span>
            </p>
          </>
        )}
      </div>

      {file && (
        <Button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="absolute top-2 right-2 w-7 h-7 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
        >
          <X className="w-3.5 h-3.5 text-[#6B7280]" />
        </Button>
      )}

      <Input
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
        }}
      />
    </div>
  );
}

// ─── Cover Drop Zone 
function CoverDropZone({
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
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f?.type.startsWith("image/")) handleSelect(f);
      }}
      onClick={() => !file && document.getElementById("cover-input")?.click()}
    >
      {preview ? (
        <>
          <Image src={preview} alt="cover preview" fill className="object-cover" />
          <Button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
          >
            <X className="w-3.5 h-3.5 text-[#6B7280]" />
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          {/* <Camera className="w-8 h-8 text-[#9CA3AF] mb-3" /> */}
          <Image className="mb-3" src={camera} width={24} height={24} alt="camera" />
          <p className="text-[#5D6481] text-sm">
            Drag and drop an images, or{" "}
            <span className="font-bold text-[#19213D]">Browse</span>
          </p>
        </div>
      )}
      <Input
        id="cover-input"
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

// ─── Main Page 
export default function AddBookPage() {
  const router = useRouter();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [apkgFile, setApkgFile] = useState<File | null>(null);
  const [priceValue, setPriceValue] = useState(0);
  const [freeCardsValue, setFreeCardsValue] = useState(0);
  const { control } = useForm();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
    defaultValues: { priceUSD: 0, freeTrialCardCount: 0 },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getAll(),
  });
  const categories = categoriesData?.data ?? [];
  const { mutate: createBook, isPending } = useMutation({
    mutationFn: booksService.create,
    onSuccess: (res) => {
      toast.success(`Book created! Status: ${res.importStatus}`);
      router.push("/dashboard/books");
    },
    onError: () => toast.error("Failed to create book. Please try again."),
  });

  const onSubmit = (data: BookForm) => {
    if (!coverFile) { toast.error("Please upload a cover image"); return; }
    if (!apkgFile) { toast.error("Please upload an APKG file"); return; }

    createBook({
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      priceCents: Math.round(data.priceUSD * 100),
      freeTrialCardCount: data.freeTrialCardCount,
      cover: coverFile,
      apkg: apkgFile,
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[#19213D] text-[24px] font-medium">Add book</h1>
        <div className="flex items-center gap-3">
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
            form="book-form"
            disabled={isPending}
            className="h-11 px-6 w-37.5 text-[14px] rounded-[12px] bg-[#A0522D] text-white font-medium hover:bg-[#8B4513] disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <form id="book-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-[1fr_380px] gap-5 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">
            {/* Cover */}
            <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6] ">
              <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">Images</h2>
              <CoverDropZone
                file={coverFile}
                onSelect={setCoverFile}
                onClear={() => setCoverFile(null)}
              />
            </div>

            {/* Book Details */}
            <div className="bg-white rounded-[32px] p-5 space-y-5.5 border-[1.5px] border-[#EBEFF6]">
              <h2 className="text-[#19213D] font-semibold text-[24px]">Book details</h2>

              <div>
                <label className="block text-sm font-medium text-[#19213D] mb-2.5">
                  Book Title
                </label>
                <input
                  {...register("title")}
                  placeholder="Label"
                  className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#19213D] mb-2.5">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={7}
                  placeholder="Book description..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-3">
            {/* Price */}
            <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
              <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">Price</h2>
              <label className="block text-sm text-[#19213D] font-semibold mb-1.5">
                Price (USD)
              </label>
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#FFF0EB] border border-[#F0C4A8] rounded-full flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-[#A0522D]" />
                </div>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={priceValue}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    setPriceValue(v);
                    setValue("priceUSD", v);
                  }}
                  className="w-full h-10 pl-10 pr-4 rounded-full border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                />
              </div>
            </div>

            {/* APKG Upload */}
            <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
              <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">Upload APKG</h2>
              <FileDropZone
                accept=".apkg"
                file={apkgFile}
                onSelect={setApkgFile}
                onClear={() => setApkgFile(null)}
                // icon={<Upload className="w-8 h-8" />}
                icon={<Image src={upload} width={24} height={24} alt="upload icons" />}
                label="apkg"
              />
            </div>

            {/* Category */}
            {/* <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
              <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">Category</h2>
              <select
                {...register("categoryId")}
                className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Label</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>
              )}
            </div> */}

            {/* Category */}
            <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6] relative">
              <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">Category</h2>

              <Controller
                control={control}
                name="categoryId"
                render={({ field: { onChange, value } }) => (
                  <div className="relative">
                    {/* Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">
                        {value
                          ? categories.find((cat) => cat.id === value)?.name
                          : "Label"}
                      </span>
                      <span
                        className={`text-[#9CA3AF] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                          }`}
                      >
                        <ChevronDown />
                      </span>
                    </button>

                    {/* Custom Dropdown*/}
                    {isOpen && (
                      <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-3xl border border-[#EBEFF6] shadow-2xl  max-h-70 overflow-auto">
                        {/* <div className="px-5 py-3 flex items-center justify-between border-b border-[#EBEFF6] text-sm text-[#6B7280]">
                          <span>Categories</span>
                          
                        </div> */}
                        {/* <span
                            className="cursor-pointer text-base leading-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(false);
                            }}
                          >
                            <ChevronUp />
                          </span> */}

                        {/*  Options */}
                        {categories.map((cat) => (
                          <div
                            key={cat.id}
                            className={`px-5 py-3 text-sm cursor-pointer transition-colors ${value === cat.id
                                ? "bg-[#F6F8FC]"
                                : "hover:bg-[#F6F8FC]"
                              }`}
                            onClick={() => {
                              onChange(cat.id);
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
                <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>
              )}
            </div>

            {/* Free Cards */}
            <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
              <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">Free Cards</h2>
              <input
                type="number"
                min={0}
                value={freeCardsValue}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;
                  setFreeCardsValue(v);
                  setValue("freeTrialCardCount", v);
                }}
                placeholder="0"
                className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}