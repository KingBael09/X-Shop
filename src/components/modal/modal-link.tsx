"use client"

import type { LayoutProps } from "@/types"

import { Button } from "../ui/button"

interface ModalLinkProps extends LayoutProps {
  href: string
}

/**
 * This is an exclusive client-compoent for intercepting modal
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
 * Currently, link or use useRouter() it makes the page change but the modal doesn't close
 *
 * Current work-around is that i hard route to the page with `window.history.replaceState()` and `window.location.reload()` along with some scrolling hacks
 *
 * In future look for a way to do this with soft navigation using link or useRouter()
 *
 */
