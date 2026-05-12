import Image from "next/image";
import logo from "../../../public/images/logo.svg";

export function LoginHeader() {
    return (
        <div className="p-6 sm:p-10 pb-5 sm:pb-7 border-b border-[#F0EEF0]">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center">
                    <Image src={logo} width={62} height={62} alt="logo" priority />
                </div>
                <div>
                    <span
                        className="font-bold text-2xl text-[#1C1C2E] tracking-wide"
                        style={{ fontFamily: "Playfair Display, serif" }}
                    >
                        EDUBA
                    </span>
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-wider">
                        Admin Portal
                    </p>
                </div>
            </div>

            <h1
                className="text-[#1C1C2E] text-2xl sm:text-3xl font-bold mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
            >
                Welcome back
            </h1>
            <p className="text-[#6B7280] text-sm">Sign in to your admin account</p>
        </div>
    );
}