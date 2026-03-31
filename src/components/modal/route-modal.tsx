'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

interface RouteModalProps {
  children: React.ReactNode
  title: string
  itemId: string
  fullPageHref: string
  onPrev?: () => void
  onNext?: () => void
  hasPrev?: boolean
  hasNext?: boolean
}

export function RouteModal({
  children,
  title,
  itemId,
  fullPageHref,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: RouteModalProps) {
  const router = useRouter()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) {
        e.preventDefault()
        onPrev()
      }
      if (e.key === 'ArrowRight' && hasNext && onNext) {
        e.preventDefault()
        onNext()
      }
    },
    [hasPrev, hasNext, onPrev, onNext],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full p-0 gap-0 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3 shrink-0">
          <DialogTitle className="text-base font-semibold truncate pr-4">{title}</DialogTitle>
          <div className="flex items-center gap-1 shrink-0">
            {hasPrev && (
              <Button variant="ghost" size="icon" onClick={onPrev} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {hasNext && (
              <Button variant="ghost" size="icon" onClick={onNext} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Body — keyed fade on content swap */}
        <div key={itemId} className="flex-1 overflow-y-auto p-5 animate-in fade-in-0 duration-150">
          {children}
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-3 shrink-0">
          <Link
            href={fullPageHref}
            onClick={(e) => { e.preventDefault(); window.location.href = fullPageHref }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Bekijk volledige pagina
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
