import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.svg";
import styles from "../styles/Header.module.css";
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
