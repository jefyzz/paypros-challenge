import Modal from '../ui/Modal'
import Button from '../ui/Button'
import type { Task } from '../../api/tasks.api'

interface DeleteConfirmModalProps {
  isOpen: boolean
  task: Task | null
  onConfirm: () => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export default function DeleteConfirmModal({
  isOpen,
  task,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete Task">
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          Are you sure you want to delete{' '}
          <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
            &ldquo;{task?.title}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <Button
            id="delete-confirm-button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            loading={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Deleting…' : 'Delete task'}
          </Button>
          <Button
            id="delete-cancel-button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
