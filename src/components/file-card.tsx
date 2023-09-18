// ? "use client"

import "cropperjs/dist/cropper.css"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { FileWithPreview } from "@/types"
import { Icons } from "@/util/icons"
import Cropper, { type ReactCropperElement } from "react-cropper"

import { Button } from "@/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog"

interface FileCardProps {
  i: number
  file: FileWithPreview
  files: FileWithPreview[] | null
  setFiles: (file: FileWithPreview[] | null) => void
}

export function FileCard({ i, file, files, setFiles }: FileCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [cropData, setCropData] = useState<string | null>(null)
  const cropperRef = useRef<ReactCropperElement>(null)

  // Crop image
  const onCrop = useCallback(() => {
    if (!files || !cropperRef.current) return
    const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas()
    setCropData(croppedCanvas.toDataURL())

    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        return
      }
      const croppedImage = new File([blob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      })

      const croppedFileWithPathAndPreview = Object.assign(croppedImage, {
        preview: URL.createObjectURL(croppedImage),
        path: file.name,
      }) satisfies FileWithPreview

      const newFiles = files.map((file, j) =>
        j === i ? croppedFileWithPathAndPreview : file
      )
      setFiles(newFiles)
    })
  }, [file.name, file.type, files, i, setFiles])

  // Crop image on enter key press
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        onCrop()
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeydown)
    return () => document.removeEventListener("keydown", handleKeydown)
  }, [onCrop])

  return (
    <div className="relative flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2">
        <Image
          src={cropData ? cropData : file.preview}
          alt={file.name}
          sizes="100vw"
          className="h-10 w-10 shrink-0 rounded-md object-cover"
          width={40}
          height={40}
        />
        <div className="flex flex-col">
          <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
            {file.name}
          </p>
          <p className="text-xs text-slate-500">
            {(file.size / 1024 / 1024).toFixed(2)}MB
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {file.type.startsWith("image") && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7"
              >
                <Icons.crop className="h-4 w-4" aria-hidden />
                <span className="sr-only">Crop image</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <p className="absolute left-5 top-4 text-base font-medium text-muted-foreground">
                Crop image
              </p>
              <div className="mt-8 grid place-items-center space-y-5">
                <Cropper
                  ref={cropperRef}
                  className="h-[450px] w-[450px] object-cover"
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={file.preview}
                  alt="image"
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  allowTransparency
                  checkCrossOrigin={false} //Shouldn't matter much ig
                />
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    aria-label="Crop image"
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      onCrop()
                      setIsOpen(false)
                    }}
                  >
                    <Icons.crop className="mr-2 h-3.5 w-3.5" aria-hidden />
                    Crop Image
                  </Button>
                  <Button
                    aria-label="Reset crop"
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      cropperRef.current?.cropper.reset()
                      setCropData(null)
                    }}
                  >
                    <Icons.reset className="mr-2 h-3.5 w-3.5" aria-hidden />
                    Reset Crop
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            if (!files) return
            setFiles(files.filter((_, j) => j !== i))
          }}
        >
          <Icons.close className="h-4 w-4" aria-hidden />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  )
}
