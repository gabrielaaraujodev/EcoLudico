import styles from "../styles/ProjectDetails.module.css";

function CommentItem({
  comment,
  currentUserId,
  isProjectOwner,
  onEdit,
  onDelete,
}) {
  const isCommentOwner = comment.userId === currentUserId;

  const formattedDate = new Date(comment.creationDate).toLocaleDateString(
    "pt-BR"
  );

  return (
    <div key={comment.commentId} className={styles.commentItem}>
      <p className={styles.commentAuthor}>
        <strong>{comment.userName || "Usuário Desconhecido"}</strong> em{" "}
        {formattedDate}
      </p>
      <p className={styles.commentText}>{comment.content}</p>

      <div className={styles.commentActions}>
        {!isProjectOwner && isCommentOwner && (
          <button
            onClick={() => onEdit(comment.commentId, comment.content)}
            className={styles.editButton}
          >
            Editar
          </button>
        )}
        {(isProjectOwner || isCommentOwner) && (
          <button
            onClick={() => onDelete(comment.commentId)}
            className={styles.deleteButton}
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
