'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  glowColor?: string
  maxTilt?: number
  disableTilt?: boolean
}

export function TiltCard({
  children,
  className = '',
  glowColor = 'rgba(15, 118, 110, 0.12)',
  maxTilt = 4.5,
  disableTilt = false,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(1100px) rotateX(0deg) rotateY(0deg)')
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || disableTilt || reducedMotion) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const percentX = (x / rect.width) * 100
      const percentY = (y / rect.height) * 100
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = ((y - centerY) / centerY) * -maxTilt
      const rotateY = ((x - centerX) / centerX) * maxTilt

      setTransform(
        `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`
      )
      setSpotlight({ x: percentX, y: percentY, opacity: 1 })
    },
    [maxTilt, disableTilt, reducedMotion]
  )

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0)')
    setSpotlight((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: disableTilt || reducedMotion ? undefined : transform,
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        willChange: disableTilt || reducedMotion ? undefined : 'transform',
      }}
      className={`group relative overflow-hidden rounded-2xl panel ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-400"
        style={{
          opacity: spotlight.opacity * 0.9,
          background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, ${glowColor}, transparent 62%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-700/20 to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
