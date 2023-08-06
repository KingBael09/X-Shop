import type { LayoutProps } from "@/types"

import { buttonVariants } from "../ui/button"

interface ModalLinkProps extends LayoutProps {
  href: string
}

/**
 * This is an exclusive compoent for intercepting modal
 *
 * This closes the modal and then routes
 *
 * Might use use client in future
 */
export function ModalLink({ href, children }: ModalLinkProps) {
  return (
    <a className={buttonVariants()} href={href}>
      {children}
    </a>
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
