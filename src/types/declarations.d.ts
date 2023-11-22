import type { StaticImageData } from "next/image"

declare module "*.webp" {
  export default StaticImageData
}
