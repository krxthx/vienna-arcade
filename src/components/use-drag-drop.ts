import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { ComponentId } from '../types'

export type DragSource = { id: ComponentId; from: 'palette' } | { id: ComponentId; from: 'slot'; index: number }

export interface DragState {
  id: ComponentId
  x: number
  y: number
  overSlot: number | null
}

interface Handlers {
  onDropSlot: (source: DragSource, slot: number) => void
  onDropPalette: (source: DragSource) => void
}

const DRAG_THRESHOLD = 8

function slotAt(x: number, y: number): number | null {
  const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-slot]')
  return el ? Number(el.dataset.slot) : null
}

/**
 * Pointer-based drag and drop that works for mouse, pen and touch.
 * A press that never moves past the threshold is treated as a normal click.
 */
export function useDragDrop(handlers: Handlers) {
  const [drag, setDrag] = useState<DragState | null>(null)
  const handlersRef = useRef(handlers)
  const cleanupRef = useRef<(() => void) | null>(null)
  const suppressClick = useRef(false)

  useEffect(() => {
    handlersRef.current = handlers
  })
  useEffect(() => () => cleanupRef.current?.(), [])

  const startDrag = useCallback((e: ReactPointerEvent, source: DragSource) => {
    if (e.button !== 0) return
    cleanupRef.current?.()
    const origin = { x: e.clientX, y: e.clientY }
    let active = false

    const move = (ev: PointerEvent) => {
      if (!active && Math.hypot(ev.clientX - origin.x, ev.clientY - origin.y) > DRAG_THRESHOLD) active = true
      if (active) setDrag({ id: source.id, x: ev.clientX, y: ev.clientY, overSlot: slotAt(ev.clientX, ev.clientY) })
    }
    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
      cleanupRef.current = null
      setDrag(null)
    }
    const up = (ev: PointerEvent) => {
      stop()
      if (!active) return
      suppressClick.current = true
      setTimeout(() => (suppressClick.current = false), 0)
      const slot = slotAt(ev.clientX, ev.clientY)
      if (slot !== null) handlersRef.current.onDropSlot(source, slot)
      else if (source.from === 'slot') handlersRef.current.onDropPalette(source)
    }
    const cancel = () => stop()

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    cleanupRef.current = stop
  }, [])

  /** True right after a drag finished, so the trailing click can be ignored. */
  const wasDragged = useCallback(() => suppressClick.current, [])

  return { drag, startDrag, wasDragged }
}
