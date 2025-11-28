import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function proxyRequest(request: NextRequest, endpoint: string) {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const backendUrl = process.env.API_URL || "http://localhost:8000";
  const url = new URL(`${backendUrl}${endpoint}`);
  url.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Host", new URL(backendUrl).host);

  const response = await fetch(url.toString(), {
    method: request.method,
    headers,
    body: request.body,
    redirect: "manual",
  });

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });
}