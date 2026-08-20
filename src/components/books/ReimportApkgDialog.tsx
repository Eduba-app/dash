"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { booksService } from "@/services/books.services";
import { Book } from "@/types/book";
import { FileUpload } from "./FileUpload";
import { ImportBadge } from "./ImportBadge";
import upload from "../../../public/icons/folder-upload 1.svg";

interface ReimportApkgDialogProps {
  book: Book;
  onClose: () => void;
}

export function ReimportApkgDialog({ book, onClose }: ReimportApkgDialogProps) {
  const queryClient = useQueryClient();
  const [apkgFile, setApkgFile] = useState<File | null>(null);

  const { mutate: reimport, isPending } = useMutation({
    mutationFn: (file: File) => booksService.reimportApkg(book.id, file),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success(`APKG reimport started. Status: ${res.importStatus}`);
      onClose();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to reimport APKG")),
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-[#19213D] text-[18px] font-semibold mb-1.5">
          Reimport APKG
        </h2>
        <p className="text-[#6B7280] text-sm mb-4">
          Upload a new APKG file for &ldquo;{book.title}&rdquo;. This replaces the book&apos;s
          decks and cards and runs asynchronously. Current status:{" "}
          <ImportBadge status={book.importStatus} />
        </p>

        <FileUpload
          accept=".apkg"
          file={apkgFile}
          onSelect={setApkgFile}
          onClear={() => setApkgFile(null)}
          icon={<Image src={upload} width={24} height={24} alt="upload" />}
          label="apkg"
        />

        <div className="flex gap-3 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 cursor-pointer text-sm font-medium transition-colors rounded-[12px] bg-[#EBEFF6] border border-[#E5E7EB] text-[#9D4A2F] hover:bg-[#F4F4F7]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending || !apkgFile}
            onClick={() => apkgFile && reimport(apkgFile)}
            className="flex-1 h-11 cursor-pointer text-sm transition-colors disabled:opacity-60 rounded-[12px] bg-[#A0522D] text-white font-medium hover:bg-[#8B4513]"
          >
            {isPending ? "Uploading..." : "Reimport"}
          </button>
        </div>
      </div>
    </div>
  );
}
