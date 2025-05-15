import React from "react";
import { useNavigate } from "react-router-dom";

import useForm from "../components/useForm";
import InputText from "./InputText";

import styles from "../styles/SignUpPage.module.css";

import Leaftlet from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

const personalFieldsConfig = [
  { label: "Nome", name: "name", type: "text", required: true },
  { label: "E-mail", name: "email", type: "email", required: true },
  { label: "Senha", name: "password", type: "password", required: true },
  {
    label: "Confirmar Senha",
    name: "confirmPassword",
    type: "password",
    required: true,
  },
  {
    label: "Data de Nascimento",
    name: "dateBirth",
    type: "date",
    required: true,
  },
];

const addressFieldsConfig = [
  { label: "Rua", name: "addressStreet", type: "text", required: true },
  { label: "Número", name: "addressNumber", type: "text", required: true },
  { label: "Complemento", name: "addressComplement", type: "text" },
  { label: "Cidade", name: "addressCity", type: "text", required: true },
  { label: "Estado", name: "addressState", type: "text", required: true },
];

const schoolFieldsConfig = [
  { label: "Nome da Escola", name: "schoolName", type: "text", required: true },
  {
    label: "Rua",
    name: "schoolAddressStreet",
    type: "text",
    required: true,
  },
  {
    label: "Número",
    name: "schoolAddressNumber",
    type: "text",
    required: true,
  },
  {
    label: "Complemento",
    name: "schoolAddressComplement",
    type: "text",
  },
  {
    label: "Cidade",
    name: "schoolAddressCity",
    type: "text",
    required: true,
  },
  {
    label: "Estado",
    name: "schoolAddressState",
    type: "text",
    required: true,
  },
  { label: "Latitude", name: "schoolLatitude", type: "text" },
  { label: "Longitude", name: "schoolLongitude", type: "text" },
  { label: "Contato Responsável", name: "schoolContact", type: "text" },
  {
    label: "Horário de Funcionamento",
    name: "schoolOperatingHours",
    type: "text",
  },
];

const initialValues = {
  type: "2",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  dateBirth: "",
  address: {
    addressStreet: "",
    addressNumber: "",
    addressComplement: "",
    addressCity: "",
    addressState: "",
    latitude: "",
    longitude: "",
  },
  school: {
    schoolName: "",
    schoolAddressStreet: "",
    schoolAddressNumber: "",
    schoolAddressComplement: "",
    schoolAddressCity: "",
    schoolAddressState: "",
    schoolLatitude: "",
    schoolLongitude: "",
    schoolContact: "",
    schoolOperatingHours: "",
  },
};

