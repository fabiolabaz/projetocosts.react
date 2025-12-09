import styles from "./Select.module.css";

function Select({ text, name, options, handleOnChange, value }) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
      <select
        name={name}
        id={name}
        value={value !== undefined ? value : ""}
        onChange={handleOnChange}
      >
        <option value="">Selecione a categoria</option>
        {Array.isArray(options) &&
          options.map((option) => (
            <option value={Number(option.id)} key={option.id}>
              {option.name}
            </option>
          ))}
      </select>
    </div>
  );
}

export default Select;
