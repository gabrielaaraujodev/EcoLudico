import React from "react";

import ServicesSection from "./ServicesSection";

import location from "../images/location.png";
import delivery from "../images/delivery.png";
import robot from "../images/robot.png";
import googleMaps from "../images/googleMaps.svg";

import styles from "../styles/ProcedureSection.module.css";

function ProcedureSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Como o processo funciona ?</h1>

        <div className={styles.divLinks}>
          <ul className={styles.links}>
            <li>
              <img src={location} alt="Localização" />
              <p>Local</p>
            </li>
            <li>
              <img src={delivery} alt="Caminhão de entrega" />
              <p>Entrega</p>
            </li>
            <li>
              <img src={robot} alt="Robô" />
              <p>Transformação do material</p>
            </li>
          </ul>
          <img
            src={googleMaps}
            alt="Google Maps"
            className={styles.googleMaps}
          />
        </div>
      </div>
      <ServicesSection />
    </section>
  );
}

export default ProcedureSection;
