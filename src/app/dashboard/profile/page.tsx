"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileService } from "@/services/profile.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import pencilEdit from "../../../../public/icons/penEdit.svg"
import Image from "next/image";

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
  });

  // Form state 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    supportLink: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSupport, setIsEditingSupport] = useState(false);

  // ─── Edit Function 
  const startEditingProfile = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        supportLink: profile.supportLink || "",
      });
    }
    setIsEditingProfile(true);
  };

  const startEditingSupport = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        supportLink: profile.supportLink || "",
      });
    }
    setIsEditingSupport(true);
  };

  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditingProfile(false);
      setIsEditingSupport(false);
      toast.success("Profile updated successfully");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  // ─── Handle Save 
  const handleSaveProfile = async () => {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    updateMutation.mutate(fd);
  };

  const handleSaveSupport = async () => {
    const fd = new FormData();
    fd.append("supportLink", formData.supportLink || "");
    updateMutation.mutate(fd);
  };

  if (isLoading || !profile) {
    return <div className="p-4 sm:p-6">Loading profile...</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-259.5 mx-auto">
      <h1 className="text-[#19213D] text-2xl sm:text-[32px] font-semibold mb-6 sm:mb-8">Profile</h1>

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
              className="text-[#A0522D] bg-[#9D4A2F] hover:bg-[#e77751]"
            >
              {/* <Pencil className="w-5 h-5" /> */}
              <Image src={pencilEdit} width={12} height={12} alt="pencil edit"/>
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditingProfile(false)}
                className="bg-[#EBEFF6] text-[#9D4A2F] px-4 sm:px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={updateMutation.isPending}
                className="bg-[#9D4A2F] hover:bg-[#e77751] text-white px-4 sm:px-6"
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
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
      <div className="bg-white rounded-3xl shadow-sm border border-[#F4F4F7] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-[#19213D] text-[18px] font-medium">Support Information</h2>

          {!isEditingSupport ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={startEditingSupport}          
              className="text-[#A0522D] bg-[#9D4A2F] hover:bg-[#e77751]"
            >
              {/* <Pencil className="w-5 h-5" /> */}
              <Image src={pencilEdit} width={12} height={12} alt="pencil edit"/>
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditingSupport(false)}
                className="bg-[#EBEFF6] text-[#9D4A2F] px-4 sm:px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveSupport}
                disabled={updateMutation.isPending}
                className="bg-[#9D4A2F] hover:bg-[#e77751] text-white px-4 sm:px-6"
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#19213D] mb-1.5">Support Link</label>
          <Input
          placeholder="dsadasdasdas"
            value={isEditingSupport ? formData.supportLink : profile.supportLink || ""}
            onChange={(e) => setFormData({ ...formData, supportLink: e.target.value })}
            disabled={!isEditingSupport}
            className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] outline-none focus:border-[#A0522D] disabled:bg-[#F9F9FB]"
          />
        </div>
      </div>
    </div>
  );
}