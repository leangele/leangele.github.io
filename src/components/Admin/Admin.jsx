import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Admin.css";

const Admin = () => {
  const [pistas, setPistas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPista, setEditedPista] = useState(null);
  const [previewPista, setPreviewPista] = useState(null); // State for the preview modal
  const [isClient, setIsClient] = useState(false); // State to ensure client-side rendering for dnd

  useEffect(() => {
    const storedPistas = localStorage.getItem("pistas");
    if (storedPistas) {
      // Ensure loaded clues have an 'order' property and are sorted
      const loadedPistas = JSON.parse(storedPistas);
      setPistas(loadedPistas.sort((a, b) => a.order - b.order));
    } else {
      // If there are no clues in localStorage, load them from the JSON file
      const params = new URLSearchParams(window.location.search);
      const pistasFile = params.get("pistas") || "gs145ka"; // Default to 'gs145ka'

      fetch(`/${pistasFile}.json`) // Points at the JSON file (from the URL param or the default)
        .then((response) => response.json())
        .then((pistasData) => {
          // Initialize 'order' for the default clues
          const initialPistas = pistasData.map((pista, index) => ({
            ...pista,
            order: index, // Use the index as the initial order
          }));
          setPistas(initialPistas);
          // Save the initial clues in localStorage
          localStorage.setItem("pistas", JSON.stringify(initialPistas));
        })
        .catch((error) =>
          console.error("Error al cargar las pistas iniciales:", error)
        );
    }
    setIsClient(true); // Set to true after mount, indicating we are on the client
  }, []);

  const updatePistas = (newPistas) => {
    // Re-index the 'order' property to match the new array order
    const reIndexedPistas = newPistas.map((pista, index) => ({
      ...pista,
      order: index,
    }));

    setPistas(reIndexedPistas);
    // Save the correctly ordered and indexed list to localStorage
    localStorage.setItem("pistas", JSON.stringify(reIndexedPistas));
  };

  const toggleEditMode = (pista) => {
    setIsEditing(!isEditing);
    setEditedPista(pista);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedPista((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const savePista = () => {
    // TODO: Validate editedPista data

    if (editedPista.id) {
      const updatedPistas = pistas.map((p) =>
        p.id === editedPista.id ? editedPista : p
      );
      updatePistas(updatedPistas);
    } else {
      const newId = Date.now(); // Generate a unique id for the new clue (simple; use a UUID in production)
      const newPista = {
        ...editedPista,
        id: newId,
        order: pistas.length, // Place it at the end of the list
      };
      updatePistas([...pistas, newPista]);
    }
    setIsEditing(false);
    setEditedPista(null);
  };

  const deletePista = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta pista?")) {
      const updatedPistas = pistas.filter((p) => p.id !== id);
      updatePistas(updatedPistas); // Re-index the remaining clues
    }
  };

  const movePista = (index, direction) => {
    const newPistas = [...pistas];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newPistas.length) {
      // Simple swap
      [newPistas[index], newPistas[targetIndex]] = [
        newPistas[targetIndex],
        newPistas[index],
      ];
      updatePistas(newPistas);
    }
  };

  const handleClosePreview = () => {
    setPreviewPista(null);
  };

  // Handle drag and drop
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // No destination, or dropped in the same position
    if (!destination || source.index === destination.index) {
      return;
    }

    const newPistas = Array.from(pistas);
    const [reorderedItem] = newPistas.splice(source.index, 1);
    newPistas.splice(destination.index, 0, reorderedItem);

    updatePistas(newPistas); // Update state and re-index order
  };

  if (isEditing) {
    return (
      <div className="admin-edit">
        <h2>{editedPista?.id ? "Editar Pista" : "Agregar Nueva Pista"}</h2>
        <label>Acertijo:</label>
        <textarea
          className="admin-input"
          name="acertijo"
          value={editedPista.acertijo}
          onChange={handleEditChange}
        />

        <label>Ayuda:</label>
        <textarea
          className="admin-input"
          name="ayuda"
          value={editedPista.ayuda}
          onChange={handleEditChange}
        />

        <label>Coordenadas:</label>
        <input
          type="text"
          className="admin-input"
          name="coordenadas"
          value={editedPista.coordenadas}
          onChange={handleEditChange}
        />

        <label>Palabra de Seguridad:</label>
        <input
          type="text"
          className="admin-input"
          name="palabraSeguridad"
          value={editedPista.palabraSeguridad}
          onChange={handleEditChange}
        />

        <label>Respuesta:</label>
        <input
          type="text"
          className="admin-input"
          name="respuesta"
          value={editedPista.respuesta}
          onChange={handleEditChange}
        />

        <label>URL de Imagen:</label>
        <input
          type="text"
          className="admin-input"
          name="imageUrl"
          value={editedPista.imageUrl || ""}
          onChange={handleEditChange}
        />

        <div className="form-actions">
          <button onClick={savePista}>Guardar</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      </div>
    );
  }

  const renderPreviewModal = () => {
    if (!previewPista) return null;

    return (
      <div className="preview-modal-overlay" onClick={handleClosePreview}>
        <div
          className="preview-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="preview-modal-close" onClick={handleClosePreview}>
            &times;
          </button>
          <h2>Vista Previa: Pista #{previewPista.id}</h2>
          <div className="preview-modal-body">
            {previewPista.imageUrl && (
              <img
                src={previewPista.imageUrl}
                alt={`Imagen de la pista ${previewPista.id}`}
                className="preview-image"
              />
            )}
            <p>
              <strong>Acertijo:</strong> {previewPista.acertijo}
            </p>
            <p>
              <strong>Ayuda:</strong> {previewPista.ayuda}
            </p>
            <p>
              <strong>Coordenadas:</strong> {previewPista.coordenadas}
            </p>
            <p>
              <strong>Palabra de Seguridad:</strong>{" "}
              {previewPista.palabraSeguridad}
            </p>
            <p>
              <strong>Respuesta:</strong> {previewPista.respuesta}
            </p>
          </div>
          <div className="preview-modal-actions">
            <button
              onClick={() => {
                toggleEditMode(previewPista);
                handleClosePreview();
              }}
            >
              Editar
            </button>
            <button
              onClick={() => {
                deletePista(previewPista.id);
                handleClosePreview();
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-panel">
      <h2>Panel de Administración de Pistas</h2>

      {isClient ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="pistas">
            {(provided) => (
              <div
                className="pistas-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {pistas.map((pista, index) => (
                  <Draggable
                    key={pista.id} // Use the id as the key
                    draggableId={String(pista.id)} // draggableId must be a string
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`pista-item ${
                          snapshot.isDragging ? "is-dragging" : ""
                        }`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div
                          className="drag-handle"
                          {...provided.dragHandleProps}
                        >
                          &#x2630; {/* Drag handle */}
                        </div>
                        <div className="pista-item-content">
                          <span>
                            Pista #{pista.id}: {pista.acertijo.substring(0, 50)}
                            ...
                          </span>
                        </div>
                        <div className="pista-item-actions">
                          <button onClick={() => setPreviewPista(pista)}>
                            mostrar
                          </button>
                          <button
                            className="move-btn"
                            onClick={() => movePista(index, "up")}
                            disabled={index === 0}
                            title="Mover Arriba"
                          >
                            ▲
                          </button>
                          <button
                            className="move-btn"
                            onClick={() => movePista(index, "down")}
                            disabled={index === pistas.length - 1}
                            title="Mover Abajo"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}{" "}
                {/* Placeholder space while dragging */}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : null}

      {renderPreviewModal()}

      <button
        onClick={() =>
          toggleEditMode({
            acertijo: "",
            ayuda: "",
            coordenadas: "",
            palabraSeguridad: "",
            respuesta: "",
            imageUrl: "",
          })
        }
      >
        Agregar Pista
      </button>
    </div>
  );
};

export default Admin;
