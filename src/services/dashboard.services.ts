import api from "@/lib/api/axios";

export interface DashboardStats {
  activeStudents: number;
  activeSubscriptions: number;
  activeBooks: number;
  revenueThisMonthCents: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get("/admin/dashboard/stats");
    return data?.data ?? data;
  },
};
