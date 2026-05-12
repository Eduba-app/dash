"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { booksService } from "@/services/books.services";
import { categoriesService } from "@/services/categories.services";
import { CoverUpload } from "./CoverUpload";
import { FileUpload } from "./FileUpload";
import { BookDetailsSection } from "./BookDetailsSection";
import { CategorySelector } from "./CategorySelector";
import { PriceInput } from "./PriceInput";
import { FreeCardsInput } from "./FreeCardsInput";
import upload from "../../../public/icons/folder-upload 1.svg";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  priceUSD: z.number().min(0, "Price must be 0 or more"),
  freeTrialCardCount: z.number().min(0).optional(),
});

type BookForm = z.infer<typeof bookSchema>;

export function AddBookForm() {
  const router = useRouter();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [apkgFile, setApkgFile] = useState<File | null>(null);
  const [priceValue, setPriceValue] = useState(0);
  const [freeCardsValue, setFreeCardsValue] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      priceUSD: 0,
      freeTrialCardCount: 0,
      categoryId: "",
    },
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
    if (!coverFile) {
      toast.error("Please upload a cover image");
      return;
    }
    if (!apkgFile) {
      toast.error("Please upload an APKG file");
      return;
    }
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
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-y-3">
        <h1 className="text-[#19213D] text-xl sm:text-[24px] font-medium w-full sm:w-auto">
          Add book
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
            form="book-form"
            disabled={isPending}
            className="h-11 px-6 w-37.5 text-[14px] rounded-[12px] bg-[#A0522D] text-white font-medium hover:bg-[#8B4513] disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <form id="book-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
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

            {/* Book Details */}
            <BookDetailsSection register={register} errors={errors} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-3">
            {/* Price */}
            <PriceInput
              value={priceValue}
              onChange={setPriceValue}
              setValue={setValue}
            />

            {/* APKG Upload */}
            <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
              <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">
                Upload APKG
              </h2>
              <FileUpload
                accept=".apkg"
                file={apkgFile}
                onSelect={setApkgFile}
                onClear={() => setApkgFile(null)}
                icon={
                  <Image src={upload} width={24} height={24} alt="upload" />
                }
                label="apkg"
              />
            </div>

            {/* Category */}
            <CategorySelector
              control={control}
              setValue={setValue}
              errors={errors}
              categories={categories}
            />

            {/* Free Cards */}
            <FreeCardsInput
              value={freeCardsValue}
              onChange={setFreeCardsValue}
              setValue={setValue}
            />
          </div>
        </div>
      </form>
    </div>
  );
}