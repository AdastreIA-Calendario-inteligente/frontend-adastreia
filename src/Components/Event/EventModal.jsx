import React, { useState } from "react";
import "./EventModal.css";

const EventModal = ({ onClose, onSave, eventData, isDarkMode }) => {
  const [title, setTitle] = useState(eventData?.title || "");
  const [start, setStart] = useState(eventData?.start || "");
  const [end, setEnd] = useState(eventData?.end || "");
  const [departure, setDeparture] = useState(eventData?.departure || "");
  const [arrival, setArrival] = useState(eventData?.arrival || "");
  const [locomotion, setLocomotion] = useState(eventData?.locomotion || "driving");

  const locomotionOptions = {
    driving: "Carro",
    walking: "Andando",
    bicycling: "Bicicleta",
    transit: "Transporte público",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newEvent = {
      title,
      start,
      end,
      extendedProps: {
        departure,
        arrival,
        locomotion,
      },
    };
  
    const apiUrl = "/api/mapas e clima/rota_com_clima";
    const requestBody = {
      origin: departure,
      destination: arrival,
      mode: locomotion,
    };
  
    console.log("Começando conexão com API de rota e clima...");
  
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na resposta da API de rota e clima");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Resposta da API de rota e clima:", data);
  
        const city = data.weather_forecast.city;
        const weatherApiUrl = `/api/weather/forecast?destination=${encodeURIComponent(city)}`;
  
        console.log("Chamando API de previsão do tempo...");
        return fetch(weatherApiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
      })
      .then((weatherResponse) => {
        if (!weatherResponse.ok) {
          throw new Error("Erro na resposta da API de previsão do tempo");
        }
        return weatherResponse.json();
      })
      .then((weatherData) => {
        console.log("Resposta da API de previsão do tempo:", weatherData);
      })
      .catch((error) => {
        console.error("Erro ao chamar as APIs:", error);
      });
  
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
          <label>
            Locomoção:
            <select
              value={locomotion}
              onChange={(e) => setLocomotion(e.target.value)}
              required
            >
              {Object.entries(locomotionOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
};

export default EventModal;