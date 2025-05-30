import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SignInPage.module.css";

function SignInPage({ onLoginSuccess }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("https://localhost:7253/api/User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        onLoginSuccess(userData.userId);
        navigate("/profile", { state: { currentUserId: userData.userId } });
      } else {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          setError(errorData.error);
        } else {
          setError(`Erro no login: ${response.statusText}`);
        }
      }
    } catch (error) {
      setError(`Erro de conexão com o servidor: ${error}`);
    }
  };

  const handleCadastroClick = () => {
    navigate("/signup");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Feliz em vê-lo novamente !</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Digite seu e-mail"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Fazer login
          </button>
        </form>
        <p className={styles.cadastroLink}>
          Ainda não tem uma conta?{" "}
          <button
            type="button"
            onClick={handleCadastroClick}
            className={styles.linkButton}
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignInPage;
