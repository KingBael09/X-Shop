import { Button } from "./ui/button"

export function FileDialogPlaceholder() {
  return (
    <Button variant="outline" className="w-full" disabled>
      Upload Images
      <span className="sr-only">Upload Images</span>
    </Button>
  )
}
