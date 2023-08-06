import { redirect } from "next/navigation"

import type { ProductPreviewPageProps } from "../../@preview/(.)preview-product/[productId]/page"

export default function ProductPreviewPage({
  params,
}: ProductPreviewPageProps) {
  const productId = Number(params.productId)

  redirect(`/products/${productId}`)
}
