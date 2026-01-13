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

  const API_URL = "https://projeto-costs.onrender.com";

  /* ===============================
        BUSCAR PROJETO
  ================================ */
  useEffect(() => {
    fetch(`${API_URL}/projects/${id}`)
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
    const updatedProject = { ...projectData };

    if (!updatedProject.services) updatedProject.services = [];

    const newService =
      updatedProject.services[updatedProject.services.length - 1];
    newService.id = uuidv4();

    const newCost = Number(updatedProject.cost || 0) + Number(newService.cost);

    if (newCost > Number(updatedProject.budget)) {
      setMessage("Orçamento ultrapassado, verifique o valor do serviço");
      setType("error");

      updatedProject.services.pop();
      return;
    }

    updatedProject.cost = newCost;

    fetch(`${API_URL}/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject),
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
      name: updatedProject.name,
      budget: Number(updatedProject.budget),
      cost: Number(updatedProject.cost || 0),
      category: updatedProject.category,
    };

    fetch(`${API_URL}/projects/${id}`, {
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
      .catch((err) => console.log(err));
  }

  /* ===============================
        REMOVER SERVIÇO
  ================================ */
  function removeService(serviceId, cost) {
    const servicesUpdated = services.filter(
      (service) => service.id !== serviceId
    );

    const projectUpdated = {
      ...project,
      services: servicesUpdated,
      cost: Number(project.cost) - Number(cost),
    };

    fetch(`${API_URL}/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectUpdated),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setServices(data.services || []);
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

        <button className={styles.btn} onClick={toggleProjectForm}>
          {!showProjectForm ? "Editar projeto" : "Fechar"}
        </button>

        {!showProjectForm ? (
          <div className={styles.project_info}>
            <p>
              <span>Categoria:</span>{" "}
              {project.category?.name || "Sem categoria"}
            </p>
            <p>
              <span>Orçamento:</span> R$ {project.budget}
            </p>
            <p>
              <span>Utilizado:</span> R$ {project.cost || 0}
            </p>
          </div>
        ) : (
          <ProjectForm
            handleSubmit={editPost}
            btnText="Salvar"
            projectData={project}
          />
        )}

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
