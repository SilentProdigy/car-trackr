import { useEffect, useState } from 'react'
import type React from 'react'
import { X } from 'lucide-react'
import { FormInput } from '../../components/ui/FormInput'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import type { Car, CarFormData, CarStatus } from '../../types/database'

type AddCarFormProps = {
  car?: Car | null
  onSubmit: (formData: CarFormData, photoFile?: File | null) => Promise<void>
  onClose: () => void
}

const initialFormData: CarFormData = {
  car_name: '',
  brand: '',
  model: '',
  plate_number: '',
  year: '',
  transmission: '',
  fuel_type: '',
  seats: '',
  daily_rate: '',
  status: 'available',
  notes: '',
}

function mapCarToFormData(car: Car): CarFormData {
  return {
    car_name: car.car_name ?? '',
    brand: car.brand ?? '',
    model: car.model ?? '',
    plate_number: car.plate_number ?? '',
    year: car.year ? String(car.year) : '',
    transmission: car.transmission ?? '',
    fuel_type: car.fuel_type ?? '',
    seats: car.seats ? String(car.seats) : '',
    daily_rate: car.daily_rate ? String(car.daily_rate) : '',
    status: car.status,
    notes: car.notes ?? '',
  }
}

export function AddCarForm({ car, onSubmit, onClose }: AddCarFormProps) {
  const isEditMode = Boolean(car)

  const [formData, setFormData] = useState<CarFormData>(initialFormData)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (car) {
      setFormData(mapCarToFormData(car))
    }
  }, [car])

  function updateField<K extends keyof CarFormData>(
    key: K,
    value: CarFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.car_name.trim()) {
      setErrorMessage('Car name is required.')
      return
    }

    if (!formData.plate_number.trim()) {
      setErrorMessage('Plate number is required.')
      return
    }

    setErrorMessage('')
    setLoading(true)

    try {
      await onSubmit(formData, photoFile)
      setFormData(initialFormData)
      setPhotoFile(null)
      onClose()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save car.'
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
              {isEditMode ? 'Edit Car' : 'Add Car'}
            </h2>
            <p className="text-xs text-gray-500">
              {isEditMode
                ? 'Update vehicle details.'
                : 'Add a vehicle to your rental fleet.'}
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

            {car?.photo_url && (
              <div className="overflow-hidden rounded-2xl bg-[#e8f0ec]">
                <img
                  src={car.photo_url}
                  alt={car.car_name}
                  className="h-40 w-full object-cover"
                />
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                {isEditMode ? 'Replace car photo' : 'Car photo'}
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setPhotoFile(event.target.files?.[0] ?? null)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />
            </label>

            <FormInput
              label="Car name"
              value={formData.car_name}
              required
              placeholder="Toyota Vios 2022"
              onChange={(value) => updateField('car_name', value)}
            />

            <FormInput
              label="Brand"
              value={formData.brand}
              placeholder="Toyota"
              onChange={(value) => updateField('brand', value)}
            />

            <FormInput
              label="Model"
              value={formData.model}
              placeholder="Vios"
              onChange={(value) => updateField('model', value)}
            />

            <FormInput
              label="Plate number"
              value={formData.plate_number}
              required
              placeholder="ABC 1234"
              onChange={(value) => updateField('plate_number', value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Year"
                type="number"
                value={formData.year}
                placeholder="2022"
                onChange={(value) => updateField('year', value)}
              />

              <FormInput
                label="Seats"
                type="number"
                value={formData.seats}
                placeholder="5"
                onChange={(value) => updateField('seats', value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Transmission
                </span>

                <select
                  value={formData.transmission}
                  onChange={(event) =>
                    updateField('transmission', event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                >
                  <option value="">Select</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Fuel type
                </span>

                <select
                  value={formData.fuel_type}
                  onChange={(event) =>
                    updateField('fuel_type', event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                >
                  <option value="">Select</option>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </label>
            </div>

            <FormInput
              label="Daily rental rate"
              type="number"
              value={formData.daily_rate}
              required
              placeholder="2500"
              onChange={(value) => updateField('daily_rate', value)}
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Status
              </span>

              <select
                value={formData.status}
                onChange={(event) =>
                  updateField('status', event.target.value as CarStatus)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
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
              {isEditMode ? 'Save Changes' : 'Save Car'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  )
}