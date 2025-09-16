import { BACKEND_URL, API_KEY } from "@/lib/environment/environment";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function proxy(req: NextRequest, params: { path?: string[] }) {
  const subPath = (params.path ?? []).join("/");
  const url = new URL(req.url);

  const target = `${BACKEND_URL.replace(/\/$/, "")}/api/${subPath}${
    url.search
  }`;

  const forwardHeaders = new Headers();
  req.headers.forEach((v, k) => {
    if (
      ["host", "content-length", "connection", "accept-encoding"].includes(
        k.toLowerCase()
      )
    )
      return;
    forwardHeaders.set(k, v);
  });
  if (API_KEY) forwardHeaders.set("x-api-key", API_KEY);

  const method = req.method;
  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  const resp = await fetch(target, {
    method,
    headers: forwardHeaders,
    body,
    cache: "no-store",
  });

  const data = await resp.json();

  const safeHeaders = new Headers();
  safeHeaders.set("Content-Type", "application/json");

  return new NextResponse(JSON.stringify(data), {
    status: resp.status,
    headers: safeHeaders,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}
export async function POST(
  req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}
