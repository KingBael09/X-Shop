"use client"

import { useRef, useState, useTransition } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { env } from "@/env.mjs"
import type { FileWithPreview } from "@/types"
import { Icons } from "@/util/icons"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useForm,
  type FieldValues,
  type UseFormSetValue,
} from "react-hook-form"
import { toast } from "sonner"

import { addProductAction, checkProductAction } from "@/lib/actions/product"
import type { Category } from "@/lib/db/schema"
import { useUploadThing } from "@/lib/upload"
import { catchError, cn, isArrayOfFile, toTitleCase } from "@/lib/utils"
import { productSchema, type ZProductSchema } from "@/lib/validations/product"
import { Button } from "@/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/ui/command"
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
import { Separator } from "@/ui/separator"
import { Textarea } from "@/ui/textarea"

import { FileDialogPlaceholder } from "../file-dialog-loader"
import { Zoom } from "../zoom-image"

interface AddProductFormProps {
  storeId: number
  categories: Category[]
}

export interface DialogState {
  target: "" | "category" | "subcategory"
  state: boolean
}

const ExtraModals = dynamic(() =>
  import("./add-category-form").then((mod) => mod.ExtraModals)
)

const FileDialog = dynamic(
  () => import("../file-dialog").then((mod) => mod.FileDialog),
  {
    loading: () => <FileDialogPlaceholder />,
  }
)

export function AddProductForm({ storeId, categories }: AddProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [files, setFiles] = useState<FileWithPreview[] | null>(null)

  const { isUploading, startUpload } = useUploadThing(
    env.NODE_ENV === "production" ? "prodProductImage" : "productImage",
    {
      onUploadError: () => {
        toast.error("Failed to upload image!")
        throw new Error("Failed to upload image!") //TODO: Should i really throw here
      },
    }
  )

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
    startTransition(async () => {
      try {
        // checking if product is available already so that we don't upload the image to server
        await checkProductAction({ name: values.name })

        const images = isArrayOfFile(values.images)
          ? await startUpload(values.images).then(
              (res) =>
                res?.map((image) => ({
                  id: image.key,
                  name: image.key.split("_")[1] ?? image.key,
                  url: image.url,
                }))
            )
          : null

        await addProductAction({ ...values, storeId, images })
        toast.success("Product added successfully!")

        // reseting form and other files
        form.reset()
        setFiles(null)
        router.push(`/dashboard/stores/${storeId}/products`)
      } catch (error) {
        catchError(error)
      }
    })
  }

  // TODO: Think of a better way than two useStates to manage Popover opening and closing -> otherwise it doesn't close

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [subcategoryOpen, setSubcategoryOpen] = useState(false)

  const subcategories =
    categories.find(
      (category) => category.id === Number(form.watch("categoryId"))
    )?.subcategories ?? []

  const [open, setOpen] = useState<DialogState>({
    target: "",
    state: false,
  })

  return (
    <>
      <ExtraModals state={open} setter={setOpen} data={categories} />
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
                      <Popover
                        open={categoryOpen}
                        onOpenChange={setCategoryOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            ref={ref}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "flex-1 justify-between capitalize",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? categories.find(
                                  (category) =>
                                    String(category.id) === field.value
                                )?.name
                              : "Select category"}
                            <Icons.chevronUpDown className="ml-2 size-4 shrink-0 opacity-50" />
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
                                    setCategoryOpen(false)
                                  }}
                                >
                                  <Icons.check
                                    className={cn(
                                      "mr-2 size-4",
                                      String(category.id) === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {toTitleCase(category.name)}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            <Separator />
                            <CommandGroup>
                              <CommandItem
                                onSelect={() =>
                                  setOpen({ target: "category", state: true })
                                }
                              >
                                <Icons.addCircle className="mr-2 size-4" />
                                Create Category?
                              </CommandItem>
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
                      <Popover
                        open={subcategoryOpen}
                        onOpenChange={setSubcategoryOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            disabled={form.watch("categoryId") ? false : true}
                            ref={ref}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "flex-1 justify-between capitalize",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? subcategories.find(
                                  (subcategory) => subcategory === field.value
                                )
                              : "Select sub-category"}
                            <Icons.chevronUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="p-0"
                          style={{ width: ref.current?.clientWidth }}
                        >
                          <Command>
                            <CommandInput placeholder="Search Subcategories..." />
                            <CommandEmpty>
                              No such subcategory found
                            </CommandEmpty>
                            <CommandGroup>
                              {subcategories.map((subcategory) => (
                                <CommandItem
                                  value={subcategory}
                                  key={subcategory}
                                  onSelect={(value) => {
                                    form.setValue("subcategory", value)
                                    setSubcategoryOpen(false)
                                  }}
                                >
                                  <Icons.check
                                    className={cn(
                                      "mr-2 size-4",
                                      String(subcategory) === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {toTitleCase(subcategory)}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            <Separator />
                            <CommandGroup>
                              <CommandItem
                                onSelect={() =>
                                  setOpen({
                                    target: "subcategory",
                                    state: true,
                                  })
                                }
                              >
                                <Icons.addCircle className="mr-2 size-4" />
                                Create Subcategory?
                              </CommandItem>
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
            render={(_) => {
              return (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  {files?.length ? (
                    <div className="flex items-center gap-2">
                      {files.map((file) => (
                        <Zoom key={file.name}>
                          <Image
                            sizes="100vw"
                            src={file.preview}
                            alt={file.name}
                            className="size-20 shrink-0 rounded-md object-cover object-center"
                            width={80}
                            height={80}
                          />
                        </Zoom>
                      ))}
                    </div>
                  ) : null}
                  <FormControl>
                    <FileDialog
                      setValue={
                        form.setValue as unknown as UseFormSetValue<FieldValues>
                      }
                      name="images"
                      maxFiles={3}
                      maxSize={1024 * 1024 * 4}
                      files={files}
                      setFiles={setFiles}
                      isUploading={isUploading}
                      disabled={isPending}
                    />
                  </FormControl>
                  {/* </div> */}
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <Button className="w-fit" disabled={isPending}>
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" aria-hidden />
            )}
            {isUploading ? "Uploading.." : "Add Product"}
            <span className="sr-only">Add Product</span>
          </Button>
        </form>
      </Form>
    </>
  )
}
