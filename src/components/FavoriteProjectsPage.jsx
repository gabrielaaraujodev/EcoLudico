import React from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "../styles/FavoriteProjectsPage.module.css";

function FavoriteProjectsPage() {
  const location = useLocation();
  const currentUserId = location.state?.currentUserId;

  const [favoriteProjects, setFavoriteProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const API_BASE_URL = "https://localhost:7253";

  const fetchFavoriteProjects = React.useCallback(async () => {
    if (!currentUserId) {
      setError(
        "ID do usuário não disponível. Por favor, faça login novamente."
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/User/${currentUserId}/favorite-projects`
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Erro desconhecido" }));
        throw new Error(
          `Erro ao carregar projetos favoritos: ${response.status} - ${
            errorData.message || JSON.stringify(errorData)
          }`
        );
      }

      const data = await response.json();
      setFavoriteProjects(data);
    } catch (err) {
      console.error("Erro ao buscar projetos favoritos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  React.useEffect(() => {
    fetchFavoriteProjects();
  }, [fetchFavoriteProjects]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando projetos favoritos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.errorMessage}>Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Meus Projetos Favoritos</h1>
      {favoriteProjects.length > 0 ? (
        <div className={styles.projectsGrid}>
          {favoriteProjects.map((project) => (
            <div key={project.projectId} className={styles.projectCard}>
              <h3>{project.name}</h3>
              {project.imageUrls && project.imageUrls.length > 0 && (
                <img
                  src={`${API_BASE_URL}${project.imageUrls[0]}`}
                  alt={project.name}
                  className={styles.projectImage}
                />
              )}
              <p>{project.description}</p>
              <Link
                to={`/project/${project.projectId}`}
                state={{ currentUserId: currentUserId }}
              >
                Ver Detalhes
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Você ainda não tem projetos favoritos.</p>
      )}
    </div>
  );
}

export default FavoriteProjectsPage;
