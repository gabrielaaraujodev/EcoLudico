import React from "react";

import { useNavigate } from "react-router-dom";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import styles from "../styles/CollectionPoints.module.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function CollectionPoints({ currentUserId }) {
  const [userName, setUserName] = React.useState("");
  const [userLocation, setUserLocation] = React.useState(null);

  const [nearSchools, setNearSchools] = React.useState([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      console.error("ID do usuário não encontrado na sessão.");
      return;
    }

    fetch(`https://localhost:7253/api/User/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar usuário");
        return res.json();
      })
      .then((user) => {
        if (
          user.type === 2 &&
          user.address &&
          user.address.latitude &&
          user.address.longitude
        ) {
          const lat = parseFloat(user.address.latitude);
          const lng = parseFloat(user.address.longitude);
          setUserLocation({ lat, lng });
          setUserName(user.name);
        } else {
          alert("Você precisa ser um doador para acessar pontos de coleta.");
          navigate(`/profile`, { state: { currentUserId: currentUserId } });
        }
      })
      .catch((err) => {
        console.error(err);
        alert(`Erro ao carregar dados do usuário: ${err.message}`);
      });
  }, [navigate]);

  React.useEffect(() => {
    if (!userLocation) return;

    fetch("https://localhost:7253/api/school")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar escolas");
        return res.json();
      })
      .then((escolas) => {
        const userLatLng = L.latLng(userLocation.lat, userLocation.lng);

        const escolasFiltradas = escolas.filter((escola) => {
          if (
            !escola.address ||
            !escola.address.latitude ||
            !escola.address.longitude
          ) {
            console.warn(
              `Escola ${escola.name} não possui informações de endereço completas e será ignorada.`
            );
            return false;
          }

          const lat = parseFloat(escola.address.latitude);
          const lng = parseFloat(escola.address.longitude);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(
              `Coordenadas inválidas para a escola ${escola.name}: lat=${escola.address.latitude}, lng=${escola.address.longitude}`
            );
            return false;
          }

          const escolaLatLng = L.latLng(lat, lng);
          const distancia = userLatLng.distanceTo(escolaLatLng);

          return distancia <= 20000;
        });

        setNearSchools(escolasFiltradas);
      })
      .catch((err) => {
        console.error(err);
        alert(`Erro ao carregar escolas: ${err.message}`);
      });
  }, [userLocation]);

  if (!userLocation)
    return (
      <div className={styles.loadingMessage}>
        Carregando localização do usuário...
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Pontos de coleta próximos de {userName}</h2>
      </div>

      <div className={styles.mapWrapper}>
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Sua Localização - {userName}</Popup>
          </Marker>

          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={20000}
            color="blue"
            fillOpacity={0.1}
          />

          {nearSchools.map((escola, idx) => {
            if (
              !escola.address ||
              isNaN(parseFloat(escola.address.latitude)) ||
              isNaN(parseFloat(escola.address.longitude))
            ) {
              return null;
            }
            const lat = parseFloat(escola.address.latitude);
            const lng = parseFloat(escola.address.longitude);

            const goToSchoolOwner = () => {
              navigate("/profile", {
                state: { currentUserId: escola.ownerUserId },
              });
            };

            return (
              <Marker key={idx} position={[lat, lng]}>
                <Popup>
                  <div
                    className={styles.popupContent}
                    onClick={goToSchoolOwner}
                  >
                    <strong>{escola.name}</strong>
                    <br />
                    {escola.address.street}, {escola.address.number}
                    <br />
                    {escola.address.city} - {escola.address.state}
                    <br />
                    Contato: {escola.contact}
                    <br />
                    <em>Clique aqui para ver o perfil do professor</em>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default CollectionPoints;
