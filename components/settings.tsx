'use client'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { GearIcon } from '@radix-ui/react-icons'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import React, { useEffect } from 'react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { Switch } from './ui/switch'
import { ChatRequestOptions } from 'ai'

export interface SettingsOptions {
  temperature: number
  topP: number
  jsonMode: boolean
}

interface SettingsContextProps {
  settings: SettingsOptions
  setSettingsWrapper: (kv: Partial<SettingsOptions>) => void
}

const defaultSettings: SettingsOptions = {
  temperature: 0.7,
  topP: 1,
  jsonMode: false
}

export const SettingsContext = React.createContext<SettingsContextProps>({
  settings: defaultSettings,
  setSettingsWrapper: () => {}
})

export function SettingsContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [settings, setSettings] = useLocalStorage('settings', defaultSettings)

  const setSettingsWrapper = (kv: Partial<SettingsOptions>) => {
    setSettings({ ...settings, ...kv })
  }

  return (
    <SettingsContext.Provider value={{ settings, setSettingsWrapper }}>
      {children}
    </SettingsContext.Provider>
  )
}

function SwitchSetting({
  value,
  label,
  description,
  onCheckedChange
}: {
  value: boolean
  label: string
  description: string
  onCheckedChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <Label className="flex flex-col space-y-1">
        <span>{label}</span>
        <span className=" text-xs text-muted-foreground">{description}</span>
      </Label>
      <Switch
        id={label}
        checked={value}
        onCheckedChange={onCheckedChange}
        className="ml-auto"
      />
    </div>
  )
}

function SliderSetting({
  value,
  min,
  max,
  label,
  description,
  onValueChange
}: {
  value: number
  min?: number
  max?: number
  label: string
  description?: string
  onValueChange: (value: number) => void
}) {
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <Label className="w-48">{label}</Label>
        <Slider
          min={min}
          max={max}
          value={[value]}
          step={0.01}
          onValueChange={([value]) => onValueChange(value)}
          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          aria-label="Temperature"
        />

        <span className="ml-2 w-12 rounded-md border border-transparent px-2 py-0.5 text-right font-mono text-sm text-muted-foreground hover:border-border">
          {value.toFixed(2)}
        </span>
      </div>
      <span className="text-xs leading-snug text-muted-foreground">
        {description}
      </span>
    </div>
  )
}

export function Settings() {
  const {
    settings: { temperature, topP, jsonMode },
    setSettingsWrapper
  } = React.useContext(SettingsContext)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="">
          <GearIcon className="h-5 w-5" />
          <span className="ml-2 hidden md:flex">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] sm:w-[410px]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Chat</h4>
            <p className="text-sm text-muted-foreground">
              Configure the chat settings.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex flex-col">
              <SliderSetting
                key="temperature"
                value={temperature}
                max={1}
                label="Temperature"
                onValueChange={temperature => {
                  setSettingsWrapper({
                    temperature: temperature,
                    topP: defaultSettings.topP
                  })
                }}
              />
              <SliderSetting
                key="topP"
                value={topP}
                max={1}
                label="Top P"
                onValueChange={topP => {
                  setSettingsWrapper({
                    topP: topP,
                    temperature: defaultSettings.temperature
                  })
                }}
              />
              <span className="text-xs font-medium leading-snug text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Set either the temperature (default 0.7, range 0-2) for
                randomness or top_p (default 1) for nucleus sampling, not both.
              </span>
            </div>

            <SwitchSetting
              key="jsonMode"
              value={jsonMode}
              onCheckedChange={() =>
                setSettingsWrapper({ jsonMode: !jsonMode })
              }
              label="Json Mode"
              description="Ensure output is valid JSON. Works only with turbo models."
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
