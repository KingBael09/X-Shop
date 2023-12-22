import Link from "next/link"
import { Icons } from "@/util/icons"

import type { Store } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { Button } from "@/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover"

interface StorePagerProps {
  current: Pick<Store, "id" | "name">
  stores: Pick<Store, "id" | "name">[]
}

export function StoreSwitcher({ current, stores }: StorePagerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="justify-between md:w-[200px]"
        >
          <Icons.circle
            className="mr-2 hidden size-4 md:block"
            aria-hidden="true"
          />
          <span className="mr-2 line-clamp-1">{current.name}</span>
          <Icons.chevronUpDown
            className="ml-auto size-4 shrink-0 opacity-50"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[200px] p-0 md:w-[var(--radix-popover-trigger-width)]"
      >
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No Shop Found!</CommandEmpty>
            <CommandGroup>
              {stores.map((store) => (
                <Link key={store.id} href={`/dashboard/stores/${store.id}`}>
                  <CommandItem key={store.id} value={store.name}>
                    <Icons.circle className="mr-2 size-4" aria-hidden="true" />
                    <span className="line-clamp-1">{store.name}</span>
                    <Icons.check
                      className={cn(
                        "ml-auto size-4",
                        current.id === store.id ? "opacity-100" : "opacity-0"
                      )}
                      aria-hidden="true"
                    />
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <Link href="/dashboard/stores/create">
                <CommandItem>
                  <Icons.addCircle className="mr-2 size-4" aria-hidden="true" />
                  Create Store
                </CommandItem>
              </Link>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// TODO: Create store page should pre-check if there are already three stores or not

// TODO: Somewhere in codebase I have setup popover content width with refs-> but it turns out that i could just use var(--radix-popover-trigger-width)

// FIXME: Think of a way to implememt the below idea/issue
/**
 * If the user is on the `Products` section and then changes the store from the switcher then
 * what currently happends is that they are naviated to that store's `Store` section
 * think of a way to implement routing such that the section doesn't get changed but the
 * store changes
 */
