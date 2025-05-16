import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/Profile.module.css";

function Profile({ isLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const userIdFromNavigation = location.state?.userId;
  const [isEditSchoolModalOpen, setIsEditSchoolModalOpen] =
    React.useState(false);
  const [editingSchool, setEditingSchool] = React.useState(null);

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
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn, navigate, userIdFromNavigation]);

  const handleEditProfileClick = () => {
    navigate("/edit-profile");
  };

  const openEditSchoolModal = () => {
    if (user?.school) {
      setEditingSchool({
        schoolId: user.schoolId,
        name: user.school.name,
        description: user.school.description,
        contact: user.school.contact,
        operatingHours: user.school.operatingHours,
        address: { ...user.school.address },
      });
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
    } else if (name === "responsibleContact") {
      setEditingSchool((prevState) => ({
        ...prevState,
        contact: value,
      }));
    } else if (name === "openingHours") {
      setEditingSchool((prevState) => ({
        ...prevState,
        operatingHours: value,
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
            contact: editingSchool.contact,
            operatingHours: editingSchool.operatingHours,
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

  if (loading) {
    return <div>Carregando dados do usuário...</div>;
  }

  if (error && !isEditSchoolModalOpen) {
    return <div>Erro ao carregar dados do usuário: {error}</div>;
  }

  if (!user) {
    return <div>Nenhum dado de usuário disponível.</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileImagePlaceholder}>
          {user.profilePicture && (
            <img
              src={user.profilePicture}
              alt="Profile"
              className={styles.profileImage}
            />
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
                name="responsibleContact"
                value={editingSchool.contact || ""}
                onChange={handleEditSchoolChange}
              />
              <label htmlFor="openingHours">Horário de Funcionamento:</label>
              <input
                type="text"
                id="openingHours"
                name="openingHours"
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
    </div>
  );
}

export default Profile;
