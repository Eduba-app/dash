// api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://demo.edubacards.com";
const MAX_AGE  = 60 * 60 * 24 * 30; // 30 days

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const res = await fetch(`${API_BASE}/auth/login`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "x-device-uuid": "admin-panel",
      },
      body: JSON.stringify({ email, password, deviceUuid: "admin-panel" }),
    });

    const data = await res.json();

    if (!res.ok || data?.status !== "success") {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const { accessToken, user } = data.data;
    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json({
      user: {
        id:        user.id,
        name:      user.fullName,
        email:     user.email,
        role:      user.role,
        avatarUrl: user.avatarUrl,
      },
    });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure:   isProduction,
      sameSite: "lax",
      maxAge:   MAX_AGE,
      path:     "/",
    });

    response.cookies.set("access_token_readable", accessToken, {
      httpOnly: false,
      secure:   isProduction,
      sameSite: "lax",
      maxAge:   MAX_AGE,
      path:     "/",
    });

    response.cookies.set("user_info", JSON.stringify({
      id:    user.id,
      name:  user.fullName,
      email: user.email,
      role:  user.role,
    }), {
      httpOnly: false,
      secure:   isProduction,
      sameSite: "lax",
      maxAge:   MAX_AGE,
      path:     "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}