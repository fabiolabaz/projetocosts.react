import { useState, useEffect } from "react";
import Input from "../form/Input";
import Select from "../form/Select";
import SubmitButton from "../form/SubmitButton";
import styles from "./ProjectForm.module.css";

function ProjectForm({ handleSubmit, btnText, projectData }) {
  const [categories, setCategories] = useState([]);
  const [project, setProject] = useState(projectData || {});

  // Atualiza project quando projectData mudar (edição)
  useEffect(() => {
    setProject(projectData || {});
  }, [projectData]);

  // 🔹 CARREGAR CATEGORIAS (CORRIGIDO)
  useEffect(() => {
    fetch("https://projeto-costs.onrender.com/categories")
      .then((resp) => resp.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log("Erro ao carregar categorias:", err));
  }, []);

  // Envio do formulário
  function submit(e) {
    e.preventDefault();
    handleSubmit(project);
  }

  // Alterar campos
  function handleChange(e) {
    let value = e.target.value;

    if (e.target.name === "budget") {
      value = value === "" ? "" : Number(value);
    }

    setProject({ ...project, [e.target.name]: value });
  }

  // 🔹 Alterar categoria (correto para seu db.json)
  function handleCategory(e) {
    const selectedCategory = categories.find(
      (cat) => cat.id === e.target.value
    );

    setProject({ ...project, category: selectedCategory });
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text"
        text="Nome do Projeto"
        name="name"
        placeholder="Insira o nome do projeto"
        handleOnChange={handleChange}
        value={project.name ?? ""}
      />

      <Input
        type="number"
        text="Orçamento do projeto"
        name="budget"
        placeholder="Insira o orçamento total"
        handleOnChange={handleChange}
        value={project.budget ?? ""}
      />

      <Select
        name="category"
        text="Selecione a categoria"
        options={categories}
        handleOnChange={handleCategory}
        value={project.category?.id ?? ""}
      />

      <SubmitButton text={btnText} />
    </form>
  );
}

export default ProjectForm;
