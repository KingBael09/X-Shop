// ? "use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/util/icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { addCategoryAction, addSubCategoryAction } from "@/lib/actions/category"
import type { Category } from "@/lib/db/schema"
import { catchError, cn, slugify, toTitleCase } from "@/lib/utils"
import {
  categorySchema,
  subCategorySchema,
  type ZCategorySchema,
  type ZSubCategorySchema,
} from "@/lib/validations/category"
import { Button } from "@/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/ui/command"
import { Dialog, DialogContent } from "@/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form"
import { Input } from "@/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover"

import type { DialogState } from "./add-product-form"

interface AddSubCategoryFormProps {
  categories: Category[]
  setter: (state: DialogState) => void
}

interface AddCategoryFormProps {
  setter: (state: DialogState) => void
}

interface ExtraModalProps {
  data: Category[]
  state: DialogState
  setter: (state: DialogState) => void
}

export function ExtraModals({ state, setter, data }: ExtraModalProps) {
  return (
    <Dialog
      open={state.state}
      onOpenChange={(e) => setter({ target: "", state: e })}
    >
      <DialogContent className="p-0">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>
              {state.target === "category" && "Create cateogry"}
              {state.target === "subcategory" && "Create cateogry"}
            </CardTitle>
            <CardDescription>
              {state.target === "category" &&
                "Create a new category for your product"}
              {state.target === "subcategory" &&
                "Create a new sub-category for your product"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.target === "category" && <AddCategoryForm setter={setter} />}
            {state.target === "subcategory" && (
              <AddSubCategoryForm categories={data} setter={setter} />
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export function AddCategoryForm({ setter }: AddCategoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<ZCategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit({ name }: ZCategorySchema) {
    startTransition(async () => {
      try {
        await addCategoryAction({ name: slugify(name) })
        form.reset()
        router.refresh()
        toast.success("Category added successfully")
        setter({ target: "", state: false })
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
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Type category name here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export function AddSubCategoryForm({
  categories,
  setter,
}: AddSubCategoryFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const form = useForm<ZSubCategorySchema>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      name: "",
      categoryId: "",
    },
  })

  const curRef = useRef<HTMLButtonElement>(null)

  function onSubmit({ name, categoryId }: ZSubCategorySchema) {
    const subcategories =
      categories.find(({ id }) => id === Number(categoryId))?.subcategories ??
      []

    if (subcategories?.includes(name)) {
      toast.error("Subcategory already exists")
      return
    }
    subcategories?.push(slugify(name))

    startTransition(async () => {
      try {
        await addSubCategoryAction({
          categoryId,
          subcategories,
        })
        form.reset()
        router.refresh()
        toast.success("Subcategory added successfully")
        setter({ target: "", state: false })
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
          name="categoryId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
              <div className="flex w-full">
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        ref={curRef}
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "flex-1 justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? categories.find(
                              (category) => String(category.id) === field.value
                            )?.name
                          : "Select category"}
                        <Icons.chevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 sm:w-[460px]" // for some reason initially dosen't calc width
                      style={{ width: curRef.current?.clientWidth }}
                    >
                      <Command>
                        <CommandInput placeholder="Search Categories..." />
                        <CommandEmpty>No such category found</CommandEmpty>
                        <CommandGroup>
                          {categories.map((category) => (
                            <CommandItem
                              value={category.name}
                              key={category.name}
                              onSelect={() => {
                                form.setValue("categoryId", String(category.id))
                                setOpen(false)
                              }}
                            >
                              <Icons.check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  String(category.id) === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {toTitleCase(category.name)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Type category name here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

// TODO: There seem to so some sort of limitation if i take out ExtraModal out of this file
