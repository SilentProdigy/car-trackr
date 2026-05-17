import { useState } from 'react'
import type React from 'react'
import { X } from 'lucide-react'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import type {
  Car,
  MaintenanceFormData,
  MaintenanceStatus,
} from '../../types/database'

type AddMaintenanceFormProps = {
  cars: Car[]
  onSubmit: (
    formData: MaintenanceFormData,
    receiptFile?: File | null,
  ) => Promise<void>
  onClose: () => void
}

const initialFormData: MaintenanceFormData = {
  car_id: '',
  maintenance_type: 'Oil Change',
  description: '',
  cost: '',
  service_date: new Date().toISOString().slice(0, 10),
  next_service_date: '',
  status: 'scheduled',
}

export function AddMaintenanceForm({
  cars,
  onSubmit,
  onClose,
}: AddMaintenanceFormProps) {
  const [formData, setFormData] = useState<MaintenanceFormData>(initialFormData)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField<K extends keyof MaintenanceFormData>(
    key: K,
    value: MaintenanceFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.car_id) {
      setErrorMessage('Please select a car.')
      return
    }

    setErrorMessage('')
    setLoading(true)

    try {
      await onSubmit(formData, receiptFile)
      setFormData(initialFormData)
      setReceiptFile(null)
      onClose()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to save maintenance record.'
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
              Add Maintenance
            </h2>
            <p className="text-xs text-gray-500">
              Track car service, repairs, and next schedule.
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

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Car
              </span>

              <select
                value={formData.car_id}
                onChange={(event) => updateField('car_id', event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              >
                <option value="">Select car</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.car_name} — {car.plate_number}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Maintenance type
              </span>

              <select
                value={formData.maintenance_type}
                onChange={(event) =>
                  updateField('maintenance_type', event.target.value)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              >
                <option value="Oil Change">Oil Change</option>
                <option value="Engine Check">Engine Check</option>
                <option value="Tire Replacement">Tire Replacement</option>
                <option value="Battery Replacement">Battery Replacement</option>
                <option value="Brake Service">Brake Service</option>
                <option value="Car Wash">Car Wash</option>
                <option value="Repair">Repair</option>
                <option value="General Maintenance">General Maintenance</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Cost
                </span>

                <input
                  type="number"
                  value={formData.cost}
                  placeholder="1500"
                  onChange={(event) => updateField('cost', event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Status
                </span>

                <select
                  value={formData.status}
                  onChange={(event) =>
                    updateField('status', event.target.value as MaintenanceStatus)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Service date
                </span>

                <input
                  type="date"
                  value={formData.service_date}
                  onChange={(event) =>
                    updateField('service_date', event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Next service
                </span>

                <input
                  type="date"
                  value={formData.next_service_date}
                  onChange={(event) =>
                    updateField('next_service_date', event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Receipt / file upload
              </span>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(event) =>
                  setReceiptFile(event.target.files?.[0] ?? null)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Description
              </span>

              <textarea
                value={formData.description}
                placeholder="Work done, repair details, recommendations..."
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                className="min-h-24 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              />
            </label>
          </div>

          <div className="sticky bottom-0 mt-6 bg-white pb-1 pt-4">
            <PrimaryButton type="submit" loading={loading}>
              Save Maintenance
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  )
}