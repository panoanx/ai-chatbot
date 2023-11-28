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
import React from 'react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { Switch } from './ui/switch'

interface settingsOptions {
  temperature: number
  jsonMode: boolean
}
export interface settingsContextProps {
  settings: settingsOptions
  setSettingsByKey: (key: string, value: any) => void
}

const settingsContext = React.createContext<settingsContextProps>({
  settings: {
    temperature: 0.7,
    jsonMode: false
  },
  setSettingsByKey: (key: string, value: any) => {}
})

export function SettingsContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [settings, setSettings] = useLocalStorage('settings', {
    temperature: 0.7,
    jsonMode: false
  })

  const setSettingsByKey = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <settingsContext.Provider value={{ settings, setSettingsByKey }}>
      {children}
    </settingsContext.Provider>
  )
}

export function Settings() {
  const {
    settings: { temperature, jsonMode },
    setSettingsByKey
  } = React.useContext(settingsContext)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="">
          <GearIcon className="h-5 w-5" />
          <span className="ml-2 hidden md:flex">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Chat</h4>
            <p className="text-sm text-muted-foreground">
              Configure the chat settings.
            </p>
          </div>
          <div className="grid gap-2">
            {/* <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="systemPrompt">Sys<span className='hidden sm:inline'>tem</span> Prompt</Label>
                  <Input
                    id="systemPrompt"
                    defaultValue=""
                    className="col-span-2 h-8"
                  />
                </div> */}
            <div className="inline-flex">
              <div className="grid flex-1 grid-cols-3 items-center gap-4">
                <Label htmlFor="temperature">Temperature</Label>
                <Slider
                  defaultValue={[temperature]}
                  max={2}
                  step={0.01}
                  className="col-span-2"
                  onValueChange={([temperature]) =>
                    setSettingsByKey('temperature', temperature)
                  }
                />
              </div>
              <div className="ml-2 font-mono">{temperature.toFixed(2)}</div>
            </div>
            <div className="flex items-center">
              <div className="">
                <Label htmlFor="jsonMode" className="">
                  JSON Mode
                </Label>
                <Switch
                  id="jsonMode"
                  checked={jsonMode}
                  onCheckedChange={() =>
                    setSettingsByKey('jsonMode', !jsonMode)
                  }
                  className="ml-auto"
                />
              </div>
              <div className="">test</div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
