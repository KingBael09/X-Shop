"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { isClerkAPIResponseError, useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  verfifyEmailSchema,
  type ZVerifyEmailSchema,
} from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { PasswordInput } from "../password-input"
import { Icons } from "../util/icons"

export function VerifyEmailForm() {
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp()
  const [isPending, startTransition] = useTransition()

  // react-hook-form
  const form = useForm<ZVerifyEmailSchema>({
    resolver: zodResolver(verfifyEmailSchema),
    defaultValues: {
      code: "",
    },
  })

  function onSubmit(data: ZVerifyEmailSchema) {
    if (!isLoaded) return

    startTransition(async () => {
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: data.code,
        })
        if (completeSignUp.status !== "complete") {
          /*  investigate the response, to see if there was an error
             or if the user needs to complete more steps.*/
          console.log(JSON.stringify(completeSignUp, null, 2))
        }
        if (completeSignUp.status === "complete") {
          await setActive({ session: completeSignUp.createdSessionId })

          router.push(`${window.location.origin}/`)
        }
      } catch (error) {
        const unknownError = "Something went wrong, please try again."

        isClerkAPIResponseError(error)
          ? toast.error(error.errors[0]?.longMessage ?? unknownError)
          : toast.error(unknownError)
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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormDescription>
                Enter the 6-digit code sent to your email
              </FormDescription>
              <FormControl>
                <PasswordInput
                  placeholder="**********"
                  {...field}
                  onChange={(e) => {
                    e.target.value = e.target.value.trim()
                    field.onChange(e)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Create account
          <span className="sr-only">Create account</span>
        </Button>
      </form>
    </Form>
  )
}
