import React, { useState } from "react";
import logo from "../images/logo.svg";
import styles from "../styles/Header.module.css";
import { FiMenu } from "react-icons/fi";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <nav className={styles.nav}>
        <div className={styles.logoTitulo}>
          <img src={logo} alt="Logo Eco Lúdico" />
          <h1 className={styles.titulo}>Eco Lúdico</h1>
        </div>

        <FiMenu className={styles.menuIcon} onClick={toggleMenu} />

        <ul className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}>
          <li>Home</li>
          <li>Sobre Nós</li>
          <li>Contato</li>
          <li className={styles.buttonsContainer}>
            {" "}
            {/* Novo container para os botões */}
            <button className={styles.btnSignIn}>SIGN IN</button>
            <button className={styles.btnRegister}>REGISTER</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
