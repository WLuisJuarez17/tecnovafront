import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Si en el futuro guardas token, aquí se limpia:
    localStorage.removeItem("token");

    // Redirigir al login
    navigate("/");
  };

  return (
    <div className="card" style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Bienvenido a TecnoNova</h2>
      <p>Has iniciado sesión correctamente.</p>

      {/* Botón para ir al registro */}
      <button
        onClick={() => navigate("/register")}
        style={{
          marginTop: "20px",
          padding: "0.7rem 1.2rem",
          background: "#2563eb",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          border: "none",
          fontWeight: "bold",
        }}
      >
        Registrar un nuevo usuario
      </button>

      {/* Botón para cerrar sesión */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "15px",
          padding: "0.6rem 1.2rem",
          background: "#dc2626",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          border: "none",
          fontWeight: "bold",
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
