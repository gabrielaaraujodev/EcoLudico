import styles from "../styles/InputText.module.css";

const InputText = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  readOnly,
}) => (
  <div className={styles.inputGroup}>
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      required={required}
    />
  </div>
);

export default InputText;
