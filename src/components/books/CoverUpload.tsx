import { X } from "lucide-react";
import Image from "next/image";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import camera from "../../../public/icons/camera 1.svg";

interface CoverUploadProps {
    file: File | null;
    onSelect: (file: File) => void;
    onClear: () => void;
}

export function CoverUpload({ file, onSelect, onClear }: CoverUploadProps) {
    const [dragging, setDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleSelect = useCallback(
        (f: File) => {
            setPreview(URL.createObjectURL(f));
            onSelect(f);
        },
        [onSelect]
    );

    const handleClear = useCallback(() => {
        setPreview(null);
        onClear();
    }, [onClear]);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f?.type.startsWith("image/")) {
                handleSelect(f);
            }
        },
        [handleSelect]
    );

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
            onDrop={handleDrop}
            onClick={() => !file && document.getElementById("cover-input")?.click()}
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