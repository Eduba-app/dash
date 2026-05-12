import { ImportStatus } from "@/types/book";

interface ImportBadgeProps {
    status: ImportStatus;
}

export function ImportBadge({ status }: ImportBadgeProps) {
    const styles: Record<ImportStatus, string> = {
        PENDING: "bg-yellow-100 text-yellow-700",
        PROCESSING: "bg-blue-100 text-blue-700",
        READY: "bg-green-100 text-green-700",
        FAILED: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status]}`}
        >
            {status}
        </span>
    );
}