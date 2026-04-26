import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { tasksApi, type Task, type TaskStatus, type CreateTaskPayload, type UpdateTaskPayload } from '../api/tasks.api'

interface UseTasksReturn {
  tasks: Task[]
  isLoading: boolean
  activeFilter: TaskStatus | 'all'
  fetchTasks: (status?: TaskStatus | 'all') => Promise<void>
  createTask: (payload: CreateTaskPayload) => Promise<void>
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleStatus: (task: Task) => Promise<void>
  setActiveFilter: (filter: TaskStatus | 'all') => void
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'all'>('all')

  const fetchTasks = useCallback(async (status?: TaskStatus | 'all') => {
    setIsLoading(true)
    try {
      const filter = status === 'all' ? undefined : status
      const data = await tasksApi.getAll(filter)
      setTasks(data)
    } catch {
      toast.error('Failed to load tasks.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTask = useCallback(async (payload: CreateTaskPayload) => {
    const newTask = await tasksApi.create(payload)
    setTasks((prev) => [newTask, ...prev])
    toast.success('Task created!')
  }, [])

  const updateTask = useCallback(async (id: string, payload: UpdateTaskPayload) => {
    const updated = await tasksApi.update(id, payload)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    toast.success('Task updated!')
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    await tasksApi.remove(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
    toast.success('Task deleted.')
  }, [])

  const toggleStatus = useCallback(async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'pending' ? 'completed' : 'pending'
    const updated = await tasksApi.update(task.id, { status: newStatus })
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
  }, [])

  return {
    tasks,
    isLoading,
    activeFilter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleStatus,
    setActiveFilter,
  }
}
