import * as React from 'react'

export function useAtBottom(offset = 0) {
  const [isAtBottom, setIsAtBottom] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      // console.log(isAtBottom)
      // console.log((window.innerHeight+window.scrollY) / (document.body.offsetHeight - offset))
      setIsAtBottom(
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - offset
      )
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [offset])

  return isAtBottom
}
