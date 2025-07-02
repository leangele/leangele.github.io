import React, { useState, useEffect } from "react";
import Pistas from "./components/Pistas/Pistas";
import Admin from "./components/Admin/Admin"; // Importa el componente Admin
import RouteMap from "./components/RouteMap/RouteMap"; // Importar el nuevo componente de mapa
import Registro from "./components/Registro/Registro"; // Importar el nuevo componente de registro
import "./App.css";

const App = () => {
  // 'pistas', 'admin', or 'map'
  const [currentView, setCurrentView] = useState("pistas"); // 'pistas', 'admin', 'map', 'registro'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [targetView, setTargetView] = useState(null); // 'admin' or 'map'
  const [passwordInput, setPasswordInput] = useState("");
  const [isRegistered, setIsRegistered] = useState(null); // Use null for loading state
  const [theme, setTheme] = useState("light");
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetConfirmationInput, setResetConfirmationInput] = useState("");

  // Passwords should be stored securely, e.g., in environment variables
  const SHARED_PASSWORD = "gs145ka";

  useEffect(() => {
    // Comprobar si ya hay información de equipo en localStorage al cargar la app
    // This check runs only once after the component mounts.
    const teamInfo = localStorage.getItem("teamInfo");
    if (teamInfo) {
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
    }

    // Cargar el tema guardado desde localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme class to the body element
    document.body.className = "";
    document.body.classList.add(`${theme}-theme`);
    // Guardar el tema actual en localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleGoToPistas = () => {
    setCurrentView("pistas");
  };

  const handleProtectedViewClick = (view) => {
    if (isAuthenticated) {
      setCurrentView(view);
    } else {
      setTargetView(view);
      setShowPasswordPopup(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === SHARED_PASSWORD) {
      setIsAuthenticated(true);
      setCurrentView(targetView);
      setShowPasswordPopup(false);
      setPasswordInput("");
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const closePopup = () => {
    setShowPasswordPopup(false);
    setPasswordInput("");
  };

  const handleResetClick = () => {
    setShowResetPopup(true);
  };

  const handleResetConfirm = () => {
    if (resetConfirmationInput === "si") {
      localStorage.removeItem("teamInfo");
      localStorage.removeItem("lastPistaCompletionTime");
      setIsRegistered(false); // This will force the app to the registration screen
      setShowResetPopup(false);
      setResetConfirmationInput("");
    } else {
      alert("Debes escribir 'si' para confirmar.");
    }
  };

  const closeResetPopup = () => {
    setShowResetPopup(false);
    setResetConfirmationInput("");
  };

  const themeSwitcher = (
    <div className="theme-switcher-container">
      <label className="switch">
        <input type="checkbox" onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} checked={theme === 'dark'} />
        <span className="slider round"></span>
      </label>
    </div>
  );

  // Show a loading state until the check is complete
  if (isRegistered === null) {
    return <div className="loading-screen">{themeSwitcher}Cargando...</div>;
  }

  // If not registered, force the registration screen.
  if (isRegistered === false) {
    return (
      <div className="initial-registro-wrapper">
        {themeSwitcher}
        <Registro onRegistrationComplete={() => setIsRegistered(true)} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {themeSwitcher}

      <div className="left-panel">
        {currentView !== "pistas" && (
          <button onClick={handleGoToPistas}>Carrera de Observación</button>
        )}
        {currentView !== "admin" && (
          <button onClick={() => handleProtectedViewClick("admin")}>
            Configurar
          </button>
        )}
        {currentView !== "map" && (
          <button onClick={() => handleProtectedViewClick("map")}>
            Mapa de Ruta
          </button>
        )}
        {currentView !== "registro" && (
          <button onClick={() => setCurrentView("registro")}>
            Modificar Registro
          </button>
        )}
        <button className="reset-button" onClick={handleResetClick}>
          Reiniciar Carrera
        </button>
      </div>

      <div className="main-content">
        {currentView === "pistas" && <Pistas />}
        {currentView === "admin" && <Admin />}
        {currentView === "map" && <RouteMap />}
        {currentView === "registro" && (
          <Registro onRegistrationComplete={() => setCurrentView("pistas")} />
        )}
      </div>

      {showPasswordPopup && (
        <div className="admin-popup">
          <div className="popup-content">
            <h2>Acceso Protegido</h2>
            <p>Por favor, ingresa la contraseña para continuar.</p>
            <input
              type="password"
              placeholder="Contraseña"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handlePasswordSubmit();
                }
              }}
            />
            <button onClick={handlePasswordSubmit}>Acceder</button>
            <button onClick={closePopup}>Cancelar</button>
          </div>
        </div>
      )}

      {showResetPopup && (
        <div className="admin-popup">
          <div className="popup-content">
            <h2>Confirmar Reinicio</h2>
            <p>
              Esta acción borrará todo el progreso del equipo actual. Para
              confirmar, escribe <strong>si</strong> en el campo de abajo.
            </p>
            <input
              type="text"
              placeholder="Escribe 'si' para confirmar"
              value={resetConfirmationInput}
              onChange={(e) => setResetConfirmationInput(e.target.value)}
            />
            <button onClick={handleResetConfirm}>Confirmar Reinicio</button>
            <button onClick={closeResetPopup}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
