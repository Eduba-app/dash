"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface SessionExpiredAlertProps {
    isExpired: boolean;
}

export function SessionExpiredAlert({ isExpired }: SessionExpiredAlertProps) {
    const [show, setShow] = useState(isExpired);

    useEffect(() => {
        if (!isExpired) return;

        // Auto-hide after 5 seconds
        const timer = setTimeout(() => setShow(false), 5000);
        return () => clearTimeout(timer);
    }, [isExpired]);

    if (!show) return null;

    return (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
                <p className="font-medium">Session Expired</p>
                <p className="text-xs text-amber-700 mt-1">
                    You were logged in from another device. Please sign in again.
                </p>
            </div>
        </div>
    );
}