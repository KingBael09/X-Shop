import Link, { type LinkProps } from "next/link"

interface ModLinkProps extends LinkProps {
  children: React.ReactNode
  className?: string
}

export function ModLink({ children, className, ...props }: ModLinkProps) {
  return (
    <Link prefetch={false} className={className} {...props}>
      {children}
    </Link>
  )
}
