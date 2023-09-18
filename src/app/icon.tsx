import { ImageResponse } from "next/server"

export const runtime = "edge"

export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div tw="flex items-center justify-center w-full h-full bg-black text-white text-[24px] leading-8">
        X
      </div>
    ),
    { ...size }
  )
}
