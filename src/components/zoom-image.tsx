"use client"

import type { LayoutProps } from "@/types"
import MediumZoom from "react-medium-image-zoom"

import "react-medium-image-zoom/dist/styles.css"

// ? https://github.com/rpearce/react-medium-image-zoom

interface ZoomProps extends LayoutProps {
  margin?: number
}

/**
 * This is a client component
 */
export function Zoom({ children, margin }: ZoomProps) {
  return (
    <MediumZoom zoomMargin={margin ?? 80} classDialog="zoom-image">
      {children}
    </MediumZoom>
  )
}
