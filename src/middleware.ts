import { NextResponse } from "next/server"
import { authMiddleware, clerkClient } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/signin(.*)", "/signup(.*)", "/sso-callback(.*)"],
  apiRoutes: [],
  afterAuth: async (auth, req) => {
    if (auth.isPublicRoute) {
      return NextResponse.next()
    }

    const url = new URL(req.nextUrl.origin)

    if (!auth.userId) {
      // if user is on protected page then redirect them to signin page
      url.pathname = "/signin"
      return NextResponse.redirect(url)
    }

    const user = await clerkClient.users.getUser(auth.userId)

    if (!user) {
      throw new Error("User not found")
    }

    if (!user.privateMetadata.role) {
      await clerkClient.users.updateUserMetadata(auth.userId, {
        privateMetadata: {
          role: "user",
        },
      })
    }
  },
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}

//   TODO: Set private api routes
