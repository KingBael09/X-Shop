"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { addProductAction, checkProductAction } from "@/lib/actions/product"
import type { Category, Product } from "@/lib/db/schema"
import { catchError, cn, isArrayOfFile } from "@/lib/utils"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

import { FileDialog } from "../file-dialog"
import { Icons } from "../util/icons"
import { ExtraModals } from "./add-category-form"
import type { DialogState } from "./add-product-form"

interface UpdateProductFormProps {
  product: Product
  categories: Category[]
}

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function UpdateProductForm({
  product,
  categories,
}: UpdateProductFormProps) {
  const [isUpdating, startUpdating] = useTransition()
  const [isDeleting, startDeletion] = useTransition()
  const [files, setFiles] = useState<FileWithPreview[] | null>(null)

  const { isUploading, startUpload } = useUploadThing("productImage")

  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const filesWithPreview = product.images.map((image) => {
        const file = new File([], image.name, { type: "image" })
        return Object.assign(file, { preview: image.url })
      })
      setFiles(filesWithPreview)
    }
  }, [product])

  const form = useForm<ZProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      inventory: String(product.inventory),
      categoryId: String(product.categoryId),
      subcategory: product.subcategory ?? "",
      images: undefined,
    },
  })

  const isFormUpdated = !form.formState.isDirty

  // TODO: For some fked up reasons isDirty isn't catching change in categories and subcategories at first step but if i change other field and reset then then it catches on that categories or subcategories has changed

  function onSubmit(values: ZProductSchema) {
    console.log(values)
  }

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
                        disabled={isUpdating || isDeleting}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <div className="flex gap-4">
            <Button className="w-fit" disabled={isUpdating || isFormUpdated}>
              {isUpdating && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Update Product
              <span className="sr-only">Update Product</span>
            </Button>
            <Button variant="destructive">
              {isDeleting && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete Product
              <span className="sr-only">Delete Product</span>
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
