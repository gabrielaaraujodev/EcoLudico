import React from "react";

import logo from "../images/logo.svg";

import styles from "../styles/Header.module.css";

function Header() {
  return (
    <header>
      <nav className={styles.nav}>
        <div className={styles.logoTitulo}>
          <img src={logo} alt="Logo Site" />
          <p className={styles.titulo}>Eco Lúdico</p>
        </div>

        <ul className={styles.links}>
          <li>Home</li>
          <li>Sobre Nós</li>
          <li>Contato</li>
        </ul>

        <div className={styles.buttons}>
          <button className={styles.btnSignIn}>SIGN IN</button>
          <button className={styles.btnRegister}>REGISTER</button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
