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
  const [displayValue, setDisplayValue] = useState(0)
  const elementRef = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const displayRef = useRef(0)
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

    if (started.current) {
      animateTo(value, Math.min(duration, 900))
      return
    }

    const node = elementRef.current
    if (!node) return

    const start = () => {
      if (started.current) return
      started.current = true
      animateTo(value, duration)
    }

    // Already on-screen (common for header counters) — don't wait forever on IO.
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
