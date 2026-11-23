import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

/**
 * Small reusable confirm dialog. Keeps the destructive-action affordance
 * consistent (red confirm button, warning icon) instead of using the native
 * browser confirm().
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  confirmColor = "failure",
  busy = false,
}) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="md" popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
          {message && <p className="mb-5 text-sm text-gray-500">{message}</p>}
          <div className="flex justify-center gap-4">
            <Button color={confirmColor} onClick={onConfirm} disabled={busy}>
              {busy ? "Working..." : confirmLabel}
            </Button>
            <Button color="gray" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;
