import { useState } from 'react'
import { Plus, RefreshCcw, Wrench } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { getCars } from '../cars/carsApi'
import type {
  MaintenanceFormData,
  MaintenanceStatus,
} from '../../types/database'
import { AddMaintenanceForm } from './AddMaintenanceForm'
import { MaintenanceCard } from './MaintenanceCard'
import {
  createMaintenanceRecord,
  deleteMaintenanceRecord,
  getMaintenanceRecords,
  updateMaintenanceStatus,
} from './maintenanceApi'

export function MaintenancePage() {
  const queryClient = useQueryClient()

  const [showAddForm, setShowAddForm] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null)

  const {
    data: records = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['maintenance'],
    queryFn: getMaintenanceRecords,
  })

  const { data: cars = [] } = useQuery({
    queryKey: ['cars'],
    queryFn: getCars,
  })

  const createMutation = useMutation({
    mutationFn: ({
      formData,
      receiptFile,
    }: {
      formData: MaintenanceFormData
      receiptFile?: File | null
    }) => createMaintenanceRecord(formData, receiptFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
      queryClient.invalidateQueries({ queryKey: ['cars'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({
      maintenanceId,
      status,
    }: {
      maintenanceId: string
      status: MaintenanceStatus
    }) => updateMaintenanceStatus(maintenanceId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMaintenanceRecord,
  })

  const selectedRecord = records.find((record) => record.id === recordToDelete)

  const totalCost = records.reduce((sum, record) => {
    return sum + Number(record.cost)
  }, 0)

  const activeMaintenance = records.filter(
    (record) => record.status === 'scheduled' || record.status === 'in_progress',
  ).length

  async function handleCreateMaintenance(
    formData: MaintenanceFormData,
    receiptFile?: File | null,
  ) {
    await createMutation.mutateAsync({
      formData,
      receiptFile,
    })
  }

  function handleUpdateStatus(
    maintenanceId: string,
    status: MaintenanceStatus,
  ) {
    updateStatusMutation.mutate({
      maintenanceId,
      status,
    })
  }

  function confirmDeleteRecord() {
    if (!recordToDelete) return

    deleteMutation.mutate(recordToDelete, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['maintenance'] })
        setRecordToDelete(null)
      },
    })
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 py-6 text-white">
        <p className="text-sm opacity-80">Vehicle Service</p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Maintenance</h1>

          <button
            type="button"
            onClick={() => setShowAddForm(true)}
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
              Loading maintenance records...
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700">
            <p className="text-sm font-bold">
              Failed to load maintenance records.
            </p>
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

        {!isLoading && !isError && records.length === 0 && (
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e8f0ec] text-[#1f3d32]">
              <Wrench size={28} />
            </div>

            <h2 className="text-lg font-bold text-[#10231c]">
              No maintenance records yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Track vehicle repairs, service dates, and upcoming maintenance.
            </p>

            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-5 rounded-2xl bg-[#1f3d32] px-5 py-3 text-sm font-bold text-white"
            >
              Add First Record
            </button>
          </div>
        )}

        {!isLoading && !isError && records.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard
                label="Total Cost"
                value={`₱${Number(totalCost).toLocaleString()}`}
              />

              <SummaryCard
                label="Active"
                value={String(activeMaintenance)}
              />
            </div>

            {records.map((record) => (
              <MaintenanceCard
                key={record.id}
                record={record}
                onDelete={setRecordToDelete}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </section>

      {showAddForm && (
        <AddMaintenanceForm
          cars={cars}
          onSubmit={handleCreateMaintenance}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {recordToDelete && (
        <ConfirmModal
          title="Delete maintenance record?"
          message={`Are you sure you want to delete "${
            selectedRecord?.maintenance_type ?? 'this maintenance record'
          }"? This action cannot be undone.`}
          confirmLabel="Delete Record"
          cancelLabel="Keep Record"
          loading={deleteMutation.isPending}
          onConfirm={confirmDeleteRecord}
          onCancel={() => setRecordToDelete(null)}
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
      <p className="mt-2 text-xl font-bold text-[#1f3d32]">{value}</p>
    </div>
  )
}