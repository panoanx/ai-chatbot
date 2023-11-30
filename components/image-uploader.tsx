import {
  GearIcon,
  ImageIcon,
  MinusCircledIcon,
  MinusIcon,
  PlusCircledIcon,
  PlusIcon
} from '@radix-ui/react-icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import { useCallback, useState } from 'react'
import { IconPlus } from './ui/icons'
import { Separator } from '@radix-ui/react-dropdown-menu'
import toast from 'react-hot-toast'
import assert from 'assert'
import { set } from 'react-hook-form'
import { convertFileToBase64 } from '@/lib/file'

const isValidUrl = (urlString: string) => {
  try {
    const url = new URL(urlString)
    assert(url.protocol === 'http:' || url.protocol === 'https:')
    return true
  } catch (err) {
    return false
  }
}

function DynamicInputUrls({
  externalImageUrls,
  setExternalImageUrls,
  onSave
}: {
  externalImageUrls: string[]
  setExternalImageUrls: (externalImageUrls: string[]) => void
  onSave: () => void
}) {
  const handleAddClick = useCallback(() => {
    setExternalImageUrls([...externalImageUrls, '']) // Add an empty string as a new URL placeholder
  }, [externalImageUrls, setExternalImageUrls])

  const handleDelClick = useCallback(() => {
    if (externalImageUrls.length > 1) {
      setExternalImageUrls(externalImageUrls.slice(0, -1))
    }
  }, [externalImageUrls, setExternalImageUrls])

  const handleInputChange = useCallback(
    (index: number, newValue: string) => {
      const newImageLinks = [...externalImageUrls]
      newImageLinks[index] = newValue
      setExternalImageUrls(newImageLinks)
    },
    [externalImageUrls, setExternalImageUrls]
  )

  return (
    <div>
      <div className="space-y-1">
        {externalImageUrls.map((url, index) => (
          <div key={index}>
            <Input
              type="url"
              placeholder="Accessible Image URL"
              value={url}
              onChange={e => {
                handleInputChange(index, e.target.value)
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-5 items-center">
        <div id="url-counter">
          <Button
            size="sm"
            variant="ghost"
            className={cn('h-7 w-7 rounded-full bg-background p-0 sm:left-4')}
            asChild
          >
            <MinusIcon
              className="h-4 w-4 p-1.5"
              onDoubleClick={e => {
                e.preventDefault()
              }}
              onClick={handleDelClick}
            />
          </Button>
          <span className="w-6 text-center text-sm">
            {externalImageUrls.length}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className={cn('h-7 w-7 rounded-full bg-background p-0 sm:left-4')}
            asChild
          >
            <PlusIcon
              className="h-4 w-4 p-1.5"
              onClick={e => {
                e.preventDefault()
                handleAddClick()
              }}
            />
          </Button>
        </div>
        <div className="ml-auto">
          <Button
            size="sm"
            type="submit"
            onClick={onSave}
            className={cn('ml-2 h-6')}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ImageUploader({
  imageUrls,
  setImageUrls
}: {
  imageUrls: string[]
  setImageUrls: (imageUrls: string[]) => void
}) {
  const [externalImageUrls, setExternalImageUrls] = useState([''])
  const [popoverOpen, setPopoverOpen] = useState(false)

  const onSaveExternalLinks = useCallback(() => {
    // check and warning
    const invalidImageUrls = externalImageUrls.filter(url => !isValidUrl(url))
    if (invalidImageUrls.length > 0) {
      toast.error(
        `Invalid image URL${
          invalidImageUrls.length > 1 ? 's' : ''
        }: ${invalidImageUrls.join(', ')}`
      )
      return
    }
    setExternalImageUrls([''])
    setImageUrls([...imageUrls, ...externalImageUrls])
    setPopoverOpen(false)
  }, [imageUrls, externalImageUrls, setImageUrls])

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={cn(
            'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
          )}
        >
          <ImageIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top">
        <div className="my-1 grid gap-6">
          <div className="grid gap-2">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Image Links</h4>
              <p className="text-sm text-muted-foreground">
                Enter accessible image URLs.
              </p>
            </div>
            <DynamicInputUrls
              externalImageUrls={externalImageUrls}
              setExternalImageUrls={setExternalImageUrls}
              onSave={onSaveExternalLinks}
            />
          </div>
          <div className="grid gap-1">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Upload from Device</h4>
              <p className="text-sm text-muted-foreground">
                Accept .png, .jpg, .jpeg images.
              </p>
            </div>
            <Input
              type="file"
              accept=".png, .jpg, .jpeg"
              multiple
              className="items-center hover:bg-muted"
              onChange={async e => {
                if (e.target.files) {
                  const files = Array.from(e.target.files)
                  const base64Strings = await Promise.all(
                    files.map(file => convertFileToBase64(file))
                  )
                  setImageUrls([...imageUrls, ...base64Strings])
                }
                setPopoverOpen(false)
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
