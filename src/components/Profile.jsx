import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/Profile.module.css";

import Slider from "react-slick";

function Profile({ isLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const userIdFromNavigation = location.state?.currentUserId;
  const [isEditSchoolModalOpen, setIsEditSchoolModalOpen] =
    React.useState(false);
  const [editingSchool, setEditingSchool] = React.useState(null);

  const [isPostProjectModalOpen, setIsPostProjectModalOpen] =
    React.useState(false);
  const [newProject, setNewProject] = React.useState({
    name: "",
    description: "",
    tutorial: "",
    ageRange: "",
    materialsList: "",
    schoolId: null,
  });

  const [selectedProjectFile, setSelectedProjectFile] = React.useState(null);
  const [previewProjectImage, setPreviewProjectImage] = React.useState(null);
  const [uploadingProjectImage, setUploadingProjectImage] =
    React.useState(false);
  const [projectImageUploadError, setProjectImageUploadError] =
    React.useState(null);

  const [projects, setProjects] = React.useState([]);
  const [projectsLoading, setProjectsLoading] = React.useState(true);
  const [projectsError, setProjectsError] = React.useState(null);

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState(null);
  const [uploadingImage, setUploadingImage] = React.useState(null);
  const [uploadError, setUploadError] = React.useState(null);

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }

    if (!userIdFromNavigation) {
      setError("ID do usuário não encontrado na navegação.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://localhost:7253/api/User/${userIdFromNavigation}`
        );
        if (!response.ok) {
          throw new Error(
            `Erro na requisição: ${response.status} - ${response.statusText}`
          );
        }
        const data = await response.json();
        setUser(data);
        setLoading(false);
        setNewProject((prevProject) => ({
          ...prevProject,
          schoolId: data?.schoolId,
        }));
        if (data.profilePicture) {
          setPreviewImage(`https://localhost:7253${data.profilePicture}`);
        } else {
          setPreviewImage(null);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn, navigate, userIdFromNavigation]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      if (user?.userId && user?.type === 1 && user?.schoolId) {
        setProjectsLoading(true);
        setProjectsError(null);
        try {
          const response = await fetch(
            `https://localhost:7253/api/Project/user/projects?userId=${user.userId}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setProjects(data);
        } catch (err) {
          setProjectsError(err.message);
        } finally {
          setProjectsLoading(false);
        }
      } else {
        setProjects([]);
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setUploadError(null);
    } else {
      setSelectedFile(null);
      if (user?.profilePicture) {
        setPreviewImage(`https://localhost:7253${user.profilePicture}`);
      } else {
        setPreviewImage(null);
      }
    }
  };

  const handleProjectFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedProjectFile(file);
      setPreviewProjectImage(URL.createObjectURL(file));
      setProjectImageUploadError(null);
    } else {
      setSelectedProjectFile(null);
      setPreviewProjectImage(null);
      setProjectImageUploadError("Nenhuma imagem selecionada para o projeto.");
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!selectedFile) {
      setUploadError("Por favor, selecione um arquivo de imagem.");
      return;
    }

    if (!user?.userId) {
      setUploadError("ID do usuário não disponível para upload.");
      return;
    }

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("File", selectedFile);

    try {
      const response = await fetch(
        `https://localhost:7253/api/User/${user.userId}/upload-profile-picture`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erro ao fazer upload da imagem: ${response.statusText} - ${
            errorData?.message || errorData?.error || "Erro desconhecido"
          }`
        );
      }

      const data = await response.json();
      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: data.profilePictureUrl,
      }));
      setSelectedFile(null);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditProfileClick = () => {
    navigate("/edit-profile");
  };

  const openEditSchoolModal = () => {
    if (user?.school) {
      setEditingSchool({ ...user.school.address, ...user.school });
      setIsEditSchoolModalOpen(true);
    } else {
      setError("Nenhuma escola cadastrada para editar.");
    }
  };

  const closeEditSchoolModal = () => {
    setIsEditSchoolModalOpen(false);
    setEditingSchool(null);
    setError(null);
  };

  const handleEditSchoolChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("address.")) {
      const addressFieldName = name.substring(8);
      setEditingSchool((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressFieldName]: value,
        },
      }));
    } else {
      setEditingSchool((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleUpdateSchool = async () => {
    if (!editingSchool) return;
    try {
      const response = await fetch(
        `https://localhost:7253/api/School/${editingSchool.schoolId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingSchool),
        }
      );

      if (response.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          school: {
            ...editingSchool,
            address: { ...editingSchool.address },
          },
        }));
        closeEditSchoolModal();
      } else if (response.status === 404) {
        setError("Escola não encontrada.");
      } else {
        const errorData = await response.json();
        setError(
          `Erro ao atualizar escola: ${response.statusText} - ${
            errorData?.message || errorData?.error
          }`
        );
      }
    } catch (err) {
      setError(`Erro ao comunicar com o servidor: ${err.message}`);
    }
  };

  const openPostProjectModal = () => {
    setIsPostProjectModalOpen(true);
    setNewProject({
      name: "",
      description: "",
      tutorial: "",
      ageRange: "",
      materialsList: "",
      schoolId: user?.schoolId || null,
    });
    setSelectedProjectFile(null);
    setPreviewProjectImage(null);
    setProjectImageUploadError(null);
  };

  const closePostProjectModal = () => {
    setIsPostProjectModalOpen(false);
    setNewProject({
      name: "",
      description: "",
      tutorial: "",
      ageRange: "",
      materialsList: "",
      schoolId: user?.schoolId || null,
    });
    setSelectedProjectFile(null);
    setPreviewProjectImage(null);
    setProjectImageUploadError(null);
    setError(null);
  };

  const handleNewProjectChange = (event) => {
    const { name, value } = event.target;
    setNewProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveNewProject = async () => {
    setError(null);
    setProjectImageUploadError(null);

    if (!selectedProjectFile) {
      setProjectImageUploadError(
        "Por favor, selecione uma imagem para o projeto."
      );
      return;
    }

    if (!user?.userId) {
      setError("ID do usuário não disponível para criar projeto.");
      return;
    }

    setUploadingProjectImage(true);

    const formData = new FormData();
    formData.append("File", selectedProjectFile);
    formData.append("Name", newProject.name);
    formData.append("Description", newProject.description);
    formData.append("Tutorial", newProject.tutorial);
    formData.append("AgeRange", newProject.ageRange.toString());
    formData.append("MaterialsList", newProject.materialsList);

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await fetch(
        `https://localhost:7253/api/Project/upload-project-picture?userId=${userIdFromNavigation}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        closePostProjectModal();
        fetch(
          `https://localhost:7253/api/Project/user/projects?userId=${user.userId}`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Erro ao recarregar projetos: ${response.status}`
              );
            }
            return response.json();
          })
          .then((data) => setProjects(data))
          .catch((err) => setProjectsError(err.message));
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            setError(
              `Erro ao criar projeto: ${response.statusText} - ${
                errorData?.message ||
                errorData?.error ||
                JSON.stringify(errorData) ||
                "Erro desconhecido"
              }`
            );
          } catch (error) {
            const errorText = await error.text();
            setError(
              `Erro ao criar projeto: ${response.statusText} - Não foi possível analisar a resposta de erro como JSON. Resposta bruta: ${errorText}`
            );
          }
        } else {
          const errorText = await response.text();
          setError(
            `Erro ao criar projeto: ${response.statusText} - ${
              errorText || "Erro desconhecido (resposta não é JSON)"
            }`
          );
        }
      }
    } catch (err) {
      setError(`Erro ao comunicar com o servidor: ${err.message}`);
    } finally {
      setUploadingProjectImage(false);
    }
  };

  const slidesToShowMain = 3;

  const settings = {
    dots: true,
    infinite: projects.length >= slidesToShowMain,
    speed: 500,
    slidesToShow: slidesToShowMain,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(projects.length, 2),
          slidesToScroll: 1,
          infinite: projects.length >= 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(projects.length, 1),
          slidesToScroll: 1,
          infinite: projects.length >= 1,
        },
      },
    ],
  };

  if (loading) {
    return <div>Carregando dados do usuário...</div>;
  }

  if (error && !isEditSchoolModalOpen && !isPostProjectModalOpen) {
    return <div>Erro ao carregar dados do usuário: {error}</div>;
  }

  if (!user) {
    return <div>Nenhum dado de usuário disponível.</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileImageContainer}>
          {" "}
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              className={styles.profileImage}
            />
          ) : (
            <div className={styles.profileImagePlaceholder}>
              <span>Sem Foto</span>
            </div>
          )}
          <input
            type="file"
            id="profilePictureInput"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="profilePictureInput" className={styles.uploadButton}>
            Trocar Foto
          </label>
          {selectedFile && (
            <button
              className={styles.uploadNowButton}
              onClick={handleUploadProfilePicture}
              disabled={uploadingImage}
            >
              {uploadingImage ? "Enviando..." : "Enviar Foto"}
            </button>
          )}
          {uploadError && (
            <p className={styles.uploadErrorMessage}>{uploadError}</p>
          )}
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.userName}>{user.name}</h2>
          <p className={styles.userEmail}>{user.email}</p>
          <p className={styles.userType}>
            Tipo: {user.type === 1 ? "Professor" : "Doador"}
          </p>
          {user.dateBirth && (
            <p className={styles.userDateBirth}>
              Nascimento: {new Date(user.dateBirth).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
        <button
          className={styles.editProfileButton}
          onClick={handleEditProfileClick}
        >
          Editar Perfil
        </button>
      </div>

      {user.address && (
        <div className={styles.sectionCard}>
          <h3>Endereço</h3>
          <p>
            {user.address.street}, {user.address.number} -{" "}
            {user.address.complement}
            <br />
            {user.address.city} - {user.address.state}, {user.address.cep}
          </p>
        </div>
      )}

      <div className={styles.schoolSection}>
        <div className={styles.schoolHeader}>
          <h3>Minha Escola</h3>
          {user.type === 1 && (
            <button
              className={styles.editSchoolButton}
              onClick={openEditSchoolModal}
            >
              Editar Escola
            </button>
          )}
        </div>
        {user.school && (
          <div className={styles.schoolInfo}>
            <p>Nome: {user.school.name}</p>
            <p>Rua: {user.school.address?.street}</p>
            <p>Número: {user.school.address?.number}</p>
            <p>Complemento: {user.school.address?.complement}</p>
            <p>Cidade: {user.school.address?.city}</p>
            <p>Estado: {user.school.address?.state}</p>
            <p>Contato: {user.school.contact}</p>
            <p>Horário: {user.school.operatingHours}</p>
            {user.school.description && (
              <p>Descrição: {user.school.description}</p>
            )}
          </div>
        )}
        {!user.school && user.type === 1 && (
          <p>
            Nenhuma escola cadastrada. Clique em "Editar Escola" para cadastrar.
          </p>
        )}
      </div>

      <div className={styles.projectsSection}>
        <h3>Meus Projetos da Escola</h3>
        {user?.type === 1 && (
          <button
            className={styles.postProjectButton}
            onClick={openPostProjectModal}
          >
            Postar Novo Projeto
          </button>
        )}

        {projectsLoading && <div>Carregando projetos...</div>}
        {projectsError && <div>Erro ao carregar projetos: {projectsError}</div>}
        {projects.length > 0 && (
          <div className={styles.slickCarouselContainer}>
            {" "}
            <Slider {...settings}>
              {projects.map((project) => (
                <div
                  key={project.projectId}
                  className={styles.slickCarouselItemWrapper}
                >
                  {" "}
                  <div
                    className={styles.carouselItem}
                    onClick={() =>
                      navigate(`/project/${project.projectId}`, {
                        state: { currentUserId: user.userId },
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {project.imageUrls && project.imageUrls.length > 0 && (
                      <img
                        src={
                          project.imageUrls[0].url.startsWith("http://") ||
                          project.imageUrls[0].url.startsWith("https://")
                            ? project.imageUrls[0].url
                            : `https://localhost:7253${project.imageUrls[0].url}`
                        }
                        alt={project.name}
                        className={styles.projectImage}
                      />
                    )}
                    <h4 className={styles.projectName}>{project.name}</h4>
                    <p className={styles.projectDescription}>
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
        {projects.length === 0 && !projectsLoading && (
          <p>Nenhum projeto cadastrado para esta escola.</p>
        )}
      </div>

      {isEditSchoolModalOpen && editingSchool && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Editar Escola</h3>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.modalForm}>
              <label htmlFor="name">Nome da Escola:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editingSchool.name || ""}
                onChange={handleEditSchoolChange}
                required
              />
              <label htmlFor="address.street">Rua:</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={editingSchool.address?.street || ""}
                onChange={handleEditSchoolChange}
              />
              <label htmlFor="address.number">Número:</label>
              <input
                type="text"
                id="address.number"
                name="address.number"
                value={editingSchool.address?.number || ""}
                onChange={handleEditSchoolChange}
              />
              <label htmlFor="address.complement">Complemento:</label>
              <input
                type="text"
                id="address.complement"
                name="address.complement"
                value={editingSchool.address?.complement || ""}
                onChange={handleEditSchoolChange}
              />
              <label htmlFor="address.city">Cidade:</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={editingSchool.address?.city || ""}
                onChange={handleEditSchoolChange}
              />
              <label htmlFor="address.state">Estado:</label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={editingSchool.address?.state || ""}
                onChange={handleEditSchoolChange}
              />
              <label htmlFor="responsibleContact">Contato Responsável:</label>
              <input
                type="text"
                id="responsibleContact"
                name="contact"
                value={editingSchool.contact || ""}
                onChange={handleEditSchoolChange}
              />
              <label htmlFor="openingHours">Horário de Funcionamento:</label>
              <input
                type="text"
                id="openingHours"
                name="operatingHours"
                value={editingSchool.operatingHours || ""}
                onChange={handleEditSchoolChange}
              />
              <label htmlFor="description">Descrição (Opcional):</label>
              <textarea
                id="description"
                name="description"
                value={editingSchool.description || ""}
                onChange={handleEditSchoolChange}
              />
              <div className={styles.modalButtonContainer}>
                <button
                  className={styles.modalButton}
                  onClick={handleUpdateSchool}
                >
                  Salvar
                </button>
                <button
                  className={styles.modalButton}
                  onClick={closeEditSchoolModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPostProjectModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Postar Novo Projeto</h3>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {projectImageUploadError && (
              <p className={styles.uploadErrorMessage}>
                {projectImageUploadError}
              </p>
            )}
            <div className={styles.modalForm}>
              <label htmlFor="name">Nome do Projeto:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newProject.name}
                onChange={handleNewProjectChange}
                required
              />

              <label htmlFor="description">Descrição:</label>
              <textarea
                id="description"
                name="description"
                value={newProject.description}
                onChange={handleNewProjectChange}
              />

              <label htmlFor="tutorial">Tutorial (Opcional):</label>
              <textarea
                id="tutorial"
                name="tutorial"
                value={newProject.tutorial}
                onChange={handleNewProjectChange}
              />

              <label htmlFor="projectImageInput">Imagem do Projeto:</label>
              <input
                type="file"
                id="projectImageInput"
                name="projectImage"
                accept="image/*"
                onChange={handleProjectFileChange}
                className={styles.fileInput}
              />
              <label
                htmlFor="projectImageInput"
                className={styles.uploadButton}
              >
                {selectedProjectFile ? "Trocar Imagem" : "Selecionar Imagem"}
              </label>
              {previewProjectImage && (
                <img
                  src={previewProjectImage}
                  alt="Pré-visualização do Projeto"
                  className={styles.previewProjectImage}
                />
              )}

              <label htmlFor="ageRange">Faixa Etária:</label>
              <select
                id="ageRange"
                name="ageRange"
                value={newProject.ageRange}
                onChange={handleNewProjectChange}
              >
                <option value="">Selecione</option>
                <option value={1}>Infantil</option>
                <option value={2}>Fundamental</option>
                <option value={3}>Médio</option>
                <option value={4}>Adulto</option>
              </select>

              <label htmlFor="materialsList">Lista de Materiais:</label>
              <textarea
                id="materialsList"
                name="materialsList"
                value={newProject.materialsList}
                onChange={handleNewProjectChange}
              />

              <div className={styles.modalButtonContainer}>
                <button
                  className={styles.modalButton}
                  onClick={handleSaveNewProject}
                  disabled={uploadingProjectImage}
                >
                  {uploadingProjectImage ? "Salvando..." : "Salvar Projeto"}
                </button>
                <button
                  className={styles.modalButton}
                  onClick={closePostProjectModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
