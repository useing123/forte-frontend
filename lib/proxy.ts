import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function proxyRequest(request: NextRequest, endpoint: string) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = await getToken();

    console.log('[PROXY DEBUG] userId:', userId);
    console.log('[PROXY DEBUG] token exists:', !!token);
    console.log('[PROXY DEBUG] endpoint:', endpoint);

    const backendUrl = process.env.API_URL || "http://localhost:8080";
    const url = new URL(`${backendUrl}${endpoint}`);
    url.search = request.nextUrl.search;

    console.log('[PROXY DEBUG] calling backend:', url.toString());

    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Host", new URL(backendUrl).host);

    const response = await fetch(url.toString(), {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
      duplex: "half",
    } as RequestInit);

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers),
    });
  } catch (error) {
    console.error("Proxy request failed:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Proxy request failed",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}