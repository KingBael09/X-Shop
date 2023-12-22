"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/util/icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { addStoreAction } from "@/lib/actions/store"
import { catchError } from "@/lib/utils"
import { storeSchema, type ZStoreSchema } from "@/lib/validations/store"
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
import { Textarea } from "@/ui/textarea"

export function AddStoreForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<ZStoreSchema>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  function onSubmit(values: ZStoreSchema) {
    startTransition(async () => {
      try {
        await addStoreAction(values)
        form.reset()
        toast.success("Store added successfully!")
        router.push("/dashboard/stores")
        router.refresh()
      } catch (error) {
        catchError(error)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-xl gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Type store name here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type store description here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-fit" disabled={isPending}>
          {isPending && (
            <Icons.spinner className="mr-2 size-4 animate-spin" aria-hidden />
          )}
          Add Store
          <span className="sr-only">Add Store</span>
        </Button>
      </form>
    </Form>
  )
}
