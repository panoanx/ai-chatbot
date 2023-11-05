import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent
} from '@/components/ui/select'

const modelOptions = [
  { label: 'GPT-4', value: 'gpt-4' },
]

export default function ModelSelector() {
  return (
    <Select defaultValue="gpt-4">
      <SelectTrigger className="w-[110px] mx-auto shadow">
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
