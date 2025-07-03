import React, { useState, useEffect } from "react"; // Import useEffect
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Import Leaflet components
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS (already there)
import L from "leaflet"; // Import Leaflet library for custom icon
import "./Pistas.css";

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Pistas = () => {
  const [currentPistaIndex, setCurrentPistaIndex] = useState(0);
  // Use environment variables for configuration. Default values are fallbacks.
  const recipientEmail = process.env.REACT_APP_RECIPIENT_EMAIL || "angelocardona85@gmail.com";
  const [inputValue, setInputValue] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  // Nuevos estados para la funcionalidad "Estoy perdido"
  const [showLostHelp, setShowLostHelp] = useState(false);
  const [lostSecurityWordInput, setLostSecurityWordInput] = useState("");
  const [lostFeedbackMessage, setLostFeedbackMessage] = useState("");
  const [showLostInfo, setShowLostInfo] = useState(false);
  const [allPistas, setAllPistas] = useState([]); // Nuevo estado para todas las pistas ordenadas
  const [completionInfo, setCompletionInfo] = useState(null); // State for completion info of the current pista

  useEffect(() => {
    const storedPistas = localStorage.getItem("pistas");

    const processAndSetPistas = (pistasData) => {
      const sortedPistas = pistasData.sort(
        (a, b) => (a.order ?? a.id) - (b.order ?? b.id)
      );
      setAllPistas(sortedPistas);

      // 2. Determinar el índice de la pista inicial basado en el progreso guardado
      const teamInfoString = localStorage.getItem("teamInfo");
      if (teamInfoString) {
        const teamInfo = JSON.parse(teamInfoString);
        if (
          teamInfo.pistaCompletionTimes &&
          teamInfo.pistaCompletionTimes.length > 0
        ) {
          const lastCompletedPistaId =
            teamInfo.pistaCompletionTimes[
              teamInfo.pistaCompletionTimes.length - 1
            ].pistaId;
          const lastCompletedIndex = sortedPistas.findIndex(
            (p) => p.id === lastCompletedPistaId
          );

          if (lastCompletedIndex > -1) {
            setCurrentPistaIndex(lastCompletedIndex + 1);
          }
        }
      }
    };

    if (storedPistas) {
      const loadedPistas = JSON.parse(storedPistas);
      processAndSetPistas(loadedPistas);
    } else {
      const params = new URLSearchParams(window.location.search);
      // Use environment variable for the default file, falling back to a hardcoded value.
      const pistasFile = params.get("pistas") || process.env.REACT_APP_DEFAULT_PISTAS_FILE || "gs145ka";

      // Prepend PUBLIC_URL to fetch from the public folder correctly, even when deployed to a sub-path.
      const fetchUrl = `${process.env.PUBLIC_URL || ''}/data/${pistasFile}.json`;

      // For debugging, log the full URL being requested during local development.
      console.log(`Fetching from local URL: ${window.location.origin}${fetchUrl}`);

      fetch(fetchUrl)
        .then((response) => response.json())
        .then((pistasData) => {
          console.log("Pistas cargadas:", pistasData);
          processAndSetPistas(pistasData);
        })
        .catch((error) => console.error("Error al cargar las pistas:", error));
    }
  }, []);

  const currentPista = allPistas[currentPistaIndex];
  const isLastPista = currentPistaIndex === allPistas.length - 1;

  // New useEffect to check completion status when the current pista changes
  useEffect(() => {
    if (!currentPista) {
      setCompletionInfo(null);
      return;
    }

    const teamInfoString = localStorage.getItem("teamInfo");
    if (teamInfoString) {
      const teamInfo = JSON.parse(teamInfoString);
      if (teamInfo.pistaCompletionTimes) {
        const info = teamInfo.pistaCompletionTimes.find(
          (time) => time.pistaId === currentPista.id
        );
        setCompletionInfo(info || null);
      } else {
        setCompletionInfo(null);
      }
    } else {
      setCompletionInfo(null);
    }
  }, [currentPista, allPistas]); // Depend on currentPista to re-check

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setFeedbackMessage(""); // Limpiar feedback al escribir
  };

  const handleDropdownChange = (event) => {
    const selectedPistaId = Number(event.target.value);
    const newIndex = allPistas.findIndex((p) => p.id === selectedPistaId);
    if (newIndex !== -1) {
      setCurrentPistaIndex(newIndex);
    }
  };

  // Helper function to format duration
  const formatDuration = (milliseconds) => {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} hora${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`); // Ensure seconds are always shown if no other units

    return parts.join(', ');
  };

  // New function to send email for each completed pista
  const sendPistaCompletionEmail = (pista, teamInfo, completionTime, startTime, lastCompletionTime) => {
    const totalDurationMs = completionTime.getTime() - startTime.getTime();
    const totalDurationFormatted = formatDuration(totalDurationMs);

    const pistaDurationMs = completionTime.getTime() - lastCompletionTime.getTime();
    const pistaDurationFormatted = formatDuration(pistaDurationMs);

    const subject = `Pista ${pista.id} Completada por ${teamInfo.nombreEquipo}`;
    const body = `
      <p>El equipo "${teamInfo.nombreEquipo}" ha completado la Pista #${pista.id}: "${pista.acertijo.substring(0, 50)}..."</p>
      <h3>Detalles de la Completación:</h3>
      <ul>
        <li><strong>Equipo:</strong> ${teamInfo.nombreEquipo}</li>
        <li><strong>Pista Completada:</strong> #${pista.id}</li>
        <li><strong>Tiempo para esta pista:</strong> ${pistaDurationFormatted}</li>
        <li><strong>Hora de Completación:</strong> ${completionTime.toLocaleString(
          "es-CO",
          { timeZone: "America/Bogota" }
        )}</li>
        <li><strong>Tiempo Total Transcurrido (desde el inicio de la carrera):</strong> ${totalDurationFormatted}</li>
      </ul>
      <p>¡Continúa la aventura!</p>
    `;

    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const checkAnswer = () => {
    if (!currentPista) return;

    let teamInfo = JSON.parse(localStorage.getItem("teamInfo"));
    const normalizedInput = inputValue.trim().toLowerCase();
    const normalizedCorrectAnswer = currentPista.respuesta.trim().toLowerCase();

    if (normalizedInput === normalizedCorrectAnswer) {
      // Get team info and start time from localStorage
      const teamInfoString = localStorage.getItem("teamInfo");
      const teamInfo = teamInfoString ? JSON.parse(teamInfoString) : null;

      if (!teamInfo || !teamInfo.fechaRegistro) {
        alert(
          "Error: No se encontró la información del equipo o la fecha de inicio de la carrera en localStorage. Por favor, registra tu equipo."
        );
        return;
      }

      const startTime = new Date(teamInfo.fechaRegistro);
      const completionTime = new Date(); // Time when this specific pista is completed

      // Get the last completion time to calculate time between clues
      const lastCompletionTimeStr = localStorage.getItem("lastPistaCompletionTime");
      // If it's the first clue, the "last completion" was the start of the race.
      const lastCompletionTime = lastCompletionTimeStr ? new Date(lastCompletionTimeStr) : startTime;

      const totalDurationMs = completionTime.getTime() - startTime.getTime();
      const pistaDurationMs = completionTime.getTime() - lastCompletionTime.getTime();

      // Ensure pistaCompletionTimes array exists
      if (!teamInfo.pistaCompletionTimes) {
        teamInfo.pistaCompletionTimes = [];
      }

      // Add current pista completion data to teamInfo
      teamInfo.pistaCompletionTimes.push({
        pistaId: currentPista.id,
        completionTime: completionTime.toISOString(),
        timeSinceStartMs: totalDurationMs,
        timeSinceLastPistaMs: pistaDurationMs,
      });

      // Send email for this pista completion
      sendPistaCompletionEmail(currentPista, teamInfo, completionTime, startTime, lastCompletionTime); // teamInfo is passed for email content

      // IMPORTANT: Update the last completion time in localStorage for the next clue
      localStorage.setItem("lastPistaCompletionTime", completionTime.toISOString());

      // Proceed to the next pista
      setFeedbackMessage("¡Correcto! Pasando a la siguiente pista...");
      setTimeout(() => {
        if (isLastPista) {
          setFeedbackMessage("¡Felicidades! Has completado todas las pistas.");
          // For the very last pista, the email for its completion is sent,
          // and then the final message is displayed.
          // Optionally, clear lastPistaCompletionTime and teamInfo.pistaCompletionTimes here
          // localStorage.removeItem("lastPistaCompletionTime");
          // teamInfo.pistaCompletionTimes = []; // Clear for next race
        }
        setCurrentPistaIndex((prevIndex) => prevIndex + 1);
        setInputValue("");
        setFeedbackMessage("");
        setShowHelp(false);
        setShowLostHelp(false);
        setLostSecurityWordInput("");
        setLostFeedbackMessage("");
        setShowLostInfo(false);

        // Save the updated teamInfo with new pista completion data
        localStorage.setItem("teamInfo", JSON.stringify(teamInfo));
      }, 1500);
    } else {
      setFeedbackMessage("Incorrecto. Intenta de nuevo.");
    }
  };

  const toggleHelp = () => {
    setShowHelp((prev) => !prev);
  };

  // Nuevas funciones para "Estoy perdido"
  const toggleLostHelp = () => {
    setShowLostHelp((prev) => !prev);
    // Resetear estados al abrir/cerrar la sección de ayuda extra
    setLostSecurityWordInput("");
    setLostFeedbackMessage("");
    setShowLostInfo(false);
  };

  const handleLostSecurityWordChange = (e) => {
    setLostSecurityWordInput(e.target.value);
    setLostFeedbackMessage("");
  };

  const checkLostSecurityWord = () => {
    if (!currentPista) return;

    const normalizedInput = lostSecurityWordInput.trim().toLowerCase();
    const normalizedSecurityWord = currentPista.palabraSeguridad
      .trim()
      .toLowerCase();

    if (normalizedInput === normalizedSecurityWord) {
      setLostFeedbackMessage("¡Palabra clave correcta! Aquí está la ayuda.");
      setShowLostInfo(true);
    } else {
      setLostFeedbackMessage("Palabra clave incorrecta. Intenta de nuevo.");
      setShowLostInfo(false);
    }
  };

  if (!currentPista) {
    return (
      <div className="scavenger-hunt-container">
        <h1>Búsqueda del Tesoro: Medellín</h1>
        <p className="final-message">
          ¡Felicidades! Has completado todas las pistas. ¡Eres un verdadero
          explorador de Medellín!
        </p>
      </div>
    );
  }

  // Función para parsear coordenadas para Leaflet
  const parseCoordinates = (coordString) => {
    const parts = coordString.match(
      /(\d+\.\d+)°\s*([NS]),\s*(\d+\.\d+)°\s*([EW])/
    );
    if (!parts) return [0, 0];
    let lat = parseFloat(parts[1]);
    let lon = parseFloat(parts[3]);
    if (parts[2] === "S") lat *= -1;
    if (parts[4] === "W") lon *= -1;
    return [lat, lon];
  };

  const currentCoords = parseCoordinates(currentPista.coordenadas);

  // Determine the number of completed pistas to control the dropdown
  const teamInfoStringForDropdown = localStorage.getItem("teamInfo");
  const teamInfoForDropdown = teamInfoStringForDropdown ? JSON.parse(teamInfoStringForDropdown) : {};
  const maxAllowedIndex = teamInfoForDropdown.pistaCompletionTimes?.length || 0;

  return (
    <div className="scavenger-hunt-container">
      <h1>Búsqueda del Tesoro: Medellín</h1>

      <div className="pista-selector-container">
        <label htmlFor="pista-select">Ir a la pista:</label>
        <select
          id="pista-select"
          value={currentPista ? currentPista.id : ""}
          onChange={handleDropdownChange}
        >
          {allPistas.map((pista, index) => (
            <option
              key={pista.id}
              value={pista.id}
              disabled={index > maxAllowedIndex}
            >
              Pista #{index + 1} (ID: {pista.id})
            </option>
          ))}
        </select>
      </div>

      <div className="pista-card">
        <h2>
          Pista #{currentPistaIndex + 1} de {allPistas.length}
        </h2>
        <p className="acertijo">
          <strong>Acertijo:</strong> {currentPista.acertijo}
        </p>

        {completionInfo ? (
          <div className="completion-info-box">
            <h3>¡Pista Completada!</h3>
            <p>
              <strong>Completada el:</strong>{" "}
              {new Date(completionInfo.completionTime).toLocaleString("es-CO", {
                timeZone: "America/Bogota",
              })}
            </p>
            <p>
              <strong>Tiempo en esta pista:</strong>{" "}
              {formatDuration(completionInfo.timeSinceLastPistaMs)}
            </p>
          </div>
        ) : (
          <div className="input-section">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ingresa tu respuesta aquí..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  checkAnswer();
                }
              }}
            />
            <button onClick={checkAnswer} disabled={!inputValue.trim()}>
              Verificar Respuesta
            </button>
          </div>
        )}

        {feedbackMessage && (
          <p
            className={`feedback-message ${
              feedbackMessage.includes("Correcto") ? "correct" : "incorrect"
            }`}
          >
            {feedbackMessage}
          </p>
        )}

        {!completionInfo && (
          <div className="botones-pista">
            <button onClick={toggleHelp}>
              {showHelp ? "Ocultar Ayuda" : "Mostrar Ayuda"}
            </button>
            <button onClick={toggleLostHelp}>
              {showLostHelp ? "Cerrar Ayuda Extra" : "Estoy perdido"}
            </button>
          </div>
        )}

        {showHelp && (
          <div className="ayuda-respuesta ayuda">
            <p>
              <strong>Ayuda:</strong> {currentPista.ayuda}
            </p>
          </div>
        )}

        {showLostHelp && (
          <div className="lost-help-section">
            <h3>¿Realmente estás perdido?</h3>
            <p>
              Para obtener ayuda adicional, ingresa la palabra de seguridad de
              esta pista:
            </p>
            <div className="input-section">
              <input
                type="text"
                value={lostSecurityWordInput}
                onChange={handleLostSecurityWordChange}
                placeholder="Palabra de seguridad..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    checkLostSecurityWord();
                  }
                }}
              />
              <button
                onClick={checkLostSecurityWord}
                disabled={!lostSecurityWordInput.trim()}
              >
                Verificar Palabra Clave
              </button>
            </div>
            {lostFeedbackMessage && (
              <p
                className={`feedback-message ${
                  lostFeedbackMessage.includes("correcta")
                    ? "correct"
                    : "incorrect"
                }`}
              >
                {lostFeedbackMessage}
              </p>
            )}

            {showLostInfo && (
              <div className="revealed-info">
                <h4>Información de Rescate:</h4>
                <p>
                  <strong>Pista:</strong> {currentPista.acertijo}
                </p>
                <p>
                  <strong>Coordenadas:</strong> {currentPista.coordenadas}
                </p>
                {currentPista.imageUrl && (
                  <div className="location-image-container">
                    <img
                      src={currentPista.imageUrl}
                      alt={`Ubicación de la pista ${currentPista.id}`}
                      className="location-image"
                    />
                    <p className="image-caption">
                      Una pequeña vista del lugar.
                    </p>
                  </div>
                )}
                <div className="map-container">
                  <MapContainer
                    key={currentPista.id}
                    center={currentCoords}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: "300px", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={currentCoords}>
                      <Popup>Ubicación de la Pista #{currentPista.id}</Popup>
                    </Marker>
                  </MapContainer>
                  <p className="map-caption">
                    Ubicación aproximada en el mapa.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Pistas;