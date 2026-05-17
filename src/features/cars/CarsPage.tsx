import { useState } from 'react'
import { Plus, RefreshCcw } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AddCarForm } from './AddCarForm'
import { CarCard } from './CarCard'
import { createCar, deleteCar, getCars, updateCar } from './carsApi'
import type { Car, CarFormData } from '../../types/database'
import { BottomNav } from '../../components/layout/BottomNav'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { Toast, type ToastType } from '../../components/ui/Toast'

export function CarsPage() {
  const queryClient = useQueryClient()
  const [showAddForm, setShowAddForm] = useState(false)

  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [carToDelete, setCarToDelete] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    type: ToastType
    message: string
  } | null>(null)

  const updateMutation = useMutation({
    mutationFn: ({
      carId,
      formData,
      photoFile,
    }: {
      carId: string
      formData: CarFormData
      photoFile?: File | null
    }) => updateCar(carId, formData, photoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setToast({
        type: 'success',
        message: 'Car updated successfully.',
      })
    },
  })

  const {
    data: cars = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['cars'],
    queryFn: getCars,
  })

  const createMutation = useMutation({
    mutationFn: ({
      formData,
      photoFile,
    }: {
      formData: CarFormData
      photoFile?: File | null
    }) => createCar(formData, photoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
  })

  async function handleSaveCar(
    formData: CarFormData,
    photoFile?: File | null,
  ) {
    if (selectedCar) {
      await updateMutation.mutateAsync({
        carId: selectedCar.id,
        formData,
        photoFile,
      })
      setSelectedCar(null)
      return
    }

    await createMutation.mutateAsync({
      formData,
      photoFile,
    })

    setToast({
      type: 'success',
      message: 'Car added successfully.',
    })
  }

  function handleDeleteCar(carId: string) {
    setCarToDelete(carId)
  }

  function confirmDeleteCar() {
    if (!carToDelete) return

    deleteMutation.mutate(carToDelete, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cars'] })
        setCarToDelete(null)
        setToast({
          type: 'success',
          message: 'Car deleted successfully.',
        })
      },
      onError: (error) => {
        setToast({
          type: 'error',
          message:
            error instanceof Error ? error.message : 'Failed to delete car.',
        })
      },
    })
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 py-6 text-white">
        <p className="text-sm opacity-80">Fleet Management</p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Cars</h1>

          <button
            type="button"
            onClick={() => {
              setSelectedCar(null)
              setShowAddForm(true)
            }}
            className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#1f3d32]"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </header>

      <section className="px-5 py-5">
        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
            <p className="text-sm font-semibold text-[#1f3d32]">
              Loading cars...
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700">
            <p className="text-sm font-bold">Failed to load cars.</p>
            <p className="mt-1 text-sm">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-red-100 px-4 py-2 text-sm font-bold"
            >
              <RefreshCcw size={16} />
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && cars.length === 0 && (
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e8f0ec] text-[#1f3d32]">
              <Plus size={28} />
            </div>

            <h2 className="text-lg font-bold text-[#10231c]">
              No cars added yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Start by adding your first rental vehicle.
            </p>

            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-5 rounded-2xl bg-[#1f3d32] px-5 py-3 text-sm font-bold text-white"
            >
              Add First Car
            </button>
          </div>
        )}

        {!isLoading && !isError && cars.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard
                label="Total Cars"
                value={String(cars.length)}
              />
              <SummaryCard
                label="Available"
                value={String(
                  cars.filter((car) => car.status === 'available').length,
                )}
              />
            </div>

            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onDelete={handleDeleteCar}
                onEdit={(car) => {
                  setSelectedCar(car)
                  setShowAddForm(true)
                }}
              />
            ))}
          </div>
        )}
      </section>

      {showAddForm && (
        <AddCarForm
          car={selectedCar}
          onSubmit={handleSaveCar}
          onClose={() => {
            setShowAddForm(false)
            setSelectedCar(null)
          }}
        />
      )}

      {carToDelete && (
        <ConfirmModal
          title="Delete car?"
          message="Are you sure you want to delete this car? This action cannot be undone."
          confirmLabel="Delete Car"
          cancelLabel="Keep Car"
          loading={deleteMutation.isPending}
          onConfirm={confirmDeleteCar}
          onCancel={() => setCarToDelete(null)}
        />
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <BottomNav />
    </main>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#1f3d32]">{value}</p>
    </div>
  )
}