import recycleTrash from "../images/recycleTrash.svg";
import nature from "../images/nature.svg";
import world from "../images/world.svg";

import styles from "../styles/RewardsSection.module.css";

function RewardsSection() {
  return (
    <section id="rewardsSection">
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>
            O que você estará realizando ao doar seus materiais recicláveis ?
          </h1>
        </div>
        <div className={styles.features}>
          <img
            src={recycleTrash}
            alt="Materiais Recicláveis"
            className={styles["animate-image-1"]}
          />
          <h1>Retirar materiais inutilizados de casa.</h1>
          <p>
            Limpe sua casa de materiais recicláveis que não está utilizando sem
            preocupações.
          </p>
        </div>
        <div className={styles.features}>
          <img
            src={nature}
            alt="Ajude a natureza"
            className={styles["animate-image-2"]}
          />
          <h1>Ajude a natureza</h1>
          <p>
            Destinando os materiais aos locais corretos, você está ajudando a
            natureza.
          </p>
        </div>
        <div className={styles.features}>
          <img
            src={world}
            alt="Salve o mundo"
            className={styles["animate-image-3"]}
          />
          <h1>Salve o mundo</h1>
          <p>
            Ao reciclar qualquer tipo de material, você ajuda a reduzir o
            impacto ambiental. Materiais destinados aos locais corretos faz
            comque possamos desviar materiais nocivos dos aterros sanitários,
            conservamos recursos e minimizamos a poluição.
          </p>
        </div>
      </div>
    </section>
  );
}

export default RewardsSection;
