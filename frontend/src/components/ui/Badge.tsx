import type { TaskStatus } from '../../api/tasks.api'

interface BadgeProps {
  status: TaskStatus
}

export default function Badge({ status }: BadgeProps) {
  const isPending = status === 'pending'

  return (
    <span className={isPending ? 'badge-pending' : 'badge-completed'}>
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: isPending ? 'var(--color-warning)' : 'var(--color-success)' }}
      />
      {isPending ? 'Pending' : 'Completed'}
    </span>
  )
}
