import React, { useState, useEffect } from "react";
import Pistas from "./components/Pistas/Pistas";
import Admin from "./components/Admin/Admin"; // Importa el componente Admin
import RouteMap from "./components/RouteMap/RouteMap"; // Importar el nuevo componente de mapa
import Registro from "./components/Registro/Registro"; // Importar el nuevo componente de registro
import ResetPopup from "./components/ResetPopup/ResetPopup";
import NavigationMenu from "./components/NavigationMenu/NavigationMenu";
import "./App.css";

// Helper function to read a cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    // Cargar el tema guardado desde la cookie
    const savedTheme = getCookie("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme class to the body element
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`); // 'light-theme' or 'dark-theme'
    // Guardar el tema actual en una cookie (válida por 1 año)
    document.cookie = `theme=${theme}; max-age=31536000; path=/`;
  }, [theme]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (action) => {
    action();
    setIsMenuOpen(false); // Close menu on selection
  };

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
    localStorage.removeItem("teamInfo");
    localStorage.removeItem("lastPistaCompletionTime");
    setIsRegistered(false); // This will force the app to the registration screen
    setShowResetPopup(false);
  };

  const closeResetPopup = () => {
    setShowResetPopup(false);
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
      <button onClick={toggleMenu} className="menu-toggle-button">
        ☰
      </button>

      <NavigationMenu
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        currentView={currentView}
        onMenuClick={handleMenuClick}
        handleGoToPistas={handleGoToPistas}
        handleProtectedViewClick={handleProtectedViewClick}
        setCurrentView={setCurrentView}
        handleResetClick={handleResetClick}
      />

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

      <ResetPopup
        show={showResetPopup}
        onConfirm={handleResetConfirm}
        onCancel={closeResetPopup}
      />
    </div>
  );
};

export default App;
