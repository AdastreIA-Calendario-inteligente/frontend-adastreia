import React, { useState } from "react";
import "./EventModal.css";

const EventModal = ({ onClose, onSave, eventData, isDarkMode }) => {
  const [title, setTitle] = useState(eventData?.title || "");
  const [start, setStart] = useState(eventData?.start || "");
  const [end, setEnd] = useState(eventData?.end || "");
  const [departure, setDeparture] = useState(eventData?.departure || "");
  const [arrival, setArrival] = useState(eventData?.arrival || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      title,
      start,
      end,
      extendedProps: {
        departure,
        arrival,
      },
    };
    onSave(newEvent);
    onClose();
  };

  return (
    <div className={`event-modal ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="event-modal-content">
        <div className="event-modal-header">
          <h3>{eventData ? "Editar Evento" : "Criar Evento"}</h3>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Nome do Evento:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Data e Hora de Início:
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </label>
          <label>
            Data e Hora de Término:
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </label>
          <label>
            Local de Partida:
            <input
              type="text"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              required
            />
          </label>
          <label>
            Local de Chegada:
            <input
              type="text"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              required
            />
          </label>
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
};

export default EventModal;