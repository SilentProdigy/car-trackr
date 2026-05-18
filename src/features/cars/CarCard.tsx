import { CarFront, Fuel, Users, Trash2, Pencil } from 'lucide-react'
import type { Car } from '../../types/database'
import { CarStatusBadge } from './CarStatusBadge'

type CarCardProps = {
  car: Car
  onDelete: (carId: string) => void
  onEdit: (car: Car) => void
  canEdit?: boolean
  canDelete?: boolean
}

export function CarCard({ car, onDelete, onEdit, canEdit, canDelete }: CarCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
      <div className="h-40 bg-[#e8f0ec]">
        {car.photo_url ? (
          <img
            src={car.photo_url}
            alt={car.car_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#416b57]">
            <CarFront size={48} />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#10231c]">
              {car.car_name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {car.brand || 'No brand'} {car.model ? `• ${car.model}` : ''}
            </p>
          </div>

          <CarStatusBadge status={car.status} />
        </div>

        <div className="mt-4 rounded-2xl bg-[#f6f8f7] p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Plate Number</span>
            <span className="font-bold text-[#10231c]">{car.plate_number}</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-500">Daily Rate</span>
            <span className="font-bold text-[#1f3d32]">
              ₱{Number(car.daily_rate).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
          {car.year && (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              {car.year}
            </span>
          )}

          {car.transmission && (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              {car.transmission}
            </span>
          )}

          {car.fuel_type && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
              <Fuel size={12} />
              {car.fuel_type}
            </span>
          )}

          {car.seats && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
              <Users size={12} />
              {car.seats} seats
            </span>
          )}
        </div>

        {car.notes && (
          <p className="mt-4 rounded-2xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {car.notes}
          </p>
        )}

        {canEdit && (
          <button
            type="button"
            onClick={() => onEdit(car)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e8f0ec] px-4 py-3 text-sm font-bold text-[#1f3d32]"
          >
            <Pencil size={16} />
            Edit Car
          </button>
        )}

        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(car.id)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
          >
            <Trash2 size={16} />
            Delete Car
          </button>
        )}
      </div>
    </article>
  )
}