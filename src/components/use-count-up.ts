import { animate } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'

/** Counts from 0 to `target`; `skip()` jumps straight to the end. */
export function useCountUp(target: number) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const controls = animate(0, target, { duration: 0.9, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [target])
  const skip = useCallback(() => setValue(target), [target])
  return [value, skip] as const
}
