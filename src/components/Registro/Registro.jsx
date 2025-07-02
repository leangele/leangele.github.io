import React, { useState, useRef, useEffect } from "react";
import "./Registro.css";

const Registro = ({ onRegistrationComplete }) => {
  const [teamInfo, setTeamInfo] = useState({
    nombreEquipo: "",
    integrantes: "",
    grupoScout: "",
    pistaCompletionTimes: [], // Initialize for new registrations
  });
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [existingRegistrationDate, setExistingRegistrationDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Correo configurable
  const recipientEmail = "angelocardona85@gmail.com";

  useEffect(() => {
    const storedData = localStorage.getItem("teamInfo");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setTeamInfo({
        nombreEquipo: parsedData.nombreEquipo || "",
        integrantes: parsedData.integrantes || "",
        grupoScout: parsedData.grupoScout || "",
        pistaCompletionTimes: parsedData.pistaCompletionTimes || [], // Load existing times
      });
      setPhoto(parsedData.photo || null);
      setExistingRegistrationDate(parsedData.fechaRegistro || null);
      setIsEditing(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper function to format duration
  const formatDuration = (milliseconds) => {
    if (typeof milliseconds !== "number" || isNaN(milliseconds)) return "N/A";
    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds >= 0) parts.push(`${seconds}s`);

    return parts.join(" ");
  };

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        setShowCamera(true);
        // We need to wait for the video element to be in the DOM
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 0);
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        alert(
          "No se pudo acceder a la cámara. Asegúrate de haber otorgado los permisos."
        );
      }
    } else {
      alert("Tu navegador no soporta el acceso a la cámara.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame onto the canvas
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      // Get the image data as a base64 string
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setPhoto(imageDataUrl);
      stopCamera();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !teamInfo.nombreEquipo ||
      !teamInfo.integrantes ||
      !teamInfo.grupoScout ||
      !photo
    ) {
      alert("Por favor, completa todos los campos y toma una foto del equipo.");
      return;
    }

    // Usar la fecha existente si se está editando, de lo contrario, crear una nueva
    const registrationTime = existingRegistrationDate
      ? new Date(existingRegistrationDate)
      : new Date();

    const dataToSave = {
      ...teamInfo,
      photo, // Guardar la imagen en base64
      pistaCompletionTimes: teamInfo.pistaCompletionTimes, // Ensure this is carried over
      fechaRegistro: registrationTime.toISOString(), // Guarda la fecha en formato ISO 8601
    };

    // Guardar la información en localStorage
    localStorage.setItem("teamInfo", JSON.stringify(dataToSave));

    // Solo enviar correo en el registro inicial, no en la modificación
    if (!isEditing) {
      // Limpiar el tiempo de la última pista para un nuevo inicio de carrera
      localStorage.removeItem("lastPistaCompletionTime");

      // Construir y abrir el cliente de correo
      const subject = `Registro de Equipo: ${teamInfo.nombreEquipo}`;
      const body = `
  <p>Se ha registrado un nuevo equipo para la carrera de observación.</p>
  <h3>Detalles del Equipo:</h3>
  <ul>
    <li><strong>Nombre:</strong> ${teamInfo.nombreEquipo}</li>
    <li><strong>Integrantes:</strong> ${teamInfo.integrantes}</li>
    <li><strong>Grupo Scout:</strong> ${teamInfo.grupoScout}</li>
    <li><strong>Fecha de Registro:</strong> ${registrationTime.toLocaleString(
      "es-CO",
      { timeZone: "America/Bogota" }
    )}</li>
  </ul>
  <h3>Foto del Equipo:</h3>
  <p>Si no puedes ver la imagen a continuación, es posible que tu cliente de correo la haya bloqueado por seguridad.</p>
  <img src="${photo}" alt="Foto del equipo ${teamInfo.nombreEquipo}" style="max-width: 400px; height: auto;" />
  `;

      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
    }
    else {
      // Enviar correo de modificación
      const modificationTime = new Date();
      const originalCreationDate = new Date(existingRegistrationDate);

      const subject = `Modificación de Equipo: ${teamInfo.nombreEquipo}`;
      const body = `
<p>Se ha realizado una modificación en el registro del equipo.</p>
<h3>Detalles Actualizados del Equipo:</h3>
<ul>
  <li><strong>Nombre:</strong> ${teamInfo.nombreEquipo}</li>
  <li><strong>Integrantes:</strong> ${teamInfo.integrantes}</li>
  <li><strong>Grupo Scout:</strong> ${teamInfo.grupoScout}</li>
  <li><strong>Fecha de Registro Original:</strong> ${originalCreationDate.toLocaleString(
    "es-CO",
    { timeZone: "America/Bogota" }
  )}</li>
  <li><strong>Fecha de Modificación:</strong> ${modificationTime.toLocaleString(
    "es-CO",
    { timeZone: "America/Bogota" }
  )}</li>
</ul>
<h3>Nueva Foto del Equipo:</h3>
<p>Si no puedes ver la imagen a continuación, es posible que tu cliente de correo la haya bloqueado por seguridad.</p>
<img src="${photo}" alt="Foto del equipo ${teamInfo.nombreEquipo}" style="max-width: 400px; height: auto;" />
`;
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
    }

    // Notificar al componente App que el registro está completo
    onRegistrationComplete();
  };

  return (
    <div className="registro-container">
      <form className="registro-form" onSubmit={handleSubmit}>
        <h1>{isEditing ? "Modificar Registro" : "Registro de Equipo"}</h1>
        <p>
          {isEditing
            ? "Actualiza la información de tu equipo."
            : "¡Prepara a tu equipo para la aventura!"}
        </p>

        {existingRegistrationDate && (
          <div className="date-label-container">
            <label>Fecha de Registro Original</label>
            <span>
              {new Date(existingRegistrationDate).toLocaleString("es-CO", {
                timeZone: "America/Bogota",
              })}
            </span>
          </div>
        )}

        {isEditing &&
          teamInfo.pistaCompletionTimes &&
          teamInfo.pistaCompletionTimes.length > 0 && (
            <div className="times-table-container">
              <h3>Tiempos Registrados</h3>
              <table className="times-table">
                <thead>
                  <tr>
                    <th>Pista #</th>
                    <th>Tiempo en Pista</th>
                    <th>Tiempo Total Acumulado</th>
                  </tr>
                </thead>
                <tbody>
                  {teamInfo.pistaCompletionTimes.map((time, index) => (
                    <tr key={index}>
                      <td>{time.pistaId}</td>
                      <td>{formatDuration(time.timeSinceLastPistaMs)}</td>
                      <td>{formatDuration(time.timeSinceStartMs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        <div className="photo-section">
          <label>Foto del Equipo</label>
          {photo ? (
            <div className="photo-preview-container">
              <img
                src={photo}
                alt="Vista previa del equipo"
                className="photo-preview"
              />
              <button type="button" onClick={() => setPhoto(null)}>
                Tomar otra foto
              </button>
            </div>
          ) : (
            <button type="button" onClick={startCamera}>
              Abrir Cámara
            </button>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

        <label htmlFor="nombreEquipo">Nombre del Equipo</label>
        <input
          type="text"
          id="nombreEquipo"
          name="nombreEquipo"
          value={teamInfo.nombreEquipo}
          onChange={handleChange}
          required
        />

        <label htmlFor="integrantes">Nombres de los Integrantes</label>
        <textarea
          id="integrantes"
          name="integrantes"
          value={teamInfo.integrantes}
          onChange={handleChange}
          placeholder="Separa los nombres con comas"
          required
        />

        <label htmlFor="grupoScout">Grupo Scout</label>
        <input
          type="text"
          id="grupoScout"
          name="grupoScout"
          value={teamInfo.grupoScout}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {isEditing ? "Guardar Cambios" : "Iniciar Carrera"}
        </button>
      </form>

      {showCamera && (
        <div className="camera-modal-overlay">
          <div className="camera-modal-content">
            <video ref={videoRef} autoPlay playsInline className="camera-video"></video>
            <div className="camera-controls">
              <button onClick={takePhoto}>Capturar Foto</button>
              <button onClick={stopCamera}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registro;
