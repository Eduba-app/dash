import { X } from "lucide-react";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    accept: string;
    file: File | null;
    onSelect: (file: File) => void;
    onClear: () => void;
    icon: React.ReactNode;
    label: string;
}

export function FileUpload({
    accept,
    file,
    onSelect,
    onClear,
    icon,
    label,
}: FileUploadProps) {
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
        ${dragging
                    ? "border-[#A0522D] bg-[#A0522D]/5"
                    : "border-[#D1D5DB] bg-[#F6F8FC]"
                }
        ${file ? "border-[#A0522D]/40 bg-[#A0522D]/5" : ""}
      `}
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
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
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear();
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center hover:bg-red-50 shadow-sm"
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