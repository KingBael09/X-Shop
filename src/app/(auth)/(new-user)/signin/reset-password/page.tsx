import type { Metadata } from "next"
import { ResetPasswordForm } from "@/forms/reset-password-form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter your email to reset your password",
}

export default function ResetPasswordPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription>
          Enter your email address and we will send you a verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  )
}
