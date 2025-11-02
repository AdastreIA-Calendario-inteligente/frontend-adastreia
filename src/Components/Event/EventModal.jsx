import React, { useState } from "react";
import "./EventModal.css";

const EventModal = ({ onClose, onSave, eventData, isDarkMode }) => {
  const [title, setTitle] = useState(eventData?.title || "");
  const [start, setStart] = useState(eventData?.start || "");
  const [end, setEnd] = useState(eventData?.end || "");
  const [departure, setDeparture] = useState(eventData?.departure || "");
  const [arrival, setArrival] = useState(eventData?.arrival || "");
  const [locomotion, setLocomotion] = useState(eventData?.locomotion || "driving");
  const [isOutdoor, setIsOutdoor] = useState(eventData?.isOutdoor || false);

  const locomotionOptions = {
    driving: "Carro",
    walking: "Andando",
    bicycling: "Bicicleta",
    transit: "Transporte público",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const horaInicio = start;
    const horaFim = end;
    const [eventDate] = start.split("T");
  
    const newEvent = {
      title,
      start: horaInicio,
      end: horaFim,
      extendedProps: {
        departure,
        arrival,
        locomotion,
        isOutdoor,
      },
    };
  
    const apiUrl = `/api/mapas%20e%20clima/rota_com_clima?origin=${encodeURIComponent(
      departure
    )}&destination=${encodeURIComponent(arrival)}&mode=${encodeURIComponent(
      locomotion
    )}&event_date_str=${encodeURIComponent(eventDate)}&event_time_str=${encodeURIComponent(
      horaInicio.split("T")[1]
    )}`;
  
    console.log("Começando conexão com API de rota e clima...");
  
    fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na resposta da API de rota e clima");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Resposta da API de rota e clima:", data);
      
        const distance = data.route_details.distance;
        const duration = data.route_details.duration;
        const temperature = data.weather_forecast.forecast.temperature_celsius || 0;
        const weather = data.weather_forecast.forecast.condition || null;
      
        const eventPayload = {
          nome: title,
          local: arrival,
          duracao: duration,
          hora_inicio: horaInicio.split("T")[1],
          hora_fim: horaFim.split("T")[1],
          temperatura: temperature,
          clima: weather,
          local_de_saida: departure,
          transporte: locomotionOptions[locomotion],
          distancia: distance,
          data_do_evento: eventDate,
          tipos_evento: [
            {
              tipo: isOutdoor ? "aberto" : "fechado",
            },
          ],
        };
      
        console.log("Enviando para o backend:", eventPayload);

        const token = localStorage.getItem('access_token');
    
        if (token) { // Pegue o token correto do localStorage
          console.log("Token JWT encontrado:", token);
        } else {
          console.warn("Token JWT não está disponível no localStorage.");
        }
    
        return fetch("/api/eventos/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined, // Passa o token se existir
          },
          body: JSON.stringify(eventPayload),
        });
      })
      .then((backendResponse) => {
        if (!backendResponse.ok) {
          throw new Error("Erro ao salvar o evento no backend");
        }
        return backendResponse.json();
      })
      .then((savedEvent) => {
        console.log("Evento salvo com sucesso no backend:", savedEvent);
        onSave(newEvent);
        onClose();
      })
      .catch((error) => {
        console.error("Erro ao processar o evento:", error);
      });
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
            Local de Partida
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
            Locomoção
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
          <label>
            Atividade ao ar livre
            <select
              value={isOutdoor ? "sim" : "nao"}
              onChange={(e) => setIsOutdoor(e.target.value === "sim")}
            >
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </label>
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
};

export default EventModal;