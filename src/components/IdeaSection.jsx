import React from "react";

import worldImage from "../images/firstHomeImage.svg";

import styles from "../styles/IdeaSection.module.css";

function IdeaSection() {
  return (
    <section className={styles.section}>
      <div className={styles.textContent}>
        <h1>Go Green !</h1>
        <h3>Acreditamos no poder da união para transformar a educação. </h3>
        <p>
          Professores com projetos inovadores e doadores com o desejo de
          impactar positivamente o futuro: esta é a sua oportunidade de se
          conectar. Descubra como juntos podemos impulsionar a educação e fazer
          a diferença na vida de muitos. Seja parte desta jornada
          transformadora.
        </p>
      </div>

      <div className={styles.imageContent}>
        <img src={worldImage} alt="E-Waste Planet" />
      </div>
    </section>
  );
}

export default IdeaSection;
