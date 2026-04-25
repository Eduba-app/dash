"use client";

import { Send } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="p-4 sm:p-6 pb-0">
      <h1 className="text-[#1C1C2E] text-2xl sm:text-[32px] font-bold mb-6">Notification</h1>

      <div className="bg-white rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#1C1C2E] font-bold text-base">
            Notification Center
          </h2>
          <span className="text-xs bg-[#FFF0EB] text-[#A0522D] font-medium px-3 py-1 rounded-full border border-[#F0C4A8]">
            Coming Soon
          </span>
        </div>

        {/* Form — disabled until API is ready */}
        <div className="space-y-5 opacity-50 pointer-events-none select-none">
          <div>
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
              Title
            </label>
            <input
              disabled
              placeholder="Notification title..."
              className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1C2E] mb-1.5">
              Notification
            </label>
            <textarea
              disabled
              rows={8}
              placeholder="Write your notification message..."
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none resize-none"
            />
          </div>
        </div>

        {/* Send Button */}
        <div className="flex justify-end mt-5">
          <button
            disabled
            className="flex items-center justify-center gap-2 h-11 w-full sm:w-auto px-6 rounded-xl bg-[#A0522D] text-white text-sm font-semibold opacity-40 cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}