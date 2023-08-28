import type { FancyOmit } from "@/types/util"

import { ModalBodyWrapper } from "./modal-body-wrapper"

interface ModalProps
  extends FancyOmit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: string | React.ReactNode
}

export function Modal({ title, children, ...props }: ModalProps) {
  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm">
      <div className="container mx-auto flex h-full max-w-2xl items-center">
        <ModalBodyWrapper title={title} {...props}>
          <div className="flex flex-col gap-6 p-1">{children}</div>
        </ModalBodyWrapper>
      </div>
    </div>
  )
}
