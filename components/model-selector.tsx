import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent
} from '@/components/ui/select'
import React, { useContext } from 'react'

// gpt-3.5-turbo-instruct
// gpt-3.5-turbo	160,000 TPM	5,000 RPM
// gpt-3.5-turbo-0301	160,000 TPM	5,000 RPM
// gpt-3.5-turbo-0613	160,000 TPM	5,000 RPM
// gpt-3.5-turbo-1106	160,000 TPM	5,000 RPM
// gpt-3.5-turbo-16k	180,000 TPM	5,000 RPM
// gpt-3.5-turbo-16k-0613	180,000 TPM	5,000 RPM
// gpt-3.5-turbo-instruct	250,000 TPM	3,000 RPM
// gpt-3.5-turbo-instruct-0914	250,000 TPM	3,000 RPM
// gpt-4	80,000 TPM	5,000 RPM
// gpt-4-0314	80,000 TPM	5,000 RPM
// gpt-4-0613	80,000 TPM	5,000 RPM
// gpt-4-1106-preview	40,000 TPM	20 RPM, 100 RPD
// gpt-4-vision-preview	40,000 TPM	20 RPM, 100 RPD
const modelOptions = [
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
  { label: 'GPT-3.5 Turbo 16k', value: 'gpt-3.5-turbo-16k' },
  { label: 'GPT-4', value: 'gpt-4' },
  { label: 'GPT-4 32K', value: 'gpt-4-32k' },
  { label: 'GPT-4 Turbo', value: 'gpt-4-1106-preview'},
  { label: 'GPT-4 Vision', value: 'gpt-4-vision-preview' },
]

export const ModelSelectionContext = React.createContext({
  model: 'GPT-4',
  setModelParams: (model: string) => {}
})

export function ModelSelectionProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [model, setModelSelection] = React.useState(modelOptions[0].value)

  const setModelParams = (model: string) => {
    setModelSelection(model)
  }

  return (
    <ModelSelectionContext.Provider value={{ model: model, setModelParams }}>
      {children}
    </ModelSelectionContext.Provider>
  )
}

export default function ModelSelector() {
  const { model, setModelParams } = useContext(ModelSelectionContext)

  return (
    <Select defaultValue={model} onValueChange={setModelParams}>
      <SelectTrigger className="w-[200px] mx-auto shadow">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {modelOptions.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="flex items-center"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
