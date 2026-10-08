import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'

interface Option {
  id: string
  name: string
}

interface SearchableSelectProps {
  options: Option[] | undefined
  value: string
  onChange: (value: string) => void
  placeholder: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  'aria-invalid'?: boolean
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder = 'Search…',
  disabled,
  className,
  'aria-invalid': invalid,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const selected = options?.find((opt) => opt.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          disabled={disabled}
          className={cn(
            'w-full justify-between rounded-input px-4 font-normal aria-invalid:border-destructive',
            !selected && 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">{selected?.name ?? placeholder}</span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options?.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={opt.name}
                  onSelect={() => {
                    onChange(opt.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn('size-4 text-primary', value === opt.id ? 'opacity-100' : 'opacity-0')}
                  />
                  {opt.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}