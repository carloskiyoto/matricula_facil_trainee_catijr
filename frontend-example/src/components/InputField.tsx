import { ReactNode } from 'react'

interface InputFieldProps {
  label?: string
  icon?: ReactNode
  rightIcon?: ReactNode
  rightElement?: ReactNode
  type?: string
  placeholder?: string
}

export default function InputField({ label, icon, rightIcon, rightElement, type = 'text', placeholder }: InputFieldProps) {
  const withLeftIcon = Boolean(icon)

  const inputClasses = [
    'w-full bg-white border rounded-lg text-base text-ui-dark outline-none transition-colors',
    withLeftIcon
      ? 'pl-[45px] py-[11px] border-ui-border placeholder:text-ui-muted focus:border-brand-primary'
      : 'pl-[17px] py-[15px] border-[rgba(199,196,216,0.6)] shadow-sm placeholder:text-[rgba(199,196,216,0.8)] focus:border-brand-accent',
    rightIcon ? 'pr-[50px]' : 'pr-[17px]',
  ].join(' ')

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {(label || rightElement) && (
        <div className="flex items-center justify-between w-full">
          {label && (
            <label className="font-medium text-[13px] text-ui-medium leading-[18px]">
              {label}
            </label>
          )}
          {rightElement && (
            <span className="font-semibold text-xs text-brand-primary leading-4 cursor-pointer hover:underline">
              {rightElement}
            </span>
          )}
        </div>
      )}

      <div className="relative w-full">
        {withLeftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={inputClasses}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  )
}
