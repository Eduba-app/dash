import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  const clearOpts = { maxAge: 0, path: "/" };
  response.cookies.set("access_token",          "", clearOpts);
  response.cookies.set("access_token_readable",  "", clearOpts);
  response.cookies.set("user_info",              "", clearOpts);

  return response;
}