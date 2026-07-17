import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // public routes that don't require authentication
  const isPublicPath =
    path === "/login" || path === "/signUp" || path === "/recover";

  // grab the session token from the cookies
  const sessionToken = request.cookies.get("session_id")?.value;

  // return logged in users to the home page if they try to access a public route
  if (isPublicPath && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // return unauthenticated users to the login page if they try to access a protected route
  if (!isPublicPath && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };
