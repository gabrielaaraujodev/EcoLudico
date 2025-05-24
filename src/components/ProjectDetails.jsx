import React from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../styles/ProjectDetails.module.css";
import CommentItem from "../components/CommentItem";
import CommentForm from "../components/CommentForm";
import ProjectFormModal from "../components/ProjectFormModal";
import ConfirmationModal from "../components/ConfirmationModal";

function ProjectDetails() {
  const params = useParams();
  const { projectId } = params;
  const location = useLocation();
  const currentUserId = location.state?.currentUserId;

  const navigate = useNavigate();

  const [project, setProject] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showCommentForm, setShowCommentForm] = React.useState(false);
  const [editingComment, setEditingComment] = React.useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    React.useState(false);
  const [projectDeleted, setProjectDeleted] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const API_BASE_URL = "https://localhost:7253";

  const checkFavoriteStatus = React.useCallback(async () => {
    if (!currentUserId || !projectId) {
      setIsFavorite(false);
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/User/${currentUserId}/favorite-projects`
      );
      if (!response.ok) {
        console.error(
          `Erro ao verificar status de favorito: ${response.status} - ${response.statusText}`
        );
        setIsFavorite(false);
        return;
      }
      const favoriteProjects = await response.json();
      setIsFavorite(
        favoriteProjects.some((fav) => fav.projectId === parseInt(projectId))
      );
    } catch (err) {
      console.error("Erro inesperado ao verificar status de favorito:", err);
      setIsFavorite(false);
    }
  }, [currentUserId, projectId]);

  const fetchProjectDetails = React.useCallback(async () => {
    if (projectDeleted) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Project/${projectId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erro na requisição: ${response.status} - ${JSON.stringify(
            errorData.errors || errorData
          )}`
        );
      }
      const data = await response.json();
      setProject(data);
    } catch (err) {
      console.error("Erro ao carregar detalhes do projeto:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, projectDeleted]);

  React.useEffect(() => {
    if (!projectDeleted) {
      fetchProjectDetails();
    }
  }, [fetchProjectDetails, projectDeleted]);

  React.useEffect(() => {
    if (project && currentUserId) {
      checkFavoriteStatus();
    }
  }, [project, currentUserId, checkFavoriteStatus]);

  const isProjectOwner = project && project.schoolOwnerUserId === currentUserId;

  const handleToggleFavorite = async () => {
    if (!currentUserId) {
      alert("Por favor, faça login para favoritar um projeto.");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isFavorite) {
        response = await fetch(
          `${API_BASE_URL}/api/User/${currentUserId}/favorite-projects/${projectId}`,
          {
            method: "DELETE",
          }
        );
        if (response.status === 204) {
          setIsFavorite(false);
          alert("Projeto removido dos favoritos!");
        } else {
          const errorData = await response.text();
          throw new Error(
            `Erro ao desfavoritar: ${response.status} - ${errorData}`
          );
        }
      } else {
        response = await fetch(
          `${API_BASE_URL}/api/User/${currentUserId}/favorite-projects/${projectId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (
          response.status === 200 ||
          response.status === 201 ||
          response.status === 204
        ) {
          setIsFavorite(true);
          alert("Projeto adicionado aos favoritos!");
        } else if (response.status === 409) {
          alert("Este projeto já está nos seus favoritos!");
          setIsFavorite(true);
        } else {
          const errorData = await response.text();
          throw new Error(
            `Erro ao favoritar: ${response.status} - ${errorData}`
          );
        }
      }
    } catch (err) {
      console.error("Erro ao favoritar/desfavoritar:", err);
      alert(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content) => {
    if (!currentUserId) {
      alert("Por favor, faça login para adicionar um comentário.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/User/${currentUserId}/comments/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: content }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Erro ao adicionar comentário: ${response.status} - ${errorData}`
        );
      }

      const newComment = await response.json();
      setProject((prevProject) => ({
        ...prevProject,
        comments: [...(prevProject.comments || []), newComment],
      }));
      setShowCommentForm(false);
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
      alert(`Erro: ${err.message}`);
    }
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingComment({ commentId, content: currentContent });
    setShowCommentForm(true);
  };

  const handleUpdateComment = async (commentId, newContent) => {
    if (!currentUserId) {
      alert("Erro: ID do usuário não disponível para atualização.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/User/${currentUserId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commentId: commentId, content: newContent }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Erro ao atualizar comentário: ${response.status} - ${errorData}`
        );
      }

      setProject((prevProject) => ({
        ...prevProject,
        comments: (prevProject.comments || []).map((c) =>
          c.commentId === commentId
            ? {
                ...c,
                content: newContent,
                creationDate: new Date().toISOString(),
              }
            : c
        ),
      }));
      setEditingComment(null);
      setShowCommentForm(false);
    } catch (err) {
      console.error("Erro ao atualizar comentário:", err);
      alert(`Erro: ${err.message}`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUserId) {
      alert("Erro: ID do usuário não disponível para exclusão.");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este comentário?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/User/${currentUserId}/comments/${commentId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(
            `Erro ao excluir comentário: ${response.status} - ${errorData}`
          );
        }

        setProject((prevProject) => ({
          ...prevProject,
          comments: (prevProject.comments || []).filter(
            (c) => c.commentId !== commentId
          ),
        }));
      } catch (err) {
        console.error("Erro ao excluir comentário:", err);
        alert(`Erro: ${err.message}`);
      }
    }
  };

  const handleEditProject = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProject(updatedProject);
    setIsEditModalOpen(false);
  };

  const openDeleteConfirmModal = () => {
    setIsDeleteConfirmModalOpen(true);
  };

  const closeDeleteConfirmModal = () => {
    setIsDeleteConfirmModalOpen(false);
  };

  const confirmDeleteProject = async () => {
    closeDeleteConfirmModal();

    if (!currentUserId) {
      alert("Erro: ID do usuário não disponível para exclusão do projeto.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Project/${projectId}?userId=${currentUserId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Erro ao excluir projeto: ${response.status} - ${errorData}`
        );
      }

      alert("Projeto excluído com sucesso!");
      setProjectDeleted(true);
      navigate(`/profile`, { state: { currentUserId: currentUserId } });
    } catch (err) {
      console.error("Erro ao excluir projeto:", err);
      alert(`Erro ao excluir o projeto: ${err.message}`);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
  };

  const getAgeRangeText = (ageRangeValue) => {
    switch (ageRangeValue) {
      case 1:
        return "Infantil";
      case 2:
        return "Fundamental";
      case 3:
        return "Médio";
      case 4:
        return "Adulto";
      case "Infantil":
        return "Infantil";
      case "Fundamental":
        return "Fundamental";
      case "Medio":
        return "Médio";
      case "Adulto":
        return "Adulto";
      default:
        console.warn(
          "Valor de faixa etária desconhecido ou inválido:",
          ageRangeValue
        );
        return "Não especificado";
    }
  };

  if (projectDeleted) {
    return (
      <div className={styles.loadingMessage}>
        Projeto excluído. Redirecionando...
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingMessage}>
        Carregando detalhes do projeto...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        Erro ao carregar detalhes do projeto: {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.noProjectMessage}>Projeto não encontrado.</div>
    );
  }

  return (
    <div className={styles.projectDetailsContainer}>
      <div className={styles.projectHeader}>
        <h1>{project.name}</h1>
        {isProjectOwner && (
          <div className={styles.ownerActions}>
            <button
              onClick={handleEditProject}
              className={styles.editProjectButton}
            >
              Editar Projeto
            </button>
            <button
              onClick={openDeleteConfirmModal}
              className={styles.deleteProjectButton}
            >
              Excluir Projeto
            </button>
          </div>
        )}
      </div>

      <div className={styles.projectContent}>
        <div className={styles.projectImageSection}>
          {project.imageUrls && project.imageUrls.length > 0 ? (
            <Slider {...settings}>
              {project.imageUrls.map((url, index) => (
                <div key={index} className={styles.imageWrapper}>
                  <img
                    src={`${API_BASE_URL}${url}`}
                    alt={`Imagem ${index + 1}`}
                    className={styles.projectImage}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p>Sem imagens disponíveis para este projeto.</p>
          )}
        </div>

        <div className={styles.projectInfoSection}>
          <h3>Descrição do Projeto</h3>
          <p>{project.description || "Nenhuma descrição fornecida."}</p>

          {project.tutorial && (
            <>
              <h3>Tutorial</h3>
              <p>{project.tutorial}</p>
            </>
          )}

          <h3>Faixa Etária</h3>
          <p>{getAgeRangeText(project.ageRange)}</p>

          <h3>Materiais Utilizados</h3>
          <p>{project.materialsList || "Nenhum material listado."}</p>

          {project.school &&
            project.school.name &&
            project.schoolOwnerUserId && (
              <div className={styles.schoolInfo}>
                <h3>Escola</h3>
                <Link
                  to="/profile"
                  state={{ currentUserId: project.schoolOwnerUserId }}
                  className={styles.schoolLink}
                >
                  {project.school.name}
                </Link>
              </div>
            )}
        </div>
      </div>

      <div className={styles.projectActions}>
        {currentUserId && (
          <button
            onClick={handleToggleFavorite}
            className={`${styles.favoriteButton} ${
              isFavorite ? styles.favorited : ""
            }`}
            disabled={loading}
          >
            {isFavorite ? "Desfavoritar Projeto" : "Favoritar Projeto"}
          </button>
        )}
      </div>

      <div className={styles.commentsSection}>
        <h3>Comentários</h3>
        {currentUserId && !showCommentForm && (
          <button
            onClick={() => {
              setShowCommentForm(true);
              setEditingComment(null);
            }}
            className={styles.addCommentButton}
          >
            Fazer Comentário
          </button>
        )}
        {showCommentForm && (
          <CommentForm
            initialContent={editingComment ? editingComment.content : ""}
            isEditing={!!editingComment}
            onSubmit={
              editingComment
                ? (content) =>
                    handleUpdateComment(editingComment.commentId, content)
                : handleAddComment
            }
            onCancel={() => {
              setShowCommentForm(false);
              setEditingComment(null);
            }}
          />
        )}
        {project.comments && project.comments.length > 0 ? (
          <div className={styles.commentsList}>
            {project.comments.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                currentUserId={currentUserId}
                isProjectOwner={isProjectOwner}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        ) : (
          <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        )}
      </div>

      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleProjectUpdated}
        initialProjectData={project}
        userId={currentUserId}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={closeDeleteConfirmModal}
        onConfirm={confirmDeleteProject}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este projeto? Esta ação é irreversível."
      />
    </div>
  );
}

export default ProjectDetails;
