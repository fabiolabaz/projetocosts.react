import { Link } from "react-router-dom";
import styles from "../project/ProjectCard.module.css";
import { BsFillTrashFill } from "react-icons/bs";

function ProjectCard({ id, name, budget, category, handleRemove }) {
  return (
    <div className={styles.project_card}>
      <h4>{name}</h4>
      <p>
        <span>Orçamento:</span> R$ {budget}
      </p>
      <p>
        <span>Categoria:</span> {category}
      </p>

      <div className={styles.project_card_actions}>
        {/* Primeiro: Link para detalhes do projeto */}
        <Link to={`/project/${id}`} className={styles.btn_link}>
          Ver Projeto
        </Link>

        {/* Depois: botão remover */}
        <button onClick={() => handleRemove(id)}>
          <BsFillTrashFill /> Excluir
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
