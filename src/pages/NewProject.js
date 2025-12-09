import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "../layout/Container";
import ProjectForm from "../project/ProjectForm";
import styles from "./NewProject.module.css";
import Message from "../layout/Message";

function NewProject() {
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const [message, setMessage] = useState("");

  // Função para criar o projeto
  function createPost(projectData) {
    // Validar orçamento
    if (projectData.budget < 0) {
      setMessage("O orçamento deve ser maior ou igual a 0!");
      return;
    }

    fetch("http://localhost:5000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    })
      .then((resp) => resp.json())
      .then((data) => {
        navigate("/projects", {
          state: { message: "Projeto criado com sucesso!" },
        });
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles.new_project_container}>
      <Container customClass="column">
        <h1>Criar Projeto</h1>
        {message && <Message type="error" msg={message} />}
        <ProjectForm
          handleSubmit={createPost}
          btnText="Criar Projeto"
          projectData={project}
        />
      </Container>
    </div>
  );
}

export default NewProject;
