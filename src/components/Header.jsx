import React from "react";

import { useNavigate } from "react-router-dom";

import styles from "../styles/Header.module.css";

import logo from "../images/newLogoDesign.svg";
import { FiMenu } from "react-icons/fi";

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const navigate = useNavigate();

  const goToSignIn = () => {
    navigate("/signin");
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClick = (e, id) => {
    e.preventDefault();

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
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
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a
              href="/#servicesSection"
              onClick={(e) => handleClick(e, "servicesSection")}
            >
              Sobre Nós
            </a>
          </li>
          <li>
            <a href="/#footer" onClick={(e) => handleClick(e, "footer")}>
              Contato
            </a>
          </li>
          <li className={styles.buttonsContainer}>
            {" "}
            <button className={styles.btnSignIn} onClick={goToSignIn}>
              SIGN IN
            </button>
            <button className={styles.btnRegister} onClick={goToSignUp}>
              REGISTER
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
