"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { LayoutProps } from "@/types"

import { Button, buttonVariants } from "../ui/button"

interface ModalLinkProps extends LayoutProps {
  href: string
}

/**
 * This is an exclusive compoent for intercepting modal intends to close the modal and then route
 *
 * Might use `use client` in future
 *
 * Currently uses hard navigates using
 * ```ts
 * window.location.replace()
 * ```
 */
export function ModalLink({ href, children }: ModalLinkProps) {
  function handleRouteChange() {
    if (typeof window !== "undefined") {
      //FIXME: This doesn't cause the browser to scroll to bottom but is jittery
      // window.location.replace(href)

      // ! Note that this is a very hacky solution
      // Man...do i take next/link fore-granted
      // TODO: Think of better way to handle this or maybe nextjs will fix this in next update
      window.history.replaceState(null, "", href)
      window.history.scrollRestoration = "manual" //This kinda fixes onesided sided
      window.location.reload()
    }
  }

  return (
    // <a className={buttonVariants()} href={href}>
    //   {children}
    // </a>
    <Button onClick={handleRouteChange}>{children}</Button>
  )
}

// TODO: Think of a way to route when modal is open
/**
 * Currently when i link or use useRouter() it makes the page change but the modal doesn't
 *
 * Current work-around is that i hard route to the page with <a> tag
 *
 * In future look for a way to do this with soft navigation using link or useRouter()
 *
 */
