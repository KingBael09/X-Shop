import dynamic from "next/dynamic"

import type { MainNavItem } from "@/config/site"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion"
import { SheetLink } from "@/ui/sheet"

const MobileSheetWrapper = dynamic(() => import("./mobile-sheet-wrapper"))

interface MobileNavProps {
  items: MainNavItem[]
}

export function MobileNav({ items }: MobileNavProps) {
  return (
    <MobileSheetWrapper>
      <Accordion type="single" collapsible className="w-full">
        {items?.map((item) =>
          item.items ? (
            <AccordionItem key={item.title} value={item.title}>
              <AccordionTrigger className="capitalize">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-2 flex flex-col space-y-2">
                  {item.items.map((subitem) => (
                    <SheetLink
                      key={subitem.title}
                      className="text-foreground/70 transition-colors hover:text-foreground"
                      href={subitem.href!}
                    >
                      {subitem.title}
                    </SheetLink>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : (
            <AccordionItem key={item.title} value={item.title}>
              <SheetLink
                className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline"
                href={item.href!}
              >
                {item.title}
              </SheetLink>
            </AccordionItem>
          )
        )}
      </Accordion>
    </MobileSheetWrapper>
  )
}
