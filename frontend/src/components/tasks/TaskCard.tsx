import type { Task } from '../../api/tasks.api'
import Badge from '../ui/Badge'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onToggleStatus: (task: Task) => void
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateStr))
}

function isOverdue(dateStr: string | null, status: string): boolean {
  if (!dateStr || status === 'completed') return false
  return new Date(dateStr) < new Date()
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status)
  const isCompleted = task.status === 'completed'
  const formattedDate = formatDate(task.dueDate)

  return (
    <article
      className="card group relative flex flex-col gap-3 hover:border-amber-500/40 hover:-translate-y-0.5 transition-all duration-200"
      style={{ opacity: isCompleted ? 0.75 : 1 }}
    >
      {/* Status indicator strip */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl transition-all duration-300"
        style={{
          background: isCompleted
            ? 'var(--color-success)'
            : overdue
            ? 'var(--color-danger)'
            : 'var(--color-accent)',
        }}
      />

      <div className="pl-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <h3
            className="flex-1 font-semibold leading-snug"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
              textDecoration: isCompleted ? 'line-through' : 'none',
              textDecorationColor: 'var(--color-text-muted)',
            }}
          >
            {task.title}
          </h3>

          {/* Action buttons — visible on hover */}
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <button
              id={`task-edit-${task.id}`}
              onClick={() => onEdit(task)}
              className="btn-ghost btn-sm p-1.5"
              aria-label={`Edit task: ${task.title}`}
              title="Edit"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <button
              id={`task-delete-${task.id}`}
              onClick={() => onDelete(task)}
              className="btn-ghost btn-sm p-1.5"
              aria-label={`Delete task: ${task.title}`}
              title="Delete"
              style={{ color: 'var(--color-danger)' }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p
            className="mt-1.5 text-sm leading-relaxed line-clamp-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {task.description}
          </p>
        )}

        {/* Footer row */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {/* Clickable badge to toggle status */}
          <button
            id={`task-toggle-${task.id}`}
            onClick={() => onToggleStatus(task)}
            className="transition-transform duration-150 hover:scale-105"
            aria-label={`Toggle status for: ${task.title}`}
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            <Badge status={task.status} />
          </button>

          {/* Due date */}
          {formattedDate && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: overdue ? 'var(--color-danger)' : 'var(--color-text-muted)' }}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {overdue ? `Overdue · ${formattedDate}` : formattedDate}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
