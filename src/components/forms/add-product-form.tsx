"use client"

import { useRef, useState, useTransition } from "react"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"

import type { Category } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { productSchema, type ZProductSchema } from "@/lib/validations/product"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Textarea } from "../ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
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
      //   categoryId: "",
    },
  })

  const [categoryName, setCategoryName] = useState("")

  function onSubmit(values: ZProductSchema) {
    console.log(values)
  }

  //   function handleCreateCategory() {}

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
                                value={String(category.id)}
                                key={category.id}
                                onSelect={(value) => {
                                  form.setValue("categoryId", value)
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
                            ? categories.find(
                                (category) =>
                                  String(category.id) === field.value
                              )?.name
                            : "Select subcategory"}
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
                            {/* {categories.map((category) => (
                              <CommandItem
                                value={String(category.id)}
                                key={category.id}
                                onSelect={(value) => {
                                  form.setValue("subcategory", value)
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
                            ))} */}
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

// const Some = () => {
//   return (
//     <>
//       <DialogTrigger asChild>
//         <Button variant="ghost" size="icon">
//           <Icons.addCircle className="h-4 w-4" />
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create New Category</DialogTitle>
//           <DialogDescription>
//             Create a new category if none of the previous categories satisfy for
//             your products
//           </DialogDescription>
//         </DialogHeader>
//         <Input
//           placeholder="Type category name here."
//           value={categoryName}
//           pattern="[a-zA-Z]+"
//           required
//           onChange={(e) => {
//             setCategoryName(e.target.value)
//           }}
//         />
//         <DialogFooter>
//           <Button
//             disabled={categoryName.length === 0}
//             onClick={handleCreateCategory}
//           >
//             Create Category
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </>
//   )
// }
