import { useLayoutEffect } from "react"

export function useLockBody() {
  useLayoutEffect(() => {
    const scrollWidth = window.innerWidth - document.documentElement.clientWidth
    // I don't think window would be undefined during useLayoutEffect

    const orignalOverflow: string = window.getComputedStyle(
      document.body
    ).overflow
    const orignalMargin: string = window.getComputedStyle(
      document.body
    ).marginRight
    // Set margin offset to prevent layout shift
    document.body.style.marginRight = `${scrollWidth}px`
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.margin = orignalMargin
      document.body.style.overflow = orignalOverflow
    }
  }, [])
}
