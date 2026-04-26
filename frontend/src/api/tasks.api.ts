import { apiClient } from './axios'

export type TaskStatus = 'pending' | 'completed'

export interface Task {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  status: TaskStatus
  createdAt: string
  updatedAt: string
  userId: string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  dueDate?: string
  status?: TaskStatus
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  dueDate?: string | null
  status?: TaskStatus
}

export const tasksApi = {
  getAll: (status?: TaskStatus): Promise<Task[]> =>
    apiClient
      .get<Task[]>('/tasks', { params: status ? { status } : {} })
      .then((r) => r.data),

  getById: (id: string): Promise<Task> =>
    apiClient.get<Task>(`/tasks/${id}`).then((r) => r.data),

  create: (payload: CreateTaskPayload): Promise<Task> =>
    apiClient.post<Task>('/tasks', payload).then((r) => r.data),

  update: (id: string, payload: UpdateTaskPayload): Promise<Task> =>
    apiClient.patch<Task>(`/tasks/${id}`, payload).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    apiClient.delete(`/tasks/${id}`).then(() => undefined),
}
