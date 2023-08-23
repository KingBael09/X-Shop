import type { Metadata } from "next"
import { ResetPasswordStep2Form } from "@/forms/reset-password-form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"

export const metadata: Metadata = {
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
