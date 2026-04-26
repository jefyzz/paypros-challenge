import type { TaskStatus } from '../../api/tasks.api'

interface TaskFiltersProps {
  activeFilter: TaskStatus | 'all'
  onChange: (filter: TaskStatus | 'all') => void
  counts: { all: number; pending: number; completed: number }
}

const FILTERS: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Pending',   value: 'pending'   },
  { label: 'Completed', value: 'completed' },
]

export default function TaskFilters({ activeFilter, onChange, counts }: TaskFiltersProps) {
  return (
    <div
      className="flex gap-1 rounded-xl p-1"
      style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
      role="tablist"
      aria-label="Filter tasks"
    >
      {FILTERS.map(({ label, value }) => {
        const isActive = activeFilter === value
        const count = counts[value]

        return (
          <button
            key={value}
            id={`filter-${value}`}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            className="relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{
              fontFamily: 'var(--font-display)',
              color: isActive ? 'var(--color-bg)' : 'var(--color-text-muted)',
              background: isActive ? 'var(--color-accent)' : 'transparent',
            }}
          >
            {label}
            <span
              className="rounded-full px-1.5 py-0.5 text-xs font-bold"
              style={{
                background: isActive ? 'rgba(0,0,0,0.2)' : 'var(--color-border)',
                color: isActive ? 'var(--color-bg)' : 'var(--color-text-muted)',
              }}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
