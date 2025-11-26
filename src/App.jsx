import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import "./App.css";

function App() {
  // ¿El usuario ya se autenticó correctamente?
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Vista actual: "login" | "welcome" | "register"
  const [view, setView] = useState("login");

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setView("welcome");
  };

  const handleLogout = () => {
    // Si en algún momento guardas token, aquí lo limpias
    localStorage.removeItem("token");

    setIsAuthenticated(false);
    setView("login");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TecnoNova – Autenticación</h1>
        <p>Proyecto Final – Grupo #4</p>
      </header>

      {/* Vista inicial: solo login + datos del grupo */}
      {!isAuthenticated && view === "login" && (
        <main>
          <LoginForm onAuthenticated={handleAuthenticated} />

          <div className="card" style={{ marginTop: "24px" }}>
            <h3>Grupo #4</h3>
            <ul style={{ lineHeight: 1.8 }}>
              <li>Carías Cervantes, Ender Alexander</li>
              <li>Aroche Muralles, Luis Eduardo</li>
              <li>Juárez Nájera, Luis Enrique</li>
              <li>Cardona Juarez, Doris Carolina</li>
              <li>Morales Morales, Sindy Nohelia</li>
            </ul>
          </div>
        </main>
      )}

      {/* Vista después de iniciar sesión */}
      {isAuthenticated && view === "welcome" && (
        <main>
          <div className="card">
            <h2>Bienvenido a TecnoNova</h2>
            <p>Sesión iniciada correctamente.</p>

            <button
              onClick={() => setView("register")}
              style={{ marginTop: "20px", marginRight: "12px" }}
            >
              Registrar un nuevo usuario
            </button>

            <button
              onClick={handleLogout}
              style={{
                marginTop: "20px",
                padding: "0.6rem 1.2rem",
                background: "#dc2626",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </main>
      )}

      {/* Vista de registro (solo cuando ya hay sesión) */}
      {isAuthenticated && view === "register" && (
        <main>
          <RegisterForm />

          <div style={{ marginTop: "16px" }}>
            <button onClick={() => setView("welcome")}>Volver al inicio</button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
