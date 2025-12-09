import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Container from "../layout/Container";
import Loading from "../layout/Loading";
import ProjectForm from "../project/ProjectForm";
import ServiceForm from "./ServiceForm";
import ServiceCard from "./ServiceCard";

import styles from "./Project.module.css";

function Project() {
  const { id } = useParams();

  const [project, setProject] = useState({});
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  /* ===============================
        BUSCAR PROJETO
  ================================ */
  useEffect(() => {
    fetch(`http://localhost:5000/projects/${id}`)
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setServices(data.services || []);
        setLoading(false);
      })
      .catch((err) => console.log("Erro ao carregar projeto:", err));
  }, [id]);

  /* ===============================
        ADICIONAR SERVIÇO
  ================================ */
  function createService(projectData) {
    if (!projectData.services) projectData.services = [];

    const lastService = projectData.services[projectData.services.length - 1];
    lastService.id = uuidv4();

    const lastServiceCost = Number(lastService.cost);
    const newCost = Number(projectData.cost || 0) + lastServiceCost;

    if (newCost > Number(projectData.budget)) {
      setMessage("Orçamento ultrapassado, verifique o valor do serviço");
      setType("error");
      projectData.services.pop();
      return false;
    }

    projectData.cost = newCost;

    fetch(`http://localhost:5000/projects/${projectData.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setServices(data.services || []);
        setShowServiceForm(false);
        setMessage("Serviço adicionado com sucesso!");
        setType("success");
      })
      .catch((err) => console.log(err));
  }

  /* ===============================
        EDITAR PROJETO
  ================================ */
  function editPost(updatedProject) {
    if (updatedProject.budget < updatedProject.cost) {
      alert("O orçamento não pode ser menor que o custo!");
      return;
    }

    const payload = {
      id: updatedProject.id,
      name: updatedProject.name || "",
      budget: Number(updatedProject.budget),
      cost: Number(updatedProject.cost ?? 0),
      category: updatedProject.category || { id: null, name: "" },
    };

    fetch(`http://localhost:5000/projects/${payload.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setShowProjectForm(false);
        setMessage("Projeto atualizado com sucesso!");
        setType("success");
      })
      .catch((err) => {
        console.error("Erro ao atualizar projeto:", err);
        alert("Erro ao atualizar o projeto");
      });
  }

  /* ===============================
        REMOVER SERVIÇO
  ================================ */
  function removeService(id, cost) {
    const servicesUpdated = project.services.filter(
      (service) => service.id !== id
    );

    const projectUpdated = { ...project };
    projectUpdated.services = servicesUpdated;
    projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);

    fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectUpdated),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(projectUpdated);
        setServices(servicesUpdated);
        setMessage("Serviço removido com sucesso!");
        setType("success");
      })
      .catch((err) => console.log(err));
  }

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }

  if (loading) return <Loading />;

  return (
    <div className={styles.project_details}>
      <Container customClass="column">
        <h1>Projeto: {project.name}</h1>

        {message && (
          <p className={`${styles.message} ${styles[type]}`}>{message}</p>
        )}

        {/* BOTÃO EDITAR PROJETO */}
        <button className={styles.btn} onClick={toggleProjectForm}>
          {!showProjectForm ? "Editar projeto" : "Fechar"}
        </button>

        {!showProjectForm ? (
          <div className={styles.project_info}>
            <p>
              <span>Categoria: </span>
              {project.category?.name || "Sem categoria"}
            </p>
            <p>
              <span>Total de Orçamento: </span>R${project.budget}
            </p>
            <p>
              <span>Total Utilizado: </span>R${project.cost ?? 0}
            </p>
          </div>
        ) : (
          <ProjectForm
            handleSubmit={editPost}
            btnText="Concluir edição"
            projectData={project}
          />
        )}

        {/* ===========================
              SERVIÇOS
        ============================ */}
        <div className={styles.services_header}>
          <h2>Serviços</h2>
          <button className={styles.btn} onClick={toggleServiceForm}>
            {!showServiceForm ? "Adicionar Serviço" : "Fechar"}
          </button>
        </div>

        {showServiceForm && (
          <ServiceForm
            handleSubmit={createService}
            btnText="Adicionar Serviço"
            projectData={project}
          />
        )}

        <Container customClass="start">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={service.id} className={styles.service_wrapper}>
                <ServiceCard
                  id={service.id}
                  name={service.name}
                  cost={service.cost}
                  description={service.description}
                  handleRemove={removeService}
                />
                {index < services.length - 1 && <hr />}
              </div>
            ))
          ) : (
            <p>Nenhum serviço cadastrado</p>
          )}
        </Container>
      </Container>
    </div>
  );
}

export default Project;
