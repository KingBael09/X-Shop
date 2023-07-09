import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { OAuthSignIn } from "@/components/auth/oauth-signin"
import { SignUpForm } from "@/components/forms/sign-up-form"

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign up</CardTitle>
        <CardDescription>Choose your preferred sign up method</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <OAuthSignIn />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            aria-label="Sign in"
            href="/signin"
            className={cn(buttonVariants({ variant: "link" }), "p-0")}
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
