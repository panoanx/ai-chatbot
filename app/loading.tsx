import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-6 w-[160px]" />
        <Skeleton className="h-6 w-[160px]" />
        <Skeleton className="h-6 w-[160px]" />
      </div>
    </div>
  )
}
