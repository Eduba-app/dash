import api from "@/lib/api/axios";
import { NotificationsHistoryResponse, UnreadCountResponse } from "@/types/notification";

export const notificationsService = {
  // GET /notifications/history
  getHistory: async (page = 1, limit = 10): Promise<NotificationsHistoryResponse> => {
    const { data } = await api.get("/notifications/history", {
      params: { page, limit },
    });
    return data;
  },

  // GET /notifications/unread-count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const { data } = await api.get("/notifications/unread-count");
    return data;
  },

  // PUT /notifications/read/:id
  markAsRead: async (notificationId: string): Promise<void> => {
    await api.put(`/notifications/read/${notificationId}`);
  },

  // PUT /notifications/read-all
  markAllAsRead: async (): Promise<void> => {
    await api.put("/notifications/read-all");
  },

  // DELETE /notifications/cleanup (Admin only)
  cleanup: async (days: number): Promise<void> => {
    await api.delete("/notifications/cleanup", {
      params: { days },
    });
  },
};