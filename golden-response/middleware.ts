import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("mock_interview_token")?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/interview/:path*"]
};
