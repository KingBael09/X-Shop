import { useCallback, useEffect, useRef, useState, type Key } from "react"

import { cn } from "@/lib/utils"
import { PopoverContent } from "@/ui/popover"

import { Badge } from "./ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command"
import { Popover, PopoverTrigger } from "./ui/popover"
import { Icons } from "./util/icons"

interface Option<T> {
  label: string
  value: T
}

interface MultiSelectProps<T> {
  placeholder?: string
  options: Option<T>[]
  value: T[] | null
  onValueChange: (value: T[] | null) => void
}

/**
 * Do note that this function is controlled only
 * - `value` and `onValueChange` must be passed
 */
export function MultiSelect<T>({
  placeholder,
  options,
  value,
  onValueChange,
}: MultiSelectProps<T>) {
  const inputRef = useRef<HTMLButtonElement>(null)
  const [selected, setSelected] = useState<T[] | null>(value)

  const handleRemove = useCallback(
    (option: Option<T>) => {
      setSelected((prev) => prev?.filter((item) => item !== option.value) ?? [])
    },
    [setSelected]
  )

  const handleSelect = useCallback(
    (option: Option<T>) => {
      setSelected((prev) => [...(prev ?? []), option.value])
    },
    [setSelected]
  )

  //  Sync with external data -> because i don't know how to manage a component which takes in both controlled and uncontrolled props -> emits
  useEffect(() => {
    onValueChange(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // re-sync for parent component -> recives
  useEffect(() => {
    setSelected(value)
  }, [value])

  // TODO: Maybe this could have beed solved with less useffects but i am dumb -> This will most likely cause re-rendering issues

  return (
    <Popover>
      <PopoverTrigger asChild ref={inputRef}>
        <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {selected?.map((id) => {
              const option = options.find((item) => item.value === id)
              if (!option) return null
              return (
                <Badge
                  key={option.value as Key}
                  variant="secondary"
                  className="rounded hover:bg-secondary"
                >
                  {option.label}
                </Badge>
              )
            })}
            <div className="line-clamp-1 min-h-[1.1rem] text-muted-foreground">
              <p className="p-1">{placeholder ?? ""}</p>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: inputRef.current?.clientWidth ?? "325px" }}
      >
        <Command>
          <CommandInput placeholder="Search" />
          <CommandEmpty>Nothing to Show</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const isInc = selected?.includes(option.value)
              //   if (!isInc)
              return (
                <CommandItem
                  key={option.value as Key}
                  onSelect={() => {
                    if (!isInc) {
                      handleSelect(option)
                    } else {
                      handleRemove(option)
                    }
                  }}
                >
                  <Icons.check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isInc ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
