import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProjectsPage.module.css";

function ProjectsPage({ currentUserId }) {
  console.log("ProjectsPage - currentUserId recebido:", currentUserId);
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedAgeRange, setSelectedAgeRange] = React.useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "https://localhost:7253";

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
        return "Não especificado";
    }
  };

  const ageRangeOptions = [
    { value: "", label: "Todas as Faixas Etárias" },
    { value: 1, label: "Infantil" },
    { value: 2, label: "Fundamental" },
    { value: 3, label: "Médio" },
    { value: 4, label: "Adulto" },
  ];

  const fetchProjects = React.useCallback(
    async (ageRangeFilter = "") => {
      try {
        setLoading(true);
        setError(null);

        let url = `${API_BASE_URL}/api/Project`;

        if (ageRangeFilter && ageRangeFilter !== "") {
          url = `${API_BASE_URL}/api/Project/age-range/${ageRangeFilter}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            setProjects([]);
            return;
          }
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(
              errorData.message ||
                errorData.title ||
                `Erro ${response.status}: ${response.statusText}`
            );
          } else {
            throw new Error(
              `Erro de rede ou servidor: ${response.status} ${
                response.statusText || "Não Encontrado"
              }. Verifique a URL da API e se o backend está rodando.`
            );
          }
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [API_BASE_URL]
  );

  React.useEffect(() => {
    fetchProjects(selectedAgeRange);
  }, [fetchProjects, selectedAgeRange]);

  const handleAgeRangeChange = (event) => {
    setSelectedAgeRange(event.target.value);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`, {
      state: { currentUserId: currentUserId },
    });
  };

  if (loading) {
    return <div className={styles.container}>Carregando projetos...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Erro: {error}</p>
      </div>
    );
  }

  if (projects.length === 0 && selectedAgeRange !== "") {
    return (
      <div className={styles.container}>
        <h1>Todos os Projetos</h1>
        <div className={styles.filters}>
          <label htmlFor="ageRangeFilter">Filtrar por Faixa Etária:</label>
          <select
            id="ageRangeFilter"
            value={selectedAgeRange}
            onChange={handleAgeRangeChange}
            className={styles.filterSelect}
          >
            {ageRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <p>Nenhum projeto encontrado para a faixa etária selecionada.</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return <div className={styles.container}>Nenhum projeto encontrado.</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Todos os Projetos</h1>
      <div className={styles.filters}>
        <label htmlFor="ageRangeFilter">Filtrar por Faixa Etária:</label>
        <select
          id="ageRangeFilter"
          value={selectedAgeRange}
          onChange={handleAgeRangeChange}
          className={styles.filterSelect}
        >
          {ageRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <div
            key={project.projectId}
            className={styles.projectCard}
            onClick={() => handleProjectClick(project.projectId)}
            style={{ cursor: "pointer" }}
          >
            <h2>{project.name}</h2>
            {project.description && <p>Descrição: {project.description}</p>}
            {project.ageRange && (
              <p>Faixa Etária: {getAgeRangeText(project.ageRange)} </p>
            )}
            {project.imageUrls && project.imageUrls.length > 0 && (
              <img
                src={project.imageUrls[0].url}
                alt={`Imagem do projeto ${project.name}`}
                className={styles.projectCardImage}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
