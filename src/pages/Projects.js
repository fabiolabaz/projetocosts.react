import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Loading from "../layout/Loading";
import Container from "../layout/Container";
import Message from "../layout/Message";
import LinkButton from "../layout/LinkButton";
import ProjectCard from "../project/ProjectCard";

import styles from "./Projects.module.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [projectMessage, setProjectMessage] = useState("");

  const location = useLocation();
  const message = location.state?.message || "";

  // Remover projeto
  function removeProject(id) {
    fetch(`https://projeto-costs.onrender.com/projects/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setProjectMessage("Projeto removido com sucesso!");
      })
      .catch((err) => console.log(err));
  }

  // Carregar projetos
  useEffect(() => {
    fetch("https://projeto-costs.onrender.com/projects")
      .then((resp) => resp.json())
      .then((data) => {
        setProjects(data);
        setRemoveLoading(true);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
      </div>

      {message && <Message type="success" msg={message} />}
      {projectMessage && <Message type="success" msg={projectMessage} />}

      <Container customClass="start">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              budget={project.budget}
              category={project.category?.name || "Sem categoria"}
              handleRemove={removeProject}
            />
          ))
        ) : (
          <p>{removeLoading ? "Não há projetos cadastrados" : ""}</p>
        )}

        {!removeLoading && <Loading />}
      </Container>
    </div>
  );
}

export default Projects;
