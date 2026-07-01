import api from "@/lib/api/axios";

export const systemSettingsService = {
  getSetting: async (key: string): Promise<{ value: string }> => {
    const { data } = await api.get(`/system-settings/${key}`);
    return data?.data ?? data;
  },

  updateSetting: async (key: string, value: string, description?: string): Promise<void> => {
    await api.put(`/system-settings/${key}`, { value, description });
  },
};
