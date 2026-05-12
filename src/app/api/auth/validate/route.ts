// app/api/auth/validate/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://demo.edubacards.com";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    // Try to fetch user profile to validate token
    const res = await fetch(`${API_BASE}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-device-uuid": "admin-panel",
      },
    });

    if (!res.ok) {
      // Token is invalid - clear cookies
      const response = NextResponse.json({ valid: false }, { status: 401 });
      const clearOpts = { maxAge: 0, path: "/" };
      response.cookies.set("access_token", "", clearOpts);
      response.cookies.set("access_token_readable", "", clearOpts);
      response.cookies.set("user_info", "", clearOpts);
      return response;
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}