export interface Notification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, string>;
}

export interface NotificationsHistoryResponse {
  status: string;
  data: {
    data: Notification[];
    meta: {
      page: number;
      limit: number;
      total: number;
      pagesCount: number;
    };
  };
}

export interface UnreadCountResponse {
  status: string;
  data: {
    count: number;
  };
}