import Link from "next/link";

/**
 * Reusable Button component matching the Kent Commodities design system.
 * Supports rendering as a Link (when `href` is provided) or native `<button>`.
 *
 * @param {Object} props
 * @param {'primary' | 'outline' | 'dark' | 'white'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {boolean} [props.showArrow=true]
 * @param {string} [props.href]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 * @param {React.ReactNode} [props.icon]
 */
export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  showArrow = true,
  icon,
  className = "",
  onClick,
  ...props
}) {
  const baseStyles =
    "group inline-flex items-center justify-between font-medium rounded-full transition-all duration-200 active:scale-95";

  const sizeStyles = {
    sm: "pl-4 pr-1.5 py-1 text-xs gap-2",
    md: "pl-5 pr-2 py-1.5 text-sm gap-3",
    lg: "pl-6 pr-2.5 py-2 text-base gap-4",
  };

  const iconSizeStyles = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-8 h-8",
  };

  const arrowSvgSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-4.5 h-4.5",
  };

  const variantStyles = {
    primary: "bg-[#567425] hover:bg-[#48631f] text-white shadow-xs hover:shadow-md",
    outline:
      "border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white backdrop-blur-xs",
    dark: "bg-gray-900 hover:bg-black text-white shadow-xs hover:shadow-md",
    white: "bg-white hover:bg-gray-100 text-gray-900 shadow-xs hover:shadow-md",
  };

  const iconBgStyles = {
    primary: "bg-white text-[#567425]",
    outline: "bg-white/10 text-white group-hover:bg-white group-hover:text-[#567425]",
    dark: "bg-white text-gray-900",
    white: "bg-[#567425] text-white",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim();

  const renderIcon = () => {
    if (icon) return icon;
    if (!showArrow) return null;

    return (
      <span
        className={`${iconSizeStyles[size]} ${iconBgStyles[variant]} rounded-full flex items-center justify-center shrink-0 shadow-xs overflow-hidden`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${arrowSvgSize[size]} transition-transform duration-300 ease-out group-hover:rotate-45`}
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </span>
    );
  };

  const content = (
    <>
      <span className="leading-none">{children}</span>
      {renderIcon()}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses} onClick={onClick} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={combinedClasses} onClick={onClick} {...props}>
      {content}
    </button>
  );
}
