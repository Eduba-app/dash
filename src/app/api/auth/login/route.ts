import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://demo.edubacards.com";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
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

    const response = NextResponse.json({
      user: {
        id:       user.id,
        name:     user.fullName,
        email:    user.email,
        role:     user.role,
        avatarUrl: user.avatarUrl,
      },
    });

    const cookieOpts = {
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge:   60 * 60 * 24 * 30,
      path:     "/",
    };

    // httpOnly — للـ middleware (الأمان)
    response.cookies.set("access_token", accessToken, {
      ...cookieOpts,
      httpOnly: true,
    });

    // readable — للـ axios (client-side API calls)
    response.cookies.set("access_token_readable", accessToken, {
      ...cookieOpts,
      httpOnly: false,
    });

    // user info — للـ UI
    response.cookies.set("user_info", JSON.stringify({
      id:    user.id,
      name:  user.fullName,
      email: user.email,
      role:  user.role,
    }), {
      ...cookieOpts,
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}