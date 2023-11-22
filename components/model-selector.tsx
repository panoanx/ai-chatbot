'use client'
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent
} from '@/components/ui/select'
import React, { useContext, useEffect } from 'react'
import { IconCheck, IconOpenAI } from './ui/icons'
import { CubeIcon } from '@radix-ui/react-icons'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandShortcut
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

// gpt-3.5-turbo-instruct
// gpt-3.5-turbo	160,000 TPM	5,000 RPM
// gpt-3.5-turbo-0301	160,000 TPM	5,000 RPM
// gpt-3.5-turbo-0613	160,000 TPM	5,000 RPM
// gpt-3.5-turbo-1106	160,000 TPM	5,000 RPM
// gpt-3.5-turbo-16k	180,000 TPM	5,000 RPM
// gpt-3.5-turbo-16k-0613	180,000 TPM	5,000 RPM
// gpt-4	80,000 TPM	5,000 RPM
// gpt-4-0314	80,000 TPM	5,000 RPM
// gpt-4-0613	80,000 TPM	5,000 RPM
// gpt-4-1106-preview	40,000 TPM	20 RPM, 100 RPD
// gpt-4-vision-preview	40,000 TPM	20 RPM, 100 RPD
const modelOptions = {
  chat: {
    desc: 'Chat',
    models: [
      { label: 'GPT-3.5', value: 'gpt-3.5-turbo' },
      { label: 'GPT-3.5 16k', value: 'gpt-3.5-turbo-16k' },
      { label: 'GPT-4', value: 'gpt-4', hint: 'SLOW' },
      { label: 'GPT-4 128K', value: 'gpt-4-1106-preview' }
    ]
  },
  vision: {
    desc: 'Chat with Images',
    models: [
      { label: 'GPT-4 Vision', value: 'gpt-4-vision-preview', hint: '100 RPD' }
    ]
  }
}

const CommandDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs text-muted-foreground', className)}
      {...props}
    />
  )
}

interface ModelSelectorProps {
  model: string
  setModel: (value: string) => void
}

export default function ModelSelector({ model, setModel }: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const findModelByValue = (model: string) => {
    // map over modelOptions and return the label
    for (const [groupName, groupValue] of Object.entries(modelOptions)) {
      const found = groupValue.models.find(option => option.value === model)
      if (found) {
        return { group: groupName, found }
      }
    }
    return null
  }
  const modelGroups = Object.entries(modelOptions)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="inline-flex h-8 w-[170px] items-center bg-background font-medium shadow"
        >
          <CubeIcon className="mr-2 h-4 w-4" />
          <span className="flex-1">
            {model ? findModelByValue(model)?.found?.label : 'Select model'}
          </span>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search model..." className="h-9" />
          <CommandEmpty>No model found.</CommandEmpty>
          {/* map over model option groups */}
          {modelGroups.map(([group, groupOptions]) => (
            <CommandGroup key={group} heading={groupOptions.desc}>
              {groupOptions.models.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={currentValue => {
                    setOpen(false)
                    if (currentValue !== model) {
                      setModel(currentValue)
                    }
                  }}
                >
                  {option.label}
                  <CommandDescription>
                    {option.hint ? option.hint : null}
                  </CommandDescription>
                  <IconCheck
                    className={cn(
                      'ml-2 h-4 w-4',
                      model !== option.value && 'hidden'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          {/* <CommandGroup>
            {modelOptions.map(option => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={currentValue => {
                  setOpen(false)
                  if (currentValue !== model) {
                    setModel(currentValue)
                  }
                }}
              >
                {option.label}
                <CommandDescription>
                  {option.hint ? option.hint : null}
                </CommandDescription>
                <IconCheck
                  className={cn(
                    'ml-2 h-4 w-4',
                    model !== option.value && 'hidden'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup> */}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
