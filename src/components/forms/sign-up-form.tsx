"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/util/icons"
import { useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { catchClerkError } from "@/lib/utils"
import { authSchema, type ZAuthSchema } from "@/lib/validations/auth"
import { Button } from "@/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form"
import { Input } from "@/ui/input"
import { PasswordInput } from "@/components/password-input"

export function SignUpForm() {
  const router = useRouter()
  const { isLoaded, signUp } = useSignUp()
  const [isPending, startTransition] = useTransition()

  const form = useForm<ZAuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: ZAuthSchema) {
    if (!isLoaded) return

    startTransition(async () => {
      try {
        await signUp.create({
          emailAddress: data.email,
          password: data.password,
        })

        // Send email verification code
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        })

        router.push("/signup/verify-email")
        toast.message("Check your email", {
          description: "We sent you a 6-digit verification code.",
        })
      } catch (error) {
        catchClerkError(error)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="jayesh0071@outlook.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && (
            <Icons.spinner className="mr-2 size-4 animate-spin" aria-hidden />
          )}
          Continue
          <span className="sr-only">Continue to email verification page</span>
        </Button>
      </form>
    </Form>
  )
}
