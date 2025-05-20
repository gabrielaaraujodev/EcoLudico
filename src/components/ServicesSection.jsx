import styles from "../styles/ServicesSection.module.css";

import sCenter from "../images/sCenter.svg";
import sMatch from "../images/sMatch.svg";
import sRecycling from "../images/sRecycling.svg";
import sReuse from "../images/sReuse.svg";

function ServicesSection() {
  return (
    <section>
      <div className={styles.container}>
        <h1 className={styles.title}>Serviços Oferecidos</h1>
        <p className={styles.subTitle}>
          Oferecemos uma solução dinâmica e prática para quem busca ter hábitos
          conscêntes com facilitadores para encotrar locais de coleta de
          materiais recicláveis próximos a você para que possa entregá-los.
        </p>

        <div className={styles.containerGrid}>
          <div className={styles.itemGrid}>
            <img src={sRecycling} alt="Simbolo de Reciclagem" />
            <h1>Reciclagem</h1>
            <p>
              O Eco Lúdico atua na Reciclagem de qualquer tipo de material. O
              objetivo é reutilizar esses materiais de forma didática em escolas
              para diversão e consciêntização das crianças e jóvens buscando a
              preservação do meio ambiente e os recursos naturais.
            </p>
          </div>
          <div className={styles.itemGrid}>
            <img src={sMatch} alt="Simbolo de Reciclagem" />
            <h1>Entrega Perto</h1>
            <p>
              O Eco Lúdico oferece os locais mais próximos a você para que possa
              ter mais conforto e rapidez na sua doação.
            </p>
          </div>
          <div className={styles.itemGrid}>
            <img src={sReuse} alt="Simbolo de Reciclagem" />
            <h1>Recuperação de Materiais</h1>
            <p>
              Os materiais doados que possa apresentar algum tipo de desgaste
              que o torne, talvez, inutilizável tentará ser tratado para que
              possa ser reaproveitado. A ideia é buscar o mínimo de disperdício
              dos materiais doados.
            </p>
          </div>
          <div className={styles.itemGrid}>
            <img src={sCenter} alt="Simbolo de Reciclagem" />
            <h1>Remodelação</h1>
            <p>
              Os materiais doados serão transformadosem quaisquer tipos de
              objeto que possa ser utilizado por crianças e jóvens para diversão
              e/ou aprendizado nas escolas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
