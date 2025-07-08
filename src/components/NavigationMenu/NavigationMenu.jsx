import React from 'react';

const NavigationMenu = ({
  isOpen,
  onClose,
  currentView,
  onMenuClick,
  handleGoToPistas,
  handleProtectedViewClick,
  setCurrentView,
  handleResetClick,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className={`left-panel ${isOpen ? 'open' : ''}`}>
        {currentView !== 'pistas' && (
          <button onClick={() => onMenuClick(handleGoToPistas)}>
            Carrera de Observación
          </button>
        )}
        {currentView !== 'admin' && (
          <button onClick={() => onMenuClick(() => handleProtectedViewClick('admin'))}>
            Configurar
          </button>
        )}
        {currentView !== 'map' && (
          <button onClick={() => onMenuClick(() => handleProtectedViewClick('map'))}>
            Mapa de Ruta
          </button>
        )}
        {currentView !== 'registro' && (
          <button onClick={() => onMenuClick(() => setCurrentView('registro'))}>
            Modificar Registro
          </button>
        )}
        <button className="reset-button" onClick={() => onMenuClick(handleResetClick)}>
          Reiniciar Carrera
        </button>
      </div>
      <div className="overlay" onClick={onClose}></div>
    </>
  );
};

export default NavigationMenu;