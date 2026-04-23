import api from "@/lib/api/axios";
import { UserProfile } from "@/types/profile";

export const profileService = {
  // GET /user/profile
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await api.get("/user/profile");
    return data?.data || data;
  },

  // PATCH /user/profile (multipart/form-data)
  updateProfile: async (formData: FormData): Promise<UserProfile> => {
    const { data } = await api.patch("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data?.data || data;
  },
};