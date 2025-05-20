import { useState, useEffect } from "react";
import styles from "../styles/ProjectDetails.module.css";

function CommentForm({
  initialContent = "",
  isEditing = false,
  onSubmit,
  onCancel,
}) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    } else {
      alert("O comentário não pode ser vazio.");
    }
  };

  return (
    <div className={styles.commentFormContainer}>
      <h3>{isEditing ? "Editar Comentário" : "Fazer um Comentário"}</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva seu comentário aqui..."
          rows="4"
          className={styles.commentTextarea}
        />
        <div className={styles.commentFormActions}>
          <button type="submit" className={styles.addCommentButton}>
            {isEditing ? "Salvar Edição" : "Adicionar Comentário"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentForm;
