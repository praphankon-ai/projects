export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  onClick,
  className = '',
  type = 'button',
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1'

  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400 disabled:bg-slate-200 disabled:text-slate-400',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-blue-400 disabled:opacity-50',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 disabled:opacity-50',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-blue-400 disabled:opacity-50',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-1.5',
    lg: 'px-6 py-3 text-base gap-2',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </button>
  )
}
