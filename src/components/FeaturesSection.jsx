import collecting from "../images/collecting.svg";
import doll from "../images/doll.png";
import children from "../images/children.png";

import styles from "../styles/FeaturesSection.module.css";

function FeaturesSection() {
  return (
    <section className={styles.section} id="featuresSection">
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Passo a passo</p>
          <h1>O que buscamos que seja feito ?</h1>
        </div>
        <div className={styles.features}>
          <img
            src={collecting}
            alt="Materiais Recicláveis"
            className={styles["animate-image-1"]}
          />
          <h1>Doação e Coleta</h1>
          <p>
            Facilitamos a encontrar pontos de coleta para doadores que estão
            interessados em achar um ótimo destino para seus materiais
            reclicáveis. O recebimento é feito de maneira prática e cuidadosa,
            pois serão transformados em diversão para crianças e jóvens.
          </p>
        </div>
        <div className={styles.features}>
          <img
            src={doll}
            alt="Boneco Reciclável"
            className={styles["animate-image-2"]}
          />
          <h1>Transformar</h1>
          <p>
            Ao reciclar lixo eletrônico, você nos ajuda a reduzir o impacto
            ambiental do lixo eletrônico. Desviamos materiais nocivos dos
            aterros sanitários, conservamos recursos e minimizamos a poluição.
          </p>
        </div>
        <div className={styles.features}>
          <img
            src={children}
            alt="Crianças Brincando"
            className={styles["animate-image-3"]}
          />
          <h1>Utilizar</h1>
          <p>
            Ao reciclar lixo eletrônico, você nos ajuda a reduzir o impacto
            ambiental do lixo eletrônico. Desviamos materiais nocivos dos
            aterros sanitários, conservamos recursos e minimizamos a poluição.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
