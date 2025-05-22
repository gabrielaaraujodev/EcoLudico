import React from "react";
import styles from "../styles/ProjectFormModal.module.css";

function ProjectFormModal({
  isOpen,
  onClose,
  onSave,
  initialProjectData,
  userId,
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tutorial, setTutorial] = React.useState("");
  const [ageRange, setAgeRange] = React.useState(1);
  const [materialsList, setMaterialsList] = React.useState("");
  const [imageUrls, setImageUrls] = React.useState([]);
  const [imageFile, setImageFile] = React.useState(null);

  const API_BASE_URL = "https://localhost:7253";

  React.useEffect(() => {
    if (isOpen && initialProjectData) {
      setName(initialProjectData.name || "");
      setDescription(initialProjectData.description || "");
      setTutorial(initialProjectData.tutorial || "");
      setAgeRange(initialProjectData.ageRange || 1);
      setMaterialsList(initialProjectData.materialsList || "");
      setImageUrls(initialProjectData.imageUrls || []);
      setImageFile(null);
    } else if (isOpen && !initialProjectData) {
      setName("");
      setDescription("");
      setTutorial("");
      setAgeRange(1);
      setMaterialsList("");
      setImageUrls([]);
      setImageFile(null);
    }
  }, [isOpen, initialProjectData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert(
        "Erro: ID do usuário não disponível. Não é possível salvar o projeto."
      );
      return;
    }

    try {
      let response;

      if (initialProjectData && initialProjectData.projectId) {
        response = await fetch(
          `${API_BASE_URL}/api/Project/${initialProjectData.projectId}?userId=${userId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectId: initialProjectData.projectId,
              name,
              description,
              tutorial,
              ageRange: parseInt(ageRange),
              materialsList,
              imageUrls,
            }),
          }
        );
      } else {
        if (imageFile) {
          const formData = new FormData();
          formData.append("Name", name);
          formData.append("Description", description);
          formData.append("Tutorial", tutorial);
          formData.append("AgeRange", parseInt(ageRange));
          formData.append("MaterialsList", materialsList);
          formData.append("File", imageFile);

          response = await fetch(
            `${API_BASE_URL}/api/Project/upload-project-picture?userId=${userId}`,
            {
              method: "POST",
              body: formData,
            }
          );
        } else {
          const projectData = {
            name,
            description,
            tutorial,
            ageRange: parseInt(ageRange),
            materialsList,
            imageUrls,
          };

          response = await fetch(
            `${API_BASE_URL}/api/Project?userId=${userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(projectData),
            }
          );
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erro ao salvar projeto: ${response.status} - ${JSON.stringify(
            errorData.errors || errorData
          )}`
        );
      }

      const savedProject = await response.json();
      onSave(savedProject);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
      alert(`Erro: ${err.message}`);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{initialProjectData ? "Editar Projeto" : "Adicionar Projeto"}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome do Projeto:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Descrição:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              required
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="tutorial">Tutorial:</label>
            <textarea
              id="tutorial"
              value={tutorial}
              onChange={(e) => setTutorial(e.target.value)}
              rows="5"
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="ageRange">Faixa Etária:</label>
            <select
              id="ageRange"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
            >
              <option value={1}>Infantil</option>
              <option value={2}>Fundamental</option>
              <option value={3}>Médio</option>
              <option value={4}>Adulto</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="materialsList">Materiais Utilizados:</label>
            <textarea
              id="materialsList"
              value={materialsList}
              onChange={(e) => setMaterialsList(e.target.value)}
              rows="3"
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newImageFile">Adicionar nova imagem:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImageUrls((prev) => [...prev, reader.result]);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          {imageUrls.length > 0 && (
            <div className={styles.imagePreviewContainer}>
              {imageUrls.map((url, index) => (
                <div key={index} className={styles.imageItem}>
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className={styles.imagePreview}
                  />
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => {
                      setImageUrls((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      if (index === imageUrls.length - 1 && imageFile) {
                        setImageFile(null);
                      }
                    }}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={styles.formActions}>
            <button type="submit">
              {initialProjectData ? "Atualizar" : "Adicionar"}
            </button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectFormModal;
