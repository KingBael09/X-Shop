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
      <div tw="flex h-full w-full items-center justify-center bg-black text-[24px] leading-8 text-white">
        X
      </div>
    ),
    { ...size }
  )
}
