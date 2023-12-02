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
import { SettingsContext } from './settings'

interface groupOptions {
  desc: string
  models: Array<{ label: string; value: string; hint?: string }>
}

export const modelOptions: Record<string, groupOptions> = {
  chat: {
    desc: 'Chat',
    models: [
      { label: 'GPT-3.5 16k', value: 'gpt-3.5-turbo-1106', hint: 'Turbo' },
      // { label: 'GPT-3.5 16k', value: 'gpt-3.5-turbo-16k' },
      { label: 'GPT-4', value: 'gpt-4', hint: 'Legacy' },
      { label: 'GPT-4 128K', value: 'gpt-4-1106-preview', hint: 'Turbo' }
    ]
  },
  vision: {
    desc: 'Chat with Images',
    models: [{ label: 'GPT-4 Vision', value: 'gpt-4-vision-preview', hint: '' }]
  },
  image: {
    desc: 'Image Generation',
    models: [{ label: 'DALL-E 2', value: 'dall-e-2' }]
  }
}

export const findModelByValue = (model: string) => {
  // map over modelOptions and return the label
  for (const [groupName, groupValue] of Object.entries(modelOptions)) {
    const found = groupValue.models.find(option => option.value === model)
    if (found) {
      return { group: groupName, found }
    }
  }
  return null
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

export type ModelGroupType = keyof typeof modelOptions
export const modelValues = Object.values(modelOptions)
  .map(group => group.models.map(model => model.value))
  .flat()
export type ModelValueType = (typeof modelValues)[number]

interface ModelSelectorProps {
  model: string
  setModel: (value: string) => void
  disabled?: boolean
  modelTypes?: ModelGroupType[]
}

export default function ModelSelector({
  model,
  setModel,
  disabled,
  modelTypes
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const modelGroups =
    modelTypes && modelTypes.length > 0
      ? Object.entries(modelOptions).filter(([group]) =>
          modelTypes.includes(group as ModelGroupType)
        )
      : Object.entries(modelOptions)

  // if model does not belong to modelGroups, set it to the first model in filtered model option
  const { settings, setSettingsWrapper } = useContext(SettingsContext)
  // useEffect(() => {
  //   const valueExists = (value: string): boolean => {
  //     return modelGroups.some(([_, group]) =>
  //       group.models.some((model: any) => model.value === value)
  //     )
  //   }
  //   setSettingsWrapper({ currentChatModel: model })
  //   if (!valueExists(model)) {
  //     setSettingsWrapper({ currentChatModel: model })
  //     setModel(modelGroups[0][1].models[0].value)
  //   }
  // }, [model, modelGroups, setModel, setSettingsWrapper])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
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
