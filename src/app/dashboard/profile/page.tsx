"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { profileService } from "@/services/profile.services";
import { systemSettingsService } from "@/services/system-settings.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import logoutIcon from "../../../../public/icons/login.svg";
import pencilEdit from "../../../../public/icons/penEdit.svg";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
  });

  const { data: supportLinkData } = useQuery({
    queryKey: ["system-settings", "support-link"],
    queryFn: () => systemSettingsService.getSetting("support-link"),
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    supportLink: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSupport, setIsEditingSupport] = useState(false);

  const startEditingProfile = () => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
      }));
    }
    setIsEditingProfile(true);
  };

  const startEditingSupport = () => {
    setFormData((prev) => ({
      ...prev,
      supportLink: supportLinkData?.value || "",
    }));
    setIsEditingSupport(true);
  };

  const updateProfileMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditingProfile(false);
      toast.success("Profile updated successfully");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const updateSupportMutation = useMutation({
    mutationFn: (value: string) =>
      systemSettingsService.updateSetting("support-link", value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings", "support-link"] });
      setIsEditingSupport(false);
      toast.success("Support link updated successfully");
    },
    onError: () => toast.error("Failed to update support link"),
  });

  const handleSaveProfile = () => {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    updateProfileMutation.mutate(fd);
  };

  const handleSaveSupport = () => {
    updateSupportMutation.mutate(formData.supportLink);
  };

  if (isLoading || !profile) {
    return <div className="p-4 sm:p-6">Loading profile...</div>;
  }

  const currentSupportLink = supportLinkData?.value || "";

  return (
    <div className="p-4 sm:p-6 max-w-259.5 mx-auto">
      <h1 className="text-[#19213D] text-2xl sm:text-[32px] font-semibold mb-6 sm:mb-8">
        Profile
      </h1>

      {/* Profile Information Card */}
      <div className="bg-white rounded-[32px] shadow-sm border-1.5 border-[#EBEFF6] p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-[#19213D] text-[18px] font-medium">
            {isEditingProfile ? "Edit Profile information" : "Profile information"}
          </h2>

          {!isEditingProfile ? (
            <Button
              size="icon"
              onClick={startEditingProfile}
              className="text-white cursor-pointer bg-[#9D4A2F] hover:bg-[#e77751]"
            >
              <Image src={pencilEdit} width={12} height={12} alt="pencil edit" />
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditingProfile(false)}
                className="bg-[#EBEFF6] cursor-pointer text-[#9D4A2F] px-4 sm:px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
                className="bg-[#9D4A2F] cursor-pointer hover:bg-[#e77751] text-white px-4 sm:px-6"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">Name</label>
            <Input
              value={isEditingProfile ? formData.name : profile.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditingProfile}
              className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] outline-none focus:border-[#A0522D] disabled:bg-[#F9F9FB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">Email</label>
            <Input
              value={isEditingProfile ? formData.email : profile.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditingProfile}
              className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] outline-none focus:border-[#A0522D] disabled:bg-[#F9F9FB]"
            />
          </div>
        </div>
      </div>

      {/* Support Information Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#F4F4F7] p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-[#19213D] text-[18px] font-medium">Support Information</h2>

          {!isEditingSupport ? (
            <Button
              size="icon"
              onClick={startEditingSupport}
              className="text-white cursor-pointer bg-[#9D4A2F] hover:bg-[#e77751]"
            >
              <Image src={pencilEdit} width={12} height={12} alt="pencil edit" />
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditingSupport(false)}
                className="bg-[#EBEFF6] cursor-pointer text-[#9D4A2F] px-4 sm:px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveSupport}
                disabled={updateSupportMutation.isPending}
                className="bg-[#9D4A2F] cursor-pointer hover:bg-[#e77751] text-white px-4 sm:px-6"
              >
                {updateSupportMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#19213D] mb-1.5">
            Support Link
          </label>
          <Input
            placeholder="https://..."
            value={isEditingSupport ? formData.supportLink : currentSupportLink}
            onChange={(e) => setFormData({ ...formData, supportLink: e.target.value })}
            disabled={!isEditingSupport}
            className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] outline-none focus:border-[#A0522D] disabled:bg-[#F9F9FB]"
          />
        </div>
      </div>

      {/* Logout Button */}
      {!isEditingSupport && !isEditingProfile ? (
        <div className="flex justify-end">
          <Button
            onClick={logout}
            className="flex cursor-pointer items-center gap-2 px-6 h-11 bg-[#FF383C24] hover:bg-red-100 text-red-500 hover:text-red-600 border rounded-[12px] font-medium transition-colors"
            variant="ghost"
          >
            {/* <LogOut className="w-4 h-4" /> */}
            <Image src={logoutIcon} width={14} height={14} alt="logout buttons" />
            Logout
          </Button>
        </div>
      ) : null}
    </div>
  );
}