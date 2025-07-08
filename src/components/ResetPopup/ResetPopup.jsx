import React, { useState } from 'react';

const ResetPopup = ({ show, onConfirm, onCancel }) => {
  const [confirmationInput, setConfirmationInput] = useState('');

  if (!show) {
    return null;
  }

  const handleConfirmClick = () => {
    // Normalize input for comparison
    if (confirmationInput.trim().toLowerCase() === 'si') {
      onConfirm();
    } else {
      alert("Debes escribir 'si' para confirmar.");
    }
  };

  return (
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
          value={confirmationInput}
          onChange={(e) => setConfirmationInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleConfirmClick()}
        />
        <button onClick={handleConfirmClick}>Confirmar Reinicio</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
};

export default ResetPopup;