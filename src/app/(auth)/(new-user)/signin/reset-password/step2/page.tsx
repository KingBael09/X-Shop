import { type Metadata } from "next"
import { env } from "@/env.mjs"
import { ResetPasswordStep2Form } from "@/forms/reset-password-form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Reset Password",
}

export default function ResetPasswordStep2Page() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription>
          Enter your email address and we will send you a verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordStep2Form />
      </CardContent>
    </Card>
  )
}
