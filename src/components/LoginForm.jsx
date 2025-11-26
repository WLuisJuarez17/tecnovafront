import { useState } from "react";
import { loginStepOne, verify2FA, checkHealth } from "../services/authApi";

export default function LoginForm({ onAuthenticated }) {
  const [step, setStep] = useState(1);
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [finalToken, setFinalToken] = useState("");
  const [healthMessage, setHealthMessage] = useState("");

  const handleLoginStepOne = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setFinalToken("");

    if (!identificador || !password) {
      setError("Debes ingresar usuario y contraseña.");
      return;
    }

    try {
      setLoading(true);
      const data = await loginStepOne({ identificador, password });

      if (data.require2fa && data.tempToken) {
        setTempToken(data.tempToken);
        setStep(2);
        setSuccessMessage("Código 2FA requerido. Revisa tu app de autenticación.");
      } else {
        // Caso en el que no se requiera 2FA (por si el API lo maneja así)
        setFinalToken(data.token || "");
        setSuccessMessage(data.message || "Inicio de sesión exitoso.");
        if (onAuthenticated) {
          onAuthenticated();
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!tempToken || !code) {
      setError("Faltan el token temporal o el código 2FA.");
      return;
    }

    try {
      setLoading(true);
      const data = await verify2FA({ tempToken, code });

      setFinalToken(data.token || "");
      setSuccessMessage(data.message || "Autenticación completada.");

      // Aquí avisamos al padre (App) que ya se autenticó
      if (onAuthenticated) {
        onAuthenticated();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStepOne = () => {
    setStep(1);
    setCode("");
    setError("");
    setSuccessMessage("");
  };

  const handleHealthCheck = async () => {
    setHealthMessage("");
    try {
      const data = await checkHealth();
      const text =
        typeof data === "object" ? JSON.stringify(data) : String(data);
      setHealthMessage("Health OK: " + text);
    } catch (err) {
      setHealthMessage("Health ERROR: " + err.message);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Inicio de Sesión</h2>

      {step === 1 && (
        <form onSubmit={handleLoginStepOne} className="form">
          <label>
            Usuario o correo
            <input
              type="text"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify2FA} className="form">
          <p>
            Ingresa el código 2FA generado por tu app de autenticación para
            completar el inicio de sesión.
          </p>

          <label>
            Código 2FA
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: 478083"
            />
          </label>

          <div className="button-row">
            <button type="button" onClick={handleBackToStepOne}>
              Volver
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Verificando..." : "Confirmar 2FA"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      {finalToken && (
        <div className="token-box">
          <h3>Token de sesión</h3>
          <p className="token-text">{finalToken}</p>
          <p className="note">
            Puedes guardar este token en <code>localStorage</code> si luego
            crean zonas protegidas.
          </p>
        </div>
      )}

      
    </div>
  );
}
