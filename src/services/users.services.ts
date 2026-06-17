import api from "@/lib/api/axios";
import { User, UsersResponse, GetUsersParams } from "@/types/user";

export const usersService = {
  // GET /admin/users — List students (paginated)
  getAll: async (params?: GetUsersParams): Promise<UsersResponse> => {
    const { data } = await api.get("/admin/users", {
      params: {
        page:   params?.page   ?? 1,
        limit:  params?.limit  ?? 20,
        ...(params?.status ? { status: params.status } : {}),
        ...(params?.q      ? { q: params.q }           : {}),
      },
    });
    return data;
  },

  // GET /admin/users/:id
  getById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/admin/users/${id}`);
    return data?.data ?? data;
  },

  // POST /admin/users/:id/deactivate
  // Sets status to DEACTIVATED (cannot log in)
  deactivate: async (id: string): Promise<void> => {
    await api.post(`/admin/users/${id}/deactivate`);
  },

  // DELETE /admin/users/:id
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};