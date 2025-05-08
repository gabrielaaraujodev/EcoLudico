import React from "react";

import styles from "../styles/Footer.module.css";

import logo from "../images/logo2.svg";

function Footer() {
  return (
    <footer>
      <div className={styles.container}>
        <div className={styles.logoTitulo}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <p className={styles.titulo}>Eco Lúdico</p>
        </div>

        <ul className={styles.list}>
          <a href="">
            <li>Ideia</li>
          </a>
          <a href="">
            <li>Passo a Passo</li>
          </a>
          <a href="">
            <li>Realização ao doar</li>
          </a>
          <a href="">
            <li>Processo</li>
          </a>
          <a href="">
            <li>Serviços</li>
          </a>
        </ul>

        <div className={styles.contato}>
          <p>Contato</p>
          <p>xxxxxxx@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
