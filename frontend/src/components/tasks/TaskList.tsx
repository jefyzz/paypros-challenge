import type { Task } from '../../api/tasks.api'
import TaskCard from './TaskCard'
import EmptyState from '../ui/EmptyState'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onToggleStatus: (task: Task) => void
}

function SkeletonCard() {
  return (
    <div
      className="card animate-pulse"
      style={{ opacity: 0.5 }}
    >
      <div className="h-4 w-3/4 rounded" style={{ background: 'var(--color-border)' }} />
      <div className="mt-3 h-3 w-full rounded"  style={{ background: 'var(--color-border)' }} />
      <div className="mt-1.5 h-3 w-2/3 rounded" style={{ background: 'var(--color-border)' }} />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-20 rounded-full" style={{ background: 'var(--color-border)' }} />
        <div className="h-5 w-24 rounded-full" style={{ background: 'var(--color-border)' }} />
      </div>
    </div>
  )
}

export default function TaskList({ tasks, isLoading, onEdit, onDelete, onToggleStatus }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (tasks.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  )
}
