import React from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import { Navigate, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function CollectionPoints() {
  const [userLocation, setUserLocation] = React.useState(null);
  const [nearSchools, setNearSchools] = React.useState([]);
  const [userName, setUserName] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    fetch(`https://localhost:7253/api/User/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar usuário");
        return res.json();
      })
      .then((user) => {
        if (
          user.type === 2 &&
          user.address.latitude &&
          user.address.longitude
        ) {
          const lat = parseFloat(user.address.latitude);
          const lng = parseFloat(user.address.longitude);
          setUserLocation({ lat, lng });
          setUserName(user.name);
        } else {
          throw new Error(
            "Usuário não é doador ou não tem localização definida."
          );
        }
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  }, []);

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
          const lat = parseFloat(escola.address.latitude);
          const lng = parseFloat(escola.address.longitude);
          const escolaLatLng = L.latLng(lat, lng);
          const distancia = userLatLng.distanceTo(escolaLatLng);
          return distancia <= 20000; // 20 km
        });

        setNearSchools(escolasFiltradas);
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  }, [userLocation]);

  if (!userLocation) return <p>Carregando localização do usuário...</p>;

  return (
    <div>
      <h2>Pontos de coleta próximos de {userName}</h2>
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
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
                <div style={{ cursor: "pointer" }} onClick={goToSchoolOwner}>
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
  );
}

export default CollectionPoints;
