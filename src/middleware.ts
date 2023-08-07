import { NextResponse } from "next/server"
import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/signin(.*)",
    "/signup(.*)",
    "/sso-callback(.*)",
    "/products(.*)",
    "/categories(.*)",
  ],
  afterAuth: (auth, req) => {
    if (auth.isPublicRoute) {
      return NextResponse.next()
    }

    const url = new URL(req.nextUrl.origin)

    if (!auth.userId) {
      // if user is on protected page then redirect them to signin page
      url.pathname = "/signin"
      return NextResponse.redirect(url)
    }
  },
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}

// TODO: For some reason after updating nextjs middleware size shotup from 166kb to 180kb
