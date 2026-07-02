"use client";

import { isAxiosError } from "axios";
import { Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationsService } from "@/services/notifications.services";

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data?.message;
    if (typeof msg === "string") return msg;
    if (Array.isArray(msg)) return msg.map((m: { property: string; constraints: Record<string, string> }) => Object.values(m.constraints).join(", ")).join(" | ");
  }
  return fallback;
}

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [days, setDays] = useState("");

  const broadcastMutation = useMutation({
    mutationFn: () => notificationsService.broadcast({ title, body }),
    onSuccess: () => {
      toast.success("Notification sent to all active users");
      setTitle("");
      setBody("");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Failed to send notification")),
  });

  const cleanupMutation = useMutation({
    mutationFn: () => notificationsService.cleanup(Number(days)),
    onSuccess: (data) => {
      toast.success(`Deleted ${data?.deleted ?? 0} old notification(s)`);
      setDays("");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Failed to delete old notifications")),
  });

  const canSend = title.trim().length > 0 && body.trim().length > 0;
  const canClean = Number(days) > 0;

  return (
    <div className="p-4 sm:p-6 pb-0 space-y-5">
      <h1 className="text-[#1C1C2E] text-2xl sm:text-[32px] font-bold">Notification</h1>

      {/* Broadcast Card */}
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-[#1C1C2E] font-bold text-base mb-6">
          Notification Center
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title..."
              className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
              Notification
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Write your notification message..."
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={() => broadcastMutation.mutate()}
            disabled={!canSend || broadcastMutation.isPending}
            className="flex items-center justify-center gap-2 h-11 w-full sm:w-auto px-6 rounded-xl bg-[#A0522D] text-white text-sm font-semibold hover:bg-[#8B4513] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {broadcastMutation.isPending ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </div>

      {/* Cleanup Card */}
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-[#1C1C2E] font-bold text-base mb-2">
          Cleanup Old Notifications
        </h2>
        <p className="text-[#6B7280] text-sm mb-6">
          Delete all notifications older than a specified number of days.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
              Days
            </label>
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="e.g. 30"
              className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
            />
          </div>

          <button
            onClick={() => cleanupMutation.mutate()}
            disabled={!canClean || cleanupMutation.isPending}
            className="flex items-center justify-center gap-2 h-11 w-full sm:w-auto px-6 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {cleanupMutation.isPending ? "Deleting..." : "Delete Old Notifications"}
          </button>
        </div>
      </div>
    </div>
  );
}
