import styles from "./Container.module.css";

function Container({ children, customClass }) {
  const extraClass =
    customClass && styles[customClass] ? styles[customClass] : "";
  return <div className={`${styles.container} ${extraClass}`}>{children}</div>;
}

export default Container;
