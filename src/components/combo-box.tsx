"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import type { Product } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

import { Button } from "./ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import { Skeleton } from "./ui/skeleton"
import { Icons } from "./util/icons"

interface SearchResult {
  products: Pick<Product, "id" | "name">[]
}

export function ComboBox() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const debounceQuery = useDebounce(query, 400)
  const [data, setData] = useState<SearchResult | null>(null)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (debounceQuery.length === 0) setData(null)
    if (debounceQuery) {
      startTransition(() => {
        // fetch data here
        // setData(null)
      })
    }
  }, [debounceQuery])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = useCallback((callback: () => unknown) => {
    setIsOpen(false)
    callback()
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
    }
  }, [isOpen])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-10 w-10 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setIsOpen(true)}
      >
        <Icons.search className="h-4 w-4 xl:mr-2" aria-hidden />
        <span className="hidden xl:inline-flex">Search products...</span>
        <span className="sr-only">Search products</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>
      <CommandDialog position="top" open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn(isPending ? "hidden" : "py-6 text-center text-sm")}
          >
            No products found.
          </CommandEmpty>
          {isPending ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            // data?.map((group) => (
            //   <CommandGroup
            //     key={group.category}
            //     className="capitalize"
            //     heading={group.category}
            //   >
            //     {group.products.map((item) => (
            //       <CommandItem
            //         key={item.id}
            //         onSelect={() =>
            //           handleSelect(() => router.push(`/product/${item.id}`))
            //         }
            //       >
            //         {item.name}
            //       </CommandItem>
            //     ))}
            //   </CommandGroup>
            // ))
            <></>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
