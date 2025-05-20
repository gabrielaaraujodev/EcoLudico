import styles from "../styles/ConfirmationModal.module.css";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Sim
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Não
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
