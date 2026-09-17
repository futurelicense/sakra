'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 1800,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedCounterProps) {
  // Start at the real value so SSR / first paint never flash "0+"
  const [displayValue, setDisplayValue] = useState(value)
  const elementRef = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const displayRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    displayRef.current = displayValue
  }, [displayValue])

  useEffect(() => {
    const animateTo = (target: number, ms: number) => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      const from = displayRef.current
      if (from === target) {
        setDisplayValue(target)
        return
      }
      let startTime: number | null = null
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / ms, 1)
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        const next = Math.floor(from + (target - from) * ease)
        displayRef.current = next
        setDisplayValue(next)
        if (progress < 1) rafRef.current = requestAnimationFrame(step)
        else {
          displayRef.current = target
          setDisplayValue(target)
          rafRef.current = null
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }

    // After first paint, animate only when the live value increases.
    if (started.current) {
      animateTo(value, Math.min(duration, 900))
      return
    }

    const node = elementRef.current
    if (!node) {
      setDisplayValue(value)
      displayRef.current = value
      return
    }

    const start = () => {
      if (started.current) return
      started.current = true
      // Count up from ~70% of target so the number never regresses to 0.
      const from = Math.max(0, Math.floor(value * 0.7))
      displayRef.current = from
      setDisplayValue(from)
      animateTo(value, duration)
    }

    const rect = node.getBoundingClientRect()
    const inView = rect.top < window.innerHeight && rect.bottom > 0
    if (inView) {
      start()
      return () => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}
