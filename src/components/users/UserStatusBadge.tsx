import { UserStatus } from "@/types/user";

interface UserStatusBadgeProps {
    status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
    const styles: Record<UserStatus, string> = {
        ACTIVE: "bg-green-100 text-green-700",
        PENDING_VERIFICATION: "bg-yellow-100 text-yellow-700",
        DEACTIVATED: "bg-red-100 text-red-700",
    };

    const labels: Record<UserStatus, string> = {
        ACTIVE: "Active",
        PENDING_VERIFICATION: "Pending",
        DEACTIVATED: "Deactivated",
    };

    return (
        <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${styles[status]}`}
        >
            {labels[status]}
        </span>
    );
}