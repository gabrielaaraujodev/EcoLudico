import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Profile.module.css";

function Profile() {
  const navigate = useNavigate();

  // Dados de usuário mock
  const mockUser = {
    id: 123,
    name: "Nome do Usuário Fictício",
    school: "Escola Imaginária",
    profilePicture: "https://via.placeholder.com/100", // Uma URL de imagem placeholder
    projects: [
      {
        id: 1,
        name: "Projeto Alfa",
        materials: ["Papel", "Cola", "Tesoura"],
        description: "Breve descrição do projeto alfa...",
        color: "#a8dadc",
      },
      {
        id: 2,
        name: "Projeto Beta",
        materials: ["Garrafas PET", "Tinta", "Pincel"],
        description: "Breve descrição do projeto beta...",
        color: "#457b9d",
      },
      {
        id: 3,
        name: "Projeto Gama",
        materials: ["Latas", "Barbante", "Adesivo"],
        description: "Breve descrição do projeto gama...",
        color: "#1d3557",
      },
    ],
  };

  const handleEditProfileClick = () => {
    navigate("/edit-profile");
  };

  const handleEditProjectsClick = () => {
    navigate("/edit-projects");
  };

  if (!mockUser) {
    return <div>Nenhum dado de usuário disponível.</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileImagePlaceholder}>
          {mockUser.profilePicture && (
            <img
              src={mockUser.profilePicture}
              alt="Profile"
              className={styles.profileImage}
            />
          )}
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.userName}>{mockUser.name}</h2>
          <p className={styles.userSchool}>{mockUser.school}</p>
        </div>
        <button
          className={styles.editProfileButton}
          onClick={handleEditProfileClick}
        >
          Editar Perfil
        </button>
      </div>

      <div className={styles.projectsSection}>
        <div className={styles.projectsHeader}>
          <h3>Meus Projetos</h3>
          <button
            className={styles.editProjectsButton}
            onClick={handleEditProjectsClick}
          >
            editar projetos
          </button>
        </div>
        <div className={styles.projectsGrid}>
          {mockUser.projects &&
            mockUser.projects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <div
                  className={styles.projectCardTop}
                  style={{ backgroundColor: project.color || "#ddd" }}
                >
                  {/* Você pode adicionar estilos para exibir uma imagem aqui */}
                </div>
                <div className={styles.projectCardContent}>
                  <h4 className={styles.projectName}>{project.name}</h4>
                  <p className={styles.projectMaterials}>
                    {project.materials ? project.materials.join(", ") : ""}
                  </p>
                  <p className={styles.projectDescription}>
                    {project.description}
                  </p>
                  <p className={styles.projectSchoolName}>{mockUser.school}</p>
                  {/* Assumindo que a escola está associada ao usuário */}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
