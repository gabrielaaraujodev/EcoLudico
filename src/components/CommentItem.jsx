import styles from "../styles/CommentItem.module.css";

function CommentItem({
  comment,
  currentUserId,
  isProjectOwner,
  onEdit,
  onDelete,
}) {
  const loggedInUserIdNum = Number(currentUserId);
  const commentAuthorIdNum = Number(comment.userId);

  const canEditThisComment = loggedInUserIdNum === commentAuthorIdNum;

  const canDeleteThisComment =
    loggedInUserIdNum === commentAuthorIdNum || isProjectOwner;

  return (
    <div className={styles.commentItem}>
      <p className={styles.commentAuthor}>
        {comment.userName || "Usuário Desconhecido"} -{" "}
        <span className={styles.commentDate}>
          {new Date(comment.creationDate).toLocaleString()}
        </span>
      </p>
      <p className={styles.commentContent}>{comment.content}</p>
      {currentUserId && (
        <div className={styles.commentActions}>
          {canEditThisComment && (
            <button
              onClick={() => onEdit(comment.commentId, comment.content)}
              className={styles.editButton}
              aria-label="Editar comentário"
            >
              Editar
            </button>
          )}

          {canDeleteThisComment && (
            <button
              onClick={() => onDelete(comment.commentId)}
              className={styles.deleteButton}
              aria-label="Excluir comentário"
            >
              Excluir
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
