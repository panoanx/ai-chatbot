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
import ModelSelector, { ModelValueType } from './model-selector'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const dalle2Sizes = ['256x256', '512x512', '1024x1024']
const dalle3Sizes = ['1024x1024', '1792x1024', '1024x1792']

export interface SettingsOptions {
  temperature: number
  topP: number
  jsonMode: boolean
  defaultModel: ModelValueType
  currentChatModel: ModelValueType
  imgSize: {
    // 'dall-e-2': '256x256' | '512x512' | '1024x1024'
    // 'dall-e-3': '1024x1024' | '1792x1024' | '1024x1792'
    'dall-e-2': string
    'dall-e-3': string
  }
  imgNum: 1 | 2 | 3 | 4
}

interface SettingsContextProps {
  settings: SettingsOptions
  setSettingsWrapper: (kv: Partial<SettingsOptions>) => void
}

const defaultSettings: SettingsOptions = {
  temperature: 0.7,
  topP: 1,
  jsonMode: false,
  defaultModel: 'gpt-3.5-turbo-16k',
  currentChatModel: 'gpt-3.5-turbo-16k',
  imgSize: {
    'dall-e-2': dalle2Sizes[0],
    'dall-e-3': dalle3Sizes[0]
  },
  imgNum: 1
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

function ImageSizeSelector({
  defaultValue,
  values,
  onValueChange
}: {
  defaultValue: string
  values: string[]
  onValueChange: (value: string) => void
}) {
  return (
    <Tabs
      defaultValue={defaultValue}
      className="w-4/5"
      onValueChange={onValueChange}
    >
      <TabsList className="grid w-full grid-cols-3">
        {values.map((value, index) => (
          <TabsTrigger key={index} value={value}>
            {value}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
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

export function Settings({ className }: { className?: string }) {
  const { settings, setSettingsWrapper } = React.useContext(SettingsContext)
  const { temperature, topP, jsonMode, defaultModel, imgSize, imgNum } =
    settings

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="">
          <GearIcon className="h-5 w-5" />
          <span className="ml-2 hidden md:flex">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[350px] sm:w-[410px]', className)}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Chat</h4>
            <p className="text-sm text-muted-foreground">
              Configure the chat settings.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label className="flex flex-col space-y-1">
                <span>Default Model</span>
                <span className=" text-xs text-muted-foreground">
                  Model for initiating a new chat.
                </span>
              </Label>
              <ModelSelector
                model={defaultModel}
                setModel={value => {
                  setSettingsWrapper({ defaultModel: value })
                }}
              />
            </div>
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
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Image Generation</h4>
            <p className="text-sm text-muted-foreground"></p>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label className="flex flex-col space-y-1">
                <span>Image Size</span>
                <span className=" text-xs text-muted-foreground">
                  Size of the generated image.
                </span>
              </Label>
            </div>
            <div className="align-center flex items-center justify-between">
              <Label className="text-center font-medium leading-none">
                <span>DALL·E 2</span>
              </Label>
              <ImageSizeSelector
                  defaultValue={imgSize['dall-e-2']}
                  values={dalle2Sizes}
                  onValueChange={(value: string) => {
                    setSettingsWrapper({
                      imgSize: {...imgSize, 'dall-e-2': value}
                    })
                  }}
              />
            </div>
            <div className="align-center flex items-center justify-between">
              <Label className="text-center font-medium leading-none">
                <span>DALL·E 3</span>
              </Label>
              <ImageSizeSelector
                  defaultValue={imgSize['dall-e-3']}
                  values={dalle3Sizes}
                  onValueChange={(value: string) => {
                    setSettingsWrapper({
                      imgSize: {...imgSize, 'dall-e-3': value}
                    })
                  }}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
