import { NextResponse } from "next/server"
import { authMiddleware } from "@clerk/nextjs"

const publicRoutes = [
  "/",
  "/signin(.*)",
  "/signup(.*)",
  "/sso-callback(.*)",
  "/products(.*)",
  "/stores(.*)",
  "/preview-product(.*)",
  "/categories(.*)",
  "/api(.*)",
]

export default authMiddleware({
  publicRoutes,
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

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// }

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
}

// TODO: For some reason after updating nextjs middleware size shotup from 166kb to 180kb
// TODO: WTF why did it increase again 180kb to 195kb -> wtf it shot up to 203 kb in v13.5.2
// Seems like there is some inconsistency in middleware size
