export type UserStatus = "ACTIVE" | "PENDING_VERIFICATION" | "DEACTIVATED";
export type UserRole = "STUDENT" | "ADMIN";

export interface User {
    id: string;
    email: string;
    phone: string | null;
    name: string;
    avatarUrl: string | null;
    status: UserStatus;
    role: UserRole;
    linkedDeviceId: string;
    createdAt: string;
    updatedAt: string;
    subscriptionCount: number;
}

export interface GetUsersParams {
    page?: number;
    limit?: number;
    status?: UserStatus;
    q?: string;
}

export interface UsersResponse {
    status: string;
    data: {
        data: User[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pagesCount: number;
        };
    };
}