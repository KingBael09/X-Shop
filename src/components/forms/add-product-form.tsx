"use client"

import { useRef, useState, useTransition } from "react"
import type { FileWithPreview } from "@/types"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { addProductAction, checkProductAction } from "@/lib/actions/product"
import type { Category } from "@/lib/db/schema"
import { catchError, cn, isArrayOfFile } from "@/lib/utils"
import { productSchema, type ZProductSchema } from "@/lib/validations/product"
import { Icons } from "@/components/util/icons"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

import { FileDialog } from "../file-dialog"
import { ExtraModals } from "./add-category-form"

interface AddProductFormProps {
  storeId: number
  categories: Category[]
}

export interface DialogState {
  target: "" | "category" | "subcategory"
  state: boolean
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
  // TODO:What am i sending upwards if subcategory is empty

  function onSubmit(values: ZProductSchema) {
    startTransition(async () => {
      try {
        // checking if product is available already so that we don't upload the image to server
        await checkProductAction({ name: values.name })

        const images = isArrayOfFile(values.images)
          ? await startUpload(values.images).then(
              (res) =>
                res?.map((image) => ({
                  id: image.fileKey,
                  name: image.fileKey.split("_")[1] ?? image.fileKey,
                  url: image.fileUrl,
                }))
            )
          : null

        await addProductAction({ ...values, storeId, images })
        toast.success("Product added successfully!")

        // reseting form and other files
        form.reset()
        setFiles(null)
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
                                    setCategoryOpen(false)
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
                            <Separator />
                            <CommandGroup>
                              <CommandItem
                                onSelect={() =>
                                  setOpen({ target: "category", state: true })
                                }
                              >
                                <Icons.addCircle className="mr-2 h-4 w-4" />
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
                                      "mr-2 h-4 w-4",
                                      String(subcategory) === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {subcategory}
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
                                <Icons.addCircle className="mr-2 h-4 w-4" />
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
                aria-hidden
              />
            )}
            Add Product
            <span className="sr-only">Add Product</span>
          </Button>
        </form>
      </Form>
    </>
  )
}
