// "?use client"

import { useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import type { FileWithPreview } from "@/types"
import { Icons } from "@/util/icons"
import {
  useDropzone,
  type Accept,
  type FileRejection,
  type FileWithPath,
} from "react-dropzone"
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form"
import { toast } from "sonner"

import { cn, formatBytes } from "@/lib/utils"
import { Button } from "@/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog"
import { Skeleton } from "@/ui/skeleton"

interface FileDialogProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLDivElement> {
  name: Path<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  files: FileWithPreview[] | null
  setFiles: (file: FileWithPreview[] | null) => void
  isUploading?: boolean
  disabled?: boolean
}

const FileCard = dynamic(
  () => import("./file-card").then((mod) => mod.FileCard),
  {
    loading: () => (
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    ),
  }
)

export function FileDialog<TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/*": [],
  },
  maxSize = 1024 * 1024 * 2, //2mb limit
  maxFiles = 1,
  files,
  setFiles,
  isUploading = false,
  disabled = false,
  className,
  ...props
}: FileDialogProps<TFieldValues>) {
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      setValue(
        name,
        acceptedFiles as PathValue<TFieldValues, Path<TFieldValues>>,
        {
          shouldValidate: true,
        }
      )
      const acceptedFileObject = acceptedFiles.map(
        (file) => Object.assign(file, { preview: URL.createObjectURL(file) }) //i can do that wtf
      )
      setFiles(acceptedFileObject)

      // ? Show toast for rejected files if any

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors, file }) => {
          if (errors[0]?.code === "file-too-large") {
            toast.error(
              `${file.name} is too large. Max size is ${formatBytes(maxSize)}`
            )
            return
          }
          errors[0]?.message && toast.error(errors[0].message)
        })
      }
    },
    [maxSize, name, setFiles, setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
    disabled,
  })

  // cleanup
  useEffect(() => {
    return () => {
      if (!files) return
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={disabled}>
          Upload Images
          <span className="sr-only">Upload Images</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <p className="absolute left-5 top-4 text-base font-medium text-muted-foreground">
          Upload your images
        </p>
        <div
          className={cn(
            "group relative mt-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive && "border-muted-foreground/50",
            disabled && "pointer-events-none opacity-60",
            className
          )}
          {...getRootProps()}
          {...props}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="group grid w-full place-items-center gap-1 sm:px-10">
              <Icons.upload
                className="h-9 w-9 animate-pulse text-muted-foreground"
                aria-hidden
              />
            </div>
          ) : isDragActive ? (
            <div className="grid place-items-center gap-2 text-muted-foreground sm:px-5">
              <Icons.upload
                className={cn("h-8 w-8", isDragActive && "animate-bounce")}
                aria-hidden
              />
              <p className="text-base font-medium">Drop the file here</p>
            </div>
          ) : (
            <div className="grid place-items-center gap-1 sm:px-5">
              <Icons.upload
                className="h-8 w-8 text-muted-foreground"
                aria-hidden
              />
              <p className="mt-2 text-base font-medium text-muted-foreground">
                Drag {`'n'`} drop file here, or click to select file
              </p>
              <p className="text-sm text-slate-500">
                Please upload file with size less than {formatBytes(maxSize)}
              </p>
            </div>
          )}
        </div>
        <p className="text-center text-sm font-medium text-muted-foreground">
          You can upload up to {maxFiles} {maxFiles === 1 ? "file" : "files"}
        </p>
        {files?.length ? (
          <div className="grid gap-5">
            {files?.map((file, i) => (
              <FileCard
                key={i}
                i={i}
                name={name}
                // TODO: Dammit typescript only in dynamic component are you complaining
                setValue={setValue as UseFormSetValue<FieldValues>}
                files={files}
                setFiles={setFiles}
                file={file}
              />
            ))}
          </div>
        ) : null}
        {files?.length ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setFiles(null)
              setValue(
                name,
                null as PathValue<TFieldValues, Path<TFieldValues>>,
                {
                  shouldValidate: true,
                }
              )
            }}
            className="mt-2.5 w-full"
          >
            <Icons.trash className="mr-2 h-4 w-4" aria-hidden />
            Remove All
            <span className="sr-only">Remove All</span>
          </Button>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

// TODO: THis throws with local file /* setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL()) */

// TODO: Change file name incase of crop

// TODO: FIXME Your proposed upload exceeds the maximum allowed size, this should trigger toast.error too
