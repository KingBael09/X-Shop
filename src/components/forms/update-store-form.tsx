"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { updateStoreAction } from "@/lib/actions/store"
import type { Store } from "@/lib/db/schema"
import { catchError } from "@/lib/utils"
import { storeSchema, type ZStoreSchema } from "@/lib/validations/store"

import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Icons } from "../util/icons"

interface UpdateStoreProps {
  store: Pick<Store, "id" | "name" | "description">
}

export function UpdateStoreForm({ store }: UpdateStoreProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ZStoreSchema>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: store.name,
      description: store.description ?? "",
    },
  })

  function onSubmit(values: ZStoreSchema) {
    // console.log(values)
    startTransition(async () => {
      try {
        await updateStoreAction({ ...values, storeId: store.id })
        // form.reset()
      } catch (error) {
        catchError(error)
      }
    })
  }

  const updateCondition =
    JSON.stringify(form.getValues()) ===
    JSON.stringify({ name: store.name, description: store.description })

  return (
    <Form {...form}>
      <form
        id="update-store-form"
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
      </form>
      <div className="mt-6 flex gap-4">
        <Button
          className="w-fit"
          type="submit"
          form="update-store-form"
          disabled={isPending || updateCondition}
        >
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Update Store
          <span className="sr-only">Add Store</span>
        </Button>
        <Button
          className="w-fit"
          type="button"
          variant="destructive"
          disabled={isPending}
        >
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Delete Store
          <span className="sr-only">Add Store</span>
        </Button>
      </div>
    </Form>
  )
}
