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

  useEffect(() => {
    displayRef.current = displayValue
  }, [displayValue])

  useEffect(() => {
    const animateTo = (target: number, ms: number) => {
      const from = displayRef.current
      let startTime: number | null = null
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / ms, 1)
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        const next = Math.floor(from + (target - from) * ease)
        displayRef.current = next
        setDisplayValue(next)
        if (progress < 1) requestAnimationFrame(step)
        else {
          displayRef.current = target
          setDisplayValue(target)
        }
      }
      requestAnimationFrame(step)
    }

    if (started.current) {
      animateTo(value, Math.min(duration, 900))
      return
    }

    const node = elementRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            animateTo(value, duration)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}