function SignUpPage() {
  const [values, handleChange, setValues] = useForm(initialValues);

  const [error, setError] = React.useState("");
  const [page, setPage] = React.useState(1);

  const mapRef = React.useRef(null);
  const schoolMapRef = React.useRef(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (page === 2) {
      const mapContainer = Leaftlet.DomUtil.get("address-map");

      if (mapContainer && !mapRef.current) {
        const map = Leaftlet.map(mapContainer).setView(
          [-19.9208, -43.9388],
          13
        );

        Leaftlet.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(map);
        Leaftlet.Control.geocoder({
          defaultMarkGeocode: false,
          collapsed: true,
          placeholder: "Digite o endereço",
        })
          .on("markgeocode", (e) => {
            const latlng = e.geocode.center;
            const addressParts = e.geocode.name.split(",");
            const city =
              e.geocode.properties?.address?.city ||
              e.geocode.properties?.address?.town ||
              e.geocode.properties?.address?.village ||
              "";
            const state = e.geocode.properties?.address?.state || "";
            setValues((prevValues) => ({
              ...prevValues,
              address: {
                ...prevValues.address,
                addressStreet: addressParts[0]?.trim() || "",
                addressCity: city?.trim() || "",
                addressState: state?.trim() || "",
                latitude: latlng.lat, // Atualiza diretamente no objeto address
                longitude: latlng.lng, // Atualiza diretamente no objeto address
              },
            }));
            map.setView(latlng, 16);
            Leaftlet.marker(latlng).addTo(map);
          })
          .addTo(map);
        mapRef.current = map;
      } else if (mapContainer && mapRef.current) {
        setTimeout(() => mapRef.current?.invalidateSize(), 0);
      } else if (!mapContainer && mapRef.current) {
        mapRef.current = null;
      }
    } else {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    }

    // Lógica similar para a escola (page === 3)
    if (page === 3 && values.type === "1") {
      const mapContainer = Leaftlet.DomUtil.get("school-address-map");
      if (mapContainer && !schoolMapRef.current) {
        const map = Leaftlet.map(mapContainer).setView(
          [-19.9208, -43.9388],
          13
        );
        Leaftlet.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(map);
        Leaftlet.Control.geocoder({
          defaultMarkGeocode: false,
          collapsed: true,
          placeholder: "Digite o endereço da escola",
        })
          .on("markgeocode", (e) => {
            const latlng = e.geocode.center;
            const addressParts = e.geocode.name.split(",");
            const city =
              e.geocode.properties?.address?.city ||
              e.geocode.properties?.address?.town ||
              e.geocode.properties?.address?.village ||
              "";
            const state = e.geocode.properties?.address?.state || "";
            setValues((prevValues) => ({
              ...prevValues,
              school: {
                ...prevValues.school,
                schoolAddressStreet: addressParts[0]?.trim() || "",
                schoolAddressCity: city?.trim() || "",
                schoolAddressState: state?.trim() || "",
                latitude: latlng.lat, // Atualiza diretamente no objeto school
                longitude: latlng.lng, // Atualiza diretamente no objeto school
              },
            }));
            map.setView(latlng, 16);
            Leaftlet.marker(latlng).addTo(map);
          })
          .addTo(map);
        schoolMapRef.current = map;
      } else if (mapContainer && schoolMapRef.current) {
        setTimeout(() => schoolMapRef.current?.invalidateSize(), 0);
      } else if (!mapContainer && schoolMapRef.current) {
        schoolMapRef.current = null;
      }
    } else {
      if (schoolMapRef.current) {
        schoolMapRef.current.remove();
        schoolMapRef.current = null;
      }
    }
  }, [page, values.type, setValues]);

  const goToNextPage = () => {
    setPage(page + 1);
  };

  const goToPreviousPage = () => {
    setPage(page - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (values.password !== values.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    const userData = {
      Type: parseInt(values.type),
      Name: values.name,
      Email: values.email,
      Password: values.password,
      DateBirth: values.dateBirth,
      Address: {
        // Corrigindo o case para corresponder ao AddressDTO
        Street: values.address.addressStreet,
        Number: values.address.addressNumber,
        Complement: values.address.addressComplement,
        City: values.address.addressCity,
        State: values.address.addressState,
        Latitude: String(values.address.latitude),
        Longitude: String(values.address.longitude),
      },
      School:
        values.type === "1"
          ? {
              Name: values.school.schoolName,
              Address: {
                // Caso a SchoolCreateDTO.Address também tenha case diferente
                Street: values.school.schoolAddressStreet,
                Number: values.school.schoolAddressNumber,
                Complement: values.school.schoolAddressComplement,
                City: values.school.schoolAddressCity,
                State: values.school.schoolAddressState,
                Latitude: String(values.school.latitude),
                Longitude: String(values.school.longitude),
              },
              Contact: values.school.schoolContact,
              OperatingHours: values.school.schoolOperatingHours,
            }
          : null,
    };

    try {
      const response = await fetch("https://localhost:7253/api/User/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        navigate("/signin");
      } else {
        const errorData = await response.json();
        setError(
          errorData?.errors?.[""]?.[0] ||
            errorData?.title ||
            `Erro no registro: ${response.statusText}`
        );
      }
    } catch (error) {
      setError("Erro de conexão com o servidor.");
      console.error("Erro ao registrar:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Cadastrar</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {page === 1 && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="type">Tipo de Usuário</label>
                <select
                  id="type"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  required
                  className={styles.inputGroup}
                >
                  <option value="2">Doador</option>
                  <option value="1">Professor</option>
                </select>
              </div>

              {personalFieldsConfig.map((field) => (
                <InputText
                  key={field.name}
                  {...field}
                  value={values[field.name]}
                  onChange={handleChange}
                />
              ))}

              <button
                type="button"
                className={styles.nextButton}
                onClick={goToNextPage}
              >
                Próximo
              </button>
            </>
          )}

          {page === 2 && (
            <>
              <h3>Endereço</h3>
              <div
                id="address-map"
                style={{ height: "300px", width: "100%", marginBottom: "20px" }}
              ></div>
              {addressFieldsConfig.map((field) => (
                <InputText
                  key={field.name}
                  {...field}
                  name={`address.${field.name}`} // <---- MODIFICAÇÃO AQUI
                  value={values.address[field.name]}
                  onChange={handleChange}
                />
              ))}
              <div className={styles.formContainer}>
                <button
                  type="button"
                  className={styles.prevButton}
                  onClick={goToPreviousPage}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className={styles.nextButton}
                  onClick={values.type === "1" ? goToNextPage : handleSubmit}
                >
                  {values.type === "1" ? "Próximo" : "Cadastrar"}
                </button>
              </div>
            </>
          )}

          {page === 3 && values.type === "1" && (
            <>
              <h3>Dados da Escola</h3>
              <div
                id="school-address-map"
                style={{ height: "300px", width: "100%", marginBottom: "20px" }}
              ></div>
              {schoolFieldsConfig.map((field) => (
                <InputText
                  key={field.name}
                  {...field}
                  name={`school.${field.name}`} // <---- MODIFICAÇÃO AQUI
                  value={values.school[field.name]}
                  onChange={handleChange}
                />
              ))}
              <div className={styles.formContainer}>
                <button
                  type="button"
                  className={styles.prevButton}
                  onClick={goToPreviousPage}
                >
                  Anterior
                </button>
                <button type="submit" className={styles.registerButton}>
                  Cadastrar
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
