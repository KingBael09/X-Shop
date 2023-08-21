"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { FileWithPreview, StoredFile } from "@/types"
import { Icons } from "@/util/icons"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useForm,
  type FieldValues,
  type UseFormSetValue,
} from "react-hook-form"
import { toast } from "sonner"

import {
  checkProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/lib/actions/product"
import type { Category, Product } from "@/lib/db/schema"
import { useUploadThing } from "@/lib/upload"
import { catchError, cn, isArrayOfFile } from "@/lib/utils"
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
import { AspectRatio } from "../ui/aspect-ratio"
import { Zoom } from "../zoom-image"
import type { DialogState } from "./add-product-form"

interface UpdateProductFormProps {
  product: Product
  categories: Category[]
}

/**
 * Do note that this is a workaround to filter local file links with already uploaded links
 */
type HackyType = { preview: string }[]

const ExtraModals = dynamic(() =>
  import("./add-category-form").then((mod) => mod.ExtraModals)
)

const FileDialog = dynamic(
  () => import("../file-dialog").then((mod) => mod.FileDialog),
  {
    loading: () => <FileDialogPlaceholder />,
  }
)

export function UpdateProductForm({
  product,
  categories,
}: UpdateProductFormProps) {
  const router = useRouter()
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
    },
  })

  const isCatUpdated =
    form.watch("categoryId") !== form.formState.defaultValues?.categoryId
  const isSubCatUpdated =
    form.watch("subcategory") !== form.formState.defaultValues?.subcategory

  // const isImageUpdated =
  //   JSON.stringify(form.watch("images")) !==
  //   JSON.stringify(form.formState.defaultValues?.images)

  const isImageUpdated =
    JSON.stringify(files?.map((item) => item.preview) ?? []) !==
    JSON.stringify(product.images?.map((item) => item.url) ?? [])

  const isFormUpdated =
    form.formState.isDirty || isCatUpdated || isSubCatUpdated || isImageUpdated

  // FIXME: For some fked up reasons isDirty isn't catching change in categories and subcategories at  first step but if i change other field and reset then then it catches on that categories or subcategories has changed
  // FIXME:  Uploading file is also not counted in above wtf

  function onSubmit(values: ZProductSchema) {
    // TODO : Filter out subcategory
    startUpdating(async () => {
      try {
        // Check if product already exists in the store
        await checkProductAction({ name: values.name, id: product.id })

        // TODO: This is mostly untested and will fail in prod.

        const inputImages = values.images as HackyType //Typecasting images

        const [uploadImages, orignalImages] = inputImages.reduce(
          ([p, f], e) => {
            if (e.preview.startsWith("blob")) return [[...p, e], f]
            else {
              const data = product.images?.find(
                (prod) => prod.url === e.preview
              ) as unknown as HackyType[0] //TODO: Major L -> very bad logic
              return [p, [...f, data]]
            }
          },
          [[] as HackyType, [] as HackyType]
        )

        // Upload images if data.images is an array of files
        const images =
          isArrayOfFile(uploadImages) && isImageUpdated
            ? await startUpload(uploadImages).then((res) => {
                const formattedImages = res?.map((image) => ({
                  id: image.key,
                  name: image.key.split("_")[1] ?? image.key,
                  url: image.url,
                }))
                return formattedImages ?? null
              })
            : null

        await updateProductAction({
          ...values,
          isImageUpdated,
          id: product.id,
          storeId: product.storeId,
          images: isImageUpdated
            ? images && images.length > 0
              ? [...images, ...(orignalImages as unknown as StoredFile[])]
              : // TODO: Another major L -> maybe i could have thought of a better way
                null
            : product.images,
        })

        toast.success("Product updated successfully.")
        router.push(`/dashboard/stores/${product.storeId}/products`)
        setFiles(null)

        // TODO Chekc if the new uploaded images is same as previous if any
      } catch (error) {
        catchError(error)
      }
    })
  }

  function handleDelete() {
    // startDeletion
    startDeletion(async () => {
      try {
        await deleteProductAction({ id: product.id, storeId: product.storeId })
        toast.success("Product deleted successfully")
        router.push(`/dashboard/stores/${product.storeId}/products`)
      } catch (error) {
        catchError(error)
      }
    })
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
                                    if (
                                      form.formState.defaultValues
                                        ?.categoryId !== String(category.id)
                                    ) {
                                      form.setValue("subcategory", "") //setting subcategory empty if category is changed
                                    }
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
                  {files?.length ? (
                    <div className="flex h-20 items-center gap-2">
                      {files.map((file) => (
                        <div
                          className="relative max-w-[80px] flex-full"
                          key={file.name}
                        >
                          <Zoom margin={10}>
                            <AspectRatio ratio={1}>
                              <Image
                                src={file.preview}
                                alt={file.name}
                                className="rounded-md object-cover"
                                fill
                              />
                            </AspectRatio>
                          </Zoom>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <FormControl>
                    <FileDialog
                      setValue={
                        // FIXME: Dammit Typescript wtf is wrong with dynamic import and generics
                        form.setValue as unknown as UseFormSetValue<FieldValues>
                      }
                      name="images"
                      maxFiles={3}
                      maxSize={1024 * 1024 * 4}
                      files={files}
                      setFiles={setFiles}
                      isUploading={isUploading}
                      disabled={isUpdating || isDeleting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <div className="flex gap-4">
            <Button
              className="w-fit"
              type="submit"
              disabled={isUpdating || !isFormUpdated || isDeleting}
            >
              {isUpdating && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden
                />
              )}
              Update Product
              <span className="sr-only">Update Product</span>
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              type="button"
              disabled={isDeleting || isUpdating}
            >
              {isDeleting && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden
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

// TODO: Updating image removes existing images

// TODO: Does delete store delete all images of products that it has
