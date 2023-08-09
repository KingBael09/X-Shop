"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/util/icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { deleteStoreAction, updateStoreAction } from "@/lib/actions/store"
import type { Store } from "@/lib/db/schema"
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

interface UpdateStoreProps {
  store: Pick<Store, "id" | "name" | "description">
}

export function UpdateStoreForm({ store }: UpdateStoreProps) {
  const [isDeleting, startDeleting] = useTransition()
  const [isUpdating, startUpdating] = useTransition()
  //TODO: ikr why two useTransition, cuz if either button is loading both go into loading state
  const router = useRouter()
  const form = useForm<ZStoreSchema>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: store.name,
      description: store.description ?? "",
    },
  })

  function onSubmit(values: ZStoreSchema) {
    startUpdating(async () => {
      try {
        await updateStoreAction({ ...values, storeId: store.id })
        toast.success("Store updated successfullly!")
      } catch (error) {
        catchError(error)
      }
    })
  }

  const isChanged = !form.formState.isDirty

  function handleDeleteStore() {
    startDeleting(async () => {
      try {
        await deleteStoreAction(store.id)
        toast.success("Store deleted successfullly!")
        router.push("/dashboard/stores")
      } catch (error) {
        console.log(error)
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
        <div className="flex gap-4">
          <Button
            className="w-fit"
            type="submit"
            disabled={isUpdating || isChanged || isDeleting}
          >
            {isUpdating && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden
              />
            )}
            Update Store
            <span className="sr-only">Update Store</span>
          </Button>
          <Button
            className="w-fit"
            type="button"
            variant="destructive"
            disabled={isDeleting || isUpdating}
            onClick={handleDeleteStore}
          >
            {isDeleting && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden
              />
            )}
            Delete Store
            <span className="sr-only">Delete Store</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}
