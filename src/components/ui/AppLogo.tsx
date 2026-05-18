type AppLogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-12',
  md: 'h-20',
  lg: 'h-28',
  xl: 'h-40',
}

export function AppLogo({
  size = 'md',
  showText = true,
  className = '',
}: AppLogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src="/brand/fleetrackr-logo.png"
        alt="Fleetrackr"
        className={`${sizeClasses[size]} w-auto object-contain`}
      />

      {showText && (
        <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3d32]">
          Smart Tracking for Modern Car Rentals
        </p>
      )}
    </div>
  )
}