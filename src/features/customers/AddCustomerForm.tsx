import { useEffect, useState } from 'react'
import type React from 'react'
import { FileText, X } from 'lucide-react'
import { FormInput } from '../../components/ui/FormInput'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import type { Customer, CustomerFormData } from '../../types/database'

type AddCustomerFormProps = {
  customer?: Customer | null
  onSubmit: (
    formData: CustomerFormData,
    validIdFile?: File | null,
    driverLicenseFile?: File | null,
  ) => Promise<void>
  onClose: () => void
}

function mapCustomerToFormData(customer: Customer): CustomerFormData {
  return {
    full_name: customer.full_name ?? '',
    phone: customer.phone ?? '',
    email: customer.email ?? '',
    address: customer.address ?? '',
    emergency_contact: customer.emergency_contact ?? '',
    notes: customer.notes ?? '',
  }
}

const initialFormData: CustomerFormData = {
  full_name: '',
  phone: '',
  email: '',
  address: '',
  emergency_contact: '',
  notes: '',
}

export function AddCustomerForm({ customer,onSubmit, onClose }: AddCustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData)
  const [validIdFile, setValidIdFile] = useState<File | null>(null)
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const isEditMode = Boolean(customer)

  useEffect(() => {
    if (customer) {
      setFormData(mapCustomerToFormData(customer))
    }
  }, [customer])

  function updateField<K extends keyof CustomerFormData>(
    key: K,
    value: CustomerFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.full_name.trim()) {
      setErrorMessage('Customer name is required.')
      return
    }

    setErrorMessage('')
    setLoading(true)

    try {
      await onSubmit(formData, validIdFile, driverLicenseFile)
      setFormData(initialFormData)
      setValidIdFile(null)
      setDriverLicenseFile(null)
      onClose()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create customer.'
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 px-4 py-6">
      <div className="mx-auto flex h-full max-w-md flex-col rounded-[2rem] bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#10231c]">
              {isEditMode ? 'Edit Customer' : 'Add Customer'}
            </h2>
            <p className="text-xs text-gray-500">
              {isEditMode
                ? 'Update renter details and documents.'
                : 'Save renter details and documents.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {errorMessage && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <FormInput
              label="Full name"
              value={formData.full_name}
              required
              placeholder="Juan Dela Cruz"
              onChange={(value) => updateField('full_name', value)}
            />

            <FormInput
              label="Phone number"
              value={formData.phone}
              placeholder="09XX XXX XXXX"
              onChange={(value) => updateField('phone', value)}
            />

            <FormInput
              label="Email address"
              type="email"
              value={formData.email}
              placeholder="customer@example.com"
              onChange={(value) => updateField('email', value)}
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Address
              </span>

              <textarea
                value={formData.address}
                placeholder="Complete address"
                onChange={(event) => updateField('address', event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              />
            </label>

            <FormInput
              label="Emergency contact"
              value={formData.emergency_contact}
              placeholder="Name / phone number"
              onChange={(value) => updateField('emergency_contact', value)}
            />

            {customer?.valid_id_url && (
            <a
              href={customer.valid_id_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#e8f0ec] px-4 py-3 text-sm font-bold text-[#1f3d32]"
            >
              <FileText size={16} />
              View Current Valid ID
            </a>
          )}

          {customer?.driver_license_url && (
            <a
              href={customer.driver_license_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#e8f0ec] px-4 py-3 text-sm font-bold text-[#1f3d32]"
            >
              <FileText size={16} />
              View Current Driver’s License
            </a>
          )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Valid ID upload
              </span>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(event) =>
                  setValidIdFile(event.target.files?.[0] ?? null)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Driver’s license upload
              </span>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(event) =>
                  setDriverLicenseFile(event.target.files?.[0] ?? null)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Notes
              </span>

              <textarea
                value={formData.notes}
                placeholder="Optional notes"
                onChange={(event) => updateField('notes', event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              />
            </label>
          </div>

          <div className="sticky bottom-0 mt-6 bg-white pb-1 pt-4">
            <PrimaryButton type="submit" loading={loading}>
              {isEditMode ? 'Save Changes' : 'Save Customer'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  )
}