import { Link } from "react-router-dom";
import styles from "../styles/HeaderLogado.module.css";
import logo from "../images/logo.svg";

function HeaderLogado({ onLogout, currentUserId }) {
  return (
    <header className={styles.header}>
      <nav>
        <ul>
          <li>
            <Link to="/pontos-de-coleta">Pontos de Coleta</Link>
          </li>
          <li>
            <Link to="/projetos" state={{ currentUserId: currentUserId }}>
              Projetos
            </Link>
          </li>
          <li>
            <Link
              to="/favorite-projects"
              state={{ currentUserId: currentUserId }}
            >
              Projetos Favoritados
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={styles.profileLink}
              state={{ currentUserId: currentUserId }}
            >
              <img src={logo} alt="Perfil" className={styles.profileIcon} />
            </Link>
          </li>
          <li>
            <button className={styles.logoutButton} onClick={onLogout}>
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default HeaderLogado;
