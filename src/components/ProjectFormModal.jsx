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
  const [images, setImages] = React.useState([]);

  const API_BASE_URL = "https://localhost:7253";

  React.useEffect(() => {
    if (isOpen && initialProjectData) {
      setName(initialProjectData.name || "");
      setDescription(initialProjectData.description || "");
      setTutorial(initialProjectData.tutorial || "");
      setAgeRange(initialProjectData.ageRange || 1);
      setMaterialsList(initialProjectData.materialsList || "");

      const existingImages = (initialProjectData.imageUrls || []).map(
        (url, index) => ({
          id: `existing-${initialProjectData.projectId}-${index}`,
          url: `${API_BASE_URL}${url}`,
          file: null,
          isNew: false,
        })
      );
      setImages(existingImages);
    } else if (isOpen && !initialProjectData) {
      setName("");
      setDescription("");
      setTutorial("");
      setAgeRange(1);
      setMaterialsList("");
      setImages([]);
    }
  }, [isOpen, initialProjectData, API_BASE_URL]);

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
      let projectResponse;
      let imagesResponse;

      if (initialProjectData && initialProjectData.projectId) {
        const imagesFormData = new FormData();

        const existingImageUrlsToKeep = images
          .filter((img) => !img.isNew && img.url)
          .map((img) =>
            img.url.replace(/^\/+/, "").replace(/^https?:\/\/[^/]+\//, "")
          );

        existingImageUrlsToKeep.forEach((url) => {
          console.log("Adicionando KeepImageUrls ao FormData:", url);
          imagesFormData.append("KeepImageUrls", url);
        });

        images
          .filter((img) => img.isNew && img.file)
          .forEach((img) => {
            console.log("Adicionando NewFile ao FormData:", img.file.name);
            imagesFormData.append("NewFiles", img.file);
          });

        if (
          imagesFormData.getAll("NewFiles").length > 0 ||
          imagesFormData.getAll("KeepImageUrls").length > 0
        ) {
          imagesResponse = await fetch(
            `${API_BASE_URL}/api/Project/${initialProjectData.projectId}/images?userId=${userId}`,
            {
              method: "PUT",
              body: imagesFormData,
            }
          );

          if (!imagesResponse.ok) {
            const errorData = await imagesResponse.json();
            throw new Error(
              `Erro ao atualizar imagens: ${
                imagesResponse.status
              } - ${JSON.stringify(errorData.errors || errorData)}`
            );
          }
        }
        const updatedProject = await fetch(
          `${API_BASE_URL}/api/Project/${initialProjectData.projectId}?userId=${userId}`
        );
        if (!updatedProject.ok) {
          throw new Error("Falha ao recarregar o projeto após atualização.");
        }
        const savedProject = await updatedProject.json();
        onSave(savedProject);
        onClose();
      } else {
        const newImageForCreation = images.find((img) => img.isNew);

        if (newImageForCreation && newImageForCreation.file) {
          const formDataCreate = new FormData();
          formDataCreate.append("Name", name);
          formDataCreate.append("Description", description);
          formDataCreate.append("Tutorial", tutorial);
          formDataCreate.append("AgeRange", parseInt(ageRange));
          formDataCreate.append("MaterialsList", materialsList);
          formDataCreate.append("File", newImageForCreation.file);

          projectResponse = await fetch(
            `${API_BASE_URL}/api/Project/upload-project-picture?userId=${userId}`,
            {
              method: "POST",
              body: formDataCreate,
            }
          );
        } else {
          const projectData = {
            name,
            description,
            tutorial,
            ageRange: parseInt(ageRange),
            materialsList,
            imageUrls: [],
          };

          projectResponse = await fetch(
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

        if (!projectResponse.ok) {
          const errorData = await projectResponse.json();
          throw new Error(
            `Erro ao criar projeto: ${
              projectResponse.status
            } - ${JSON.stringify(errorData.errors || errorData)}`
          );
        }

        const savedProject = await projectResponse.json();
        onSave(savedProject);
        onClose();
      }
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
              id="newImageFile"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImages((prevImages) => [
                      ...prevImages,
                      {
                        id: `new-${Date.now()}-${file.name}`,
                        url: reader.result,
                        file: file,
                        isNew: true,
                      },
                    ]);
                    e.target.value = "";
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          {images.length > 0 && (
            <div className={styles.imagePreviewContainer}>
              {images.map((image, index) => (
                <div key={image.id} className={styles.imageItem}>
                  {" "}
                  <img
                    src={image.url}
                    alt={`Preview ${index}`}
                    className={styles.imagePreview}
                  />
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => {
                      setImages((prev) =>
                        prev.filter((img) => img.id !== image.id)
                      );
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
