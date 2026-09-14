interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  className?: string
}

export function SectionHeader({ eyebrow, title, description, className = '' }: SectionHeaderProps) {
  return (
    <header className={`mb-8 md:mb-10 max-w-3xl ${className}`}>
      <span className="eyebrow inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-3xl md:text-[2.35rem] font-bold leading-[1.15] tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-3.5 text-base md:text-lg leading-relaxed text-muted max-w-2xl">
          {description}
        </p>
      )}
    </header>
  )
}
