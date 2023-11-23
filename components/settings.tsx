import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { GearIcon } from '@radix-ui/react-icons'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Slider } from './ui/slider'

export interface settingOptions {
  temperature: number
  jsonMode: boolean
}

export function Settings() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="">
          <GearIcon className="h-5 w-5" />
          <span className="ml-2 hidden md:flex">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[322px] sm:w-[500px]">
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
              <div className="grid flex-1 grid-cols-4 items-center gap-4">
                <Label htmlFor="temperature">Temperature</Label>
                <Slider
                  defaultValue={[0.7]}
                  max={2}
                  step={0.01}
                  className="col-span-3"
                  // onValueChange={}
                />
              </div>
              <span className="ml-3">null</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
