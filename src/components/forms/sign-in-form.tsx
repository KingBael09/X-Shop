"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/util/icons"
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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

import { PasswordInput } from "../password-input"

export function SignInForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { isLoaded, signIn, setActive } = useSignIn()
  const form = useForm<ZAuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: ZAuthSchema) {
    // console.log(data)
    if (!isLoaded) return

    startTransition(async () => {
      try {
        const result = await signIn.create({
          identifier: data.email,
          password: data.password,
        })

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId })
          router.push(`${window.location.origin}/`)
        } else {
          console.error("Something unforseen has happened!")
          console.log(result)
        }
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
                <Input
                  type="text"
                  placeholder="jayesh0071@outlook.com"
                  {...field}
                />
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
        <Button type="submit" disabled={isPending}>
          {isPending && (
            <Icons.spinner className="mr-2 size-4 animate-spin" aria-hidden />
          )}
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  )
}
