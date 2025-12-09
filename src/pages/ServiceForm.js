import { useState } from "react";

import Input from "../form/Input";
import SubmitButton from "../form/SubmitButton";

import styles from "./ServiceForm.module.css";

function ServiceForm({ handleSubmit, btnText, projectData }) {
  const [service, setService] = useState({});

  // Atualiza os campos do service
  function handleChange(e) {
    setService({ ...service, [e.target.name]: e.target.value });
  }

  // Envia o formulário
  function submit(e) {
    e.preventDefault();

    // Prepara o serviço com ID único
    const newService = {
      ...service,
      id: crypto.randomUUID(), // gera ID único
      cost: Number(service.cost), // garante número
    };

    // Garante array de services sem mutar
    const updatedProject = {
      ...projectData,
      services: [...(projectData.services || []), newService],
    };

    handleSubmit(updatedProject);
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text"
        text="Nome do serviço"
        name="name"
        placeholder="Insira o nome do serviço"
        handleOnChange={handleChange}
      />

      <Input
        type="number"
        text="Custo do serviço"
        name="cost"
        placeholder="Insira o valor total"
        handleOnChange={handleChange}
      />

      <Input
        type="text"
        text="Descrição do serviço"
        name="description"
        placeholder="Descreva o serviço"
        handleOnChange={handleChange}
      />

      <SubmitButton text={btnText} />
    </form>
  );
}

export default ServiceForm;
