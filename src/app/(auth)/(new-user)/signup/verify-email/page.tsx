import type { Metadata } from "next"
import { VerifyEmailForm } from "@/forms/verify-email-form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to continue with your sign up",
}

export default function VerifyEmailPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Verify email</CardTitle>
        <CardDescription>
          Verify your email address to complete your account creation
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <VerifyEmailForm />
      </CardContent>
    </Card>
  )
}
