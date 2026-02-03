import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 如果未登入且訪問非登入頁面 -> 跳轉到 /login
  if (!session && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 如果已登入且訪問登入頁面 -> 跳轉到首頁
  if (session && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
