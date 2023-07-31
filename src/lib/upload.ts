import { generateReactHelpers } from "@uploadthing/react/hooks"

import type { OurFileRouter } from "@/app/api/uploadthing/core"

export const { useUploadThing } = generateReactHelpers<OurFileRouter>()

// FIXME: IDK if this is needed but..... -> addProductForm & updateProductForm
