import { useState } from "react";
import { registerUser } from "../services/authApi";
import { QRCodeSVG } from "qrcode.react";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    rolId: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // datos para el 2FA
  const [base32, setBase32] = useState("");
  const [otpURL, setOtpURL] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rolId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setBase32("");
    setOtpURL("");

    if (!form.username || !form.email || !form.password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        rolId: form.rolId, // 1 o 2
      };

      const data = await registerUser(payload);

      setSuccessMessage(
        data.message || "Usuario creado correctamente. Configure su 2FA."
      );

      // guardar info de 2FA
      setBase32(data.twoFactor?.base32 || "");
      setOtpURL(data.twoFactor?.otpauth_url || "");
    } catch (err) {
      setError(err.message || "Ocurrió un error al registrar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Usuario
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
          />
        </label>

        <label>
          Correo electrónico
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </label>

        <label>
          Confirmar contraseña
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </label>

        <label>
          Rol
          <select name="rolId" value={form.rolId} onChange={handleChange}>
            <option value={1}>Rol 1</option>
            <option value={2}>Rol 2</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      {(base32 || otpURL) && (
        <div className="twofa-box">
          <h3>Configurar 2FA</h3>
          <p>
            Escanea este código QR con Google Authenticator u otra app
            compatible, o utiliza el código Base32.
          </p>

          {otpURL && (
            <div style={{ textAlign: "center", margin: "16px 0" }}>
              <QRCodeSVG value={otpURL} size={180} />
            </div>
          )}

          {base32 && (
            <p>
              <strong>Secreto (base32):</strong> {base32}
            </p>
          )}

          {otpURL && (
            <p>
              <strong>URL otpauth:</strong>{" "}
              <a href={otpURL} target="_blank" rel="noreferrer">
                {otpURL}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
