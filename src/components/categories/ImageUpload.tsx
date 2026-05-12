"use client";

import { Camera, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  existingImageUrl?: string;
}

export function ImageUpload({ onChange, existingImageUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    existingImageUrl || null
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a JPEG, PNG, or WebP image");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onChange(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    onChange(null);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1C1C2E]">
        Category image{" "}
        <span className="text-[#9CA3AF] font-normal">(optional)</span>
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`relative rounded-2xl border-2 border-dashed transition-all ${
          isDragging
            ? "border-[#A0522D] bg-[#A0522D]/5"
            : "border-[#E5E7EB] bg-[#F9F9FB]"
        }`}
      >
        {preview ? (
          // Preview State
          <div className="relative aspect-video rounded-2xl overflow-hidden group">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                title="Remove image"
                className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-[#A0522D]" />
              </button>
            </div>
          </div>
        ) : (
          // Upload State
          <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3">
              <Camera className="w-6 h-6 text-[#6B7280]" />
            </div>
            <p className="text-[#1C1C2E] text-sm mb-1">
              Drag and drop an image, or{" "}
              <span className="text-[#A0522D] font-medium">Browse</span>
            </p>
            <p className="text-[#9CA3AF] text-xs">
              JPEG, PNG or WebP • Max 5MB
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}