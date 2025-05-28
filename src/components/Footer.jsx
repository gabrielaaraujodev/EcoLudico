import styles from "../styles/Footer.module.css";

import logo from "../images/newLogoDesign.svg";

function Footer() {
  const handleClick = (e, id) => {
    e.preventDefault();

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <footer id="footer">
      <div className={styles.container}>
        <div className={styles.logoTitulo}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <p className={styles.titulo}>Eco Lúdico</p>
        </div>

        <ul className={styles.list}>
          <li>
            <a
              href="#ideaSection"
              onClick={(e) => handleClick(e, "ideaSection")}
            >
              Ideia
            </a>
          </li>
          <li>
            <a
              href="#featuresSection"
              onClick={(e) => handleClick(e, "featuresSection")}
            >
              Passo a Passo
            </a>
          </li>
          <li>
            <a
              href="#rewardsSection"
              onClick={(e) => handleClick(e, "rewardsSection")}
            >
              O que é realizado ao doar ?
            </a>
          </li>
          <li>
            <a
              href="#procedureSection"
              onClick={(e) => handleClick(e, "procedureSection")}
            >
              Processo
            </a>
          </li>
          <li>
            <a
              href="#servicesSection"
              onClick={(e) => handleClick(e, "servicesSection")}
            >
              Serviços
            </a>
          </li>
        </ul>

        <div className={styles.contato}>
          <p>Contato</p>
          <p>ecoludico@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
