import { Activity, Clock3 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import { getActivityLogs } from './activityApi'

export function ActivityLogsPage() {
  const { data: logs = [], isLoading, isError, error } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: getActivityLogs,
  })

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 pb-8 pt-6 text-white">
        <p className="text-sm opacity-80">Audit Trail</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Activity Logs</h1>
            <p className="mt-1 text-sm opacity-80">
              Review important changes made in the system.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Activity size={24} />
          </div>
        </div>
      </header>

      <section className="-mt-4 px-5">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm">
          {isLoading && (
            <p className="text-sm text-gray-500">Loading activity logs...</p>
          )}

          {isError && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error instanceof Error ? error.message : 'Failed to load logs.'}
            </div>
          )}

          {!isLoading && logs.length === 0 && (
            <div className="rounded-2xl bg-[#f6f8f7] px-4 py-5 text-center">
              <p className="text-sm text-gray-500">No activity logs yet.</p>
            </div>
          )}

          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="rounded-2xl bg-[#f6f8f7] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f0ec] text-[#1f3d32]">
                    <Clock3 size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#10231c]">
                      {log.action.replace('_', ' ')} {log.entity_type}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </p>

                    <p className="mt-2 break-all text-xs text-gray-500">
                      User: {log.user_id ?? 'Unknown'}
                    </p>

                    {Object.keys(log.metadata ?? {}).length > 0 && (
                      <pre className="mt-3 overflow-x-auto rounded-xl bg-white p-3 text-xs text-gray-600">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  )
}