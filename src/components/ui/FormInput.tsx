type FormInputProps = {
  label: string
  type?: string
  value: string
  placeholder?: string
  required?: boolean
  onChange: (value: string) => void
}

export function FormInput({
  label,
  type = 'text',
  value,
  placeholder,
  required,
  onChange,
}: FormInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#10231c]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
      />
    </label>
  )
}