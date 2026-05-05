import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import type { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from '../api/tasks.api'
import TaskList from '../components/tasks/TaskList'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskFormModal from '../components/tasks/TaskFormModal'
import DeleteConfirmModal from '../components/tasks/DeleteConfirmModal'
import Button from '../components/ui/Button'

export default function DashboardPage() {
  const { user } = useAuth()
  const {
    tasks,
    isLoading,
    activeFilter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleStatus,
    setActiveFilter,
  } = useTasks()

  // Modal state
  const [isFormOpen, setIsFormOpen]         = useState(false)
  const [editingTask, setEditingTask]       = useState<Task | null>(null)
  const [deletingTask, setDeletingTask]     = useState<Task | null>(null)
  const [isDeleting, setIsDeleting]         = useState(false)

  // Initial load
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Change active filter
  const handleFilterChange = useCallback((filter: TaskStatus | 'all') => {
    setActiveFilter(filter)
  }, [setActiveFilter])

  // Computed counts for filter tabs
  const counts = {
    all:       tasks.length,
    pending:   tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  // Filtered view (client-side when filter is active)
  const visibleTasks = activeFilter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === activeFilter)

  // Handlers
  const openCreate = () => { setEditingTask(null); setIsFormOpen(true) }
  const openEdit   = (task: Task) => { setEditingTask(task); setIsFormOpen(true) }

  const handleFormSubmit = async (payload: CreateTaskPayload | UpdateTaskPayload) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload as UpdateTaskPayload)
      } else {
        await createTask(payload as CreateTaskPayload)
      }
    } catch {
      toast.error(editingTask ? 'Failed to update task.' : 'Failed to create task.')
      throw new Error('Form submit failed') // re-throw so modal stays open on error
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return
    setIsDeleting(true)
    try {
      await deleteTask(deletingTask.id)
      setDeletingTask(null)
    } catch {
      toast.error('Failed to delete task.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async (task: Task) => {
    try {
      await toggleStatus(task)
    } catch {
      toast.error('Failed to update task status.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            My Tasks
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Hello, {user?.name?.split(' ')[0]}. Here&apos;s what&apos;s on your list.
          </p>
        </div>

        <Button
          id="create-task-button"
          variant="primary"
          size="md"
          onClick={openCreate}
          className="mt-4 sm:mt-0"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New task
        </Button>
      </div>

      {/* Filter tabs */}
      <TaskFilters
        activeFilter={activeFilter}
        onChange={handleFilterChange}
        counts={counts}
      />

      {/* Task list */}
      <TaskList
        tasks={visibleTasks}
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={(task) => setDeletingTask(task)}
        onToggleStatus={handleToggleStatus}
      />

      {/* Create / Edit modal */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={editingTask}
      />

      {/* Delete confirm modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTask}
        task={deletingTask}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTask(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}
