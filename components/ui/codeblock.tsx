// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Markdown/CodeBlock.tsx

'use client'

import { FC, memo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { coldarkDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { IconCheck, IconCopy, IconDownload } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Props {
  language: string
  value: string
}

interface languageMap {
  [key: string]: string | undefined
}

export const programmingLanguages: languageMap = {
  javascript: '.js',
  python: '.py',
  java: '.java',
  c: '.c',
  cpp: '.cpp',
  'c++': '.cpp',
  'c#': '.cs',
  ruby: '.rb',
  php: '.php',
  swift: '.swift',
  'objective-c': '.m',
  kotlin: '.kt',
  typescript: '.ts',
  go: '.go',
  perl: '.pl',
  rust: '.rs',
  scala: '.scala',
  haskell: '.hs',
  lua: '.lua',
  shell: '.sh',
  sql: '.sql',
  html: '.html',
  css: '.css'
  // add more file extensions here, make sure the key is same as language prop in CodeBlock.tsx component
}

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXY3456789' // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return lowercase ? result.toLowerCase() : result
}

function preprocessCode(code: string) {
  let skippedLeadingEmptyLines = false
  let lastNonEmptyLineIndex = 0
  let minRawStringIndentation = Number.MAX_SAFE_INTEGER
  let numberOfRemovedLines = 0

  const processNonEmptyLine = (line: string, index: number) => {
    // keep track of the index of the last non-empty line
    lastNonEmptyLineIndex = index - numberOfRemovedLines
    // determine the minimum indentation level
    minRawStringIndentation = Math.min(
      minRawStringIndentation,
      Math.max(0, line.search(/\S/))
    )
    // return the processed line
    return [line.trimEnd()]
  }

  // split code into lines
  const codeLines = code.split('\n')

  // remove empty lines, and process non-empty lines
  const nonEmptyLinesAtStart = codeLines.flatMap((line, index) => {
    if (!skippedLeadingEmptyLines) {
      if (line.match(/^\s*$/)) {
        numberOfRemovedLines += 1
        return []
      }

      skippedLeadingEmptyLines = true
      return processNonEmptyLine(line, index)
    }

    if (line.match(/^\s*$/)) return ['']

    return processNonEmptyLine(line, index)
  })

  const nonEmptyLinesStartAndEnd = nonEmptyLinesAtStart.slice(
    0,
    lastNonEmptyLineIndex + 1
  )

  // If there are no non-empty lines, return an empty string
  if (nonEmptyLinesStartAndEnd.length === 0) return ''

  const nonRawStringIndentationLines =
    minRawStringIndentation !== 0
      ? nonEmptyLinesStartAndEnd.map(line =>
          line.substring(minRawStringIndentation)
        )
      : nonEmptyLinesStartAndEnd

  return nonRawStringIndentationLines.join('\n')
}

const customSyntaxHighlighter = (
  language: string,
  code: string,
  style: {
    [key: string]: React.CSSProperties
  },
  value: string
) => (
  <SyntaxHighlighter
    language={language}
    style={style}
    PreTag="div"
    showLineNumbers
    // wrapLongLines={true}
    customStyle={{
      margin: 0,
      width: '100%',
      background: 'transparent',
      padding: '0.5rem 0.5rem',
      lineHeight: '1.3'
    }}
    codeTagProps={{
      style: {
        fontSize: '0.8rem',
        fontFamily: 'var(--font-mono)'
      }
    }}
  >
    {value}
  </SyntaxHighlighter>
)

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const downloadAsFile = () => {
    if (typeof window === 'undefined') {
      return
    }
    const fileExtension = programmingLanguages[language] || '.file'
    const suggestedFileName = `file-${generateRandomString(
      3,
      true
    )}${fileExtension}`
    const fileName = window.prompt('Enter file name' || '', suggestedFileName)

    if (!fileName) {
      // User pressed cancel on prompt.
      return
    }

    const blob = new Blob([value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = fileName
    link.href = url
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(value)
  }

  return (
    <div className="codeblock relative w-full rounded-md bg-muted-foreground/10 font-sans">
      <div className="flex w-full h-8 items-center bg-muted-foreground/20 justify-between rounded-t-md px-6 py-0 pr-4 ">
        <span className="text-xs font-medium lowercase ">{language}</span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            className="h-7 w-7 hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
            onClick={downloadAsFile}
            size="icon"
          >
            <IconDownload />
            <span className="sr-only">Download</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
            onClick={onCopy}
          >
            {isCopied ? <IconCheck /> : <IconCopy />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      </div>
      <div className="block dark:hidden">
        {customSyntaxHighlighter(
          language,
          value,
          coldarkCold,
          preprocessCode(value)
        )}
      </div>

      <div className="hidden dark:block">
        {customSyntaxHighlighter(
          language,
          value,
          coldarkDark,
          preprocessCode(value)
        )}
      </div>
    </div>
  )
})
CodeBlock.displayName = 'CodeBlock'

export { CodeBlock }
