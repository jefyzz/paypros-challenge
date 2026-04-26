import { useState, useEffect, type FormEvent } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../../api/tasks.api'

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: CreateTaskPayload | UpdateTaskPayload) => Promise<void>
  task?: Task | null // if provided, edit mode
}

interface FormState {
  title: string
  description: string
  dueDate: string
  status: 'pending' | 'completed'
}

interface FormErrors {
  title?: string
}

export default function TaskFormModal({ isOpen, onClose, onSubmit, task }: TaskFormModalProps) {
  const isEditing = !!task

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  // Pre-fill when editing
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0]! : '',
        status: task.status,
      })
    } else {
      setForm({ title: '', description: '', dueDate: '', status: 'pending' })
    }
    setErrors({})
  }, [task, isOpen])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        status: form.status,
      }
      await onSubmit(payload)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Task' : 'New Task'}>
      <form id="task-form" onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          id="task-title"
          label="Title"
          type="text"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          error={errors.title}
          autoFocus
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="task-description"
            className="text-sm font-medium"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
          >
            Description <span style={{ color: 'var(--color-text-muted)' }}>(optional)</span>
          </label>
          <textarea
            id="task-description"
            rows={3}
            placeholder="Add more details…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field resize-none"
          />
        </div>

        <Input
          id="task-due-date"
          label="Due date"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          hint="Optional — leave blank for no due date"
        />

        {isEditing && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="task-status"
              className="text-sm font-medium"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
            >
              Status
            </label>
            <select
              id="task-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'pending' | 'completed' })}
              className="input-field"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        <div className="mt-2 flex gap-3">
          <Button
            id="task-form-submit"
            type="submit"
            variant="primary"
            size="md"
            loading={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving…' : isEditing ? 'Save changes' : 'Create task'}
          </Button>
          <Button
            id="task-form-cancel"
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
