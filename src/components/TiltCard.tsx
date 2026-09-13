'use client'

import React, { useRef, useState, useCallback } from 'react'

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  glowColor?: string
  maxTilt?: number
}

export function TiltCard({
  children,
  className = '',
  glowColor = 'rgba(56, 189, 248, 0.15)',
  maxTilt = 6,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)')
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
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
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`
      )
      setSpotlight({ x: percentX, y: percentY, opacity: 1 })
    },
    [maxTilt]
  )

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setSpotlight((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
      }}
      className={`group relative overflow-hidden rounded-2xl panel p-6 hover:panel-glow ${className}`}
      {...props}
    >
      {/* Interactive cursor tracking spotlight glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, ${glowColor}, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* Tilt card inner content */}
      <div className="relative z-10 transition-transform duration-200">
        {children}
      </div>
    </div>
  )
}
