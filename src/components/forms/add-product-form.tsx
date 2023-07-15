"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { AddCategoryAction, AddSubCategoryAction } from "@/lib/actions/category"
import type { Category } from "@/lib/db/schema"
import { catchError, cn } from "@/lib/utils"
import {
  categorySchema,
  subCategorySchema,
  type ZCategorySchema,
  type ZSubCategorySchema,
} from "@/lib/validations/category"
import { productSchema, type ZProductSchema } from "@/lib/validations/product"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

import { FileDialog } from "../file-dialog"
import { Icons } from "../util/icons"

interface AddProductFormProps {
  storeId: number
  categories: Category[]
}

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function AddProductForm({ storeId, categories }: AddProductFormProps) {
  const [isPending, startTransition] = useTransition()
  const [files, setFiles] = useState<FileWithPreview[] | null>(null)

  const { isUploading, startUpload } = useUploadThing("productImage")

  const ref = useRef<HTMLButtonElement>(null)

  const form = useForm<ZProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      inventory: "",
    },
  })

  function onSubmit(values: ZProductSchema) {
    console.log(values)
  }

  const subcategories =
    categories.find(
      (category) => category.id === Number(form.watch("categoryId"))
    )?.subcategories ?? []

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
                <Input placeholder="Type product name here." {...field} />
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
                  placeholder="Type product description here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <div className="flex w-full">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          ref={ref}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "flex-1 justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? categories.find(
                                (category) =>
                                  String(category.id) === field.value
                              )?.name
                            : "Select category"}
                          <Icons.chevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0"
                        style={{ width: ref.current?.clientWidth }}
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
                                  form.setValue(
                                    "categoryId",
                                    String(category.id)
                                  )
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
                                {category.name}
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
            name="subcategory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Subcategory</FormLabel>
                <div className="flex w-full">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          ref={ref}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "flex-1 justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? subcategories.find(
                                (subcategory) => subcategory === field.value
                              )
                            : "Select sub-category"}
                          <Icons.chevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0"
                        style={{ width: ref.current?.clientWidth }}
                      >
                        <Command>
                          <CommandInput placeholder="Search Subcategories..." />
                          <CommandEmpty>No such subcategory found</CommandEmpty>
                          <CommandGroup>
                            {subcategories.map((subcategory) => (
                              <CommandItem
                                value={subcategory}
                                key={subcategory}
                                onSelect={(value) => {
                                  form.setValue("subcategory", value)
                                }}
                              >
                                <Icons.check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    String(subcategory) === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {subcategory}
                              </CommandItem>
                            ))}
                            {/* //TODO: Currently unavailable */}
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
        </div>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Type product price here."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inventory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Inventory</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Type available qty here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <FileDialog
                      setValue={form.setValue}
                      name="images"
                      maxFiles={3}
                      maxSize={1024 * 1024 * 4}
                      files={files}
                      setFiles={setFiles}
                      isUploading={isUploading}
                      disabled={isPending}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <Button className="w-fit" disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Add Product
          <span className="sr-only">Add Product</span>
        </Button>
      </form>
    </Form>
  )
}

interface AddSubCategoryFormProps {
  categories: Category[]
}

export function AddSubCategoryForm({ categories }: AddSubCategoryFormProps) {
  const router = useRouter()

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
    subcategories?.push(name)

    startTransition(async () => {
      try {
        await AddSubCategoryAction({
          categoryId,
          subcategories,
        })
        form.reset()
        router.refresh()
        toast.success("Category added successfully")
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
                  <Popover>
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
                      className="p-0 sm:w-[412px]" // for some reason initially dosen't calc width
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
                              {category.name}
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

export function AddCategoryForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<ZCategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(values: ZCategorySchema) {
    startTransition(async () => {
      try {
        await AddCategoryAction(values)
        form.reset()
        router.refresh()
        toast.success("Category added successfully")
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
