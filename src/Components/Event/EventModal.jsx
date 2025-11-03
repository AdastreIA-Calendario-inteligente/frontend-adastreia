import React, { useState } from "react";
import "./EventModal.css";

// Componente EventModal: Modal para criar ou editar eventos
const EventModal = ({ onClose, onSave, eventData, isDarkMode }) => {
  // Estados para armazenar os dados do evento
  const [title, setTitle] = useState(eventData?.title || ""); // Nome do evento
  const [start, setStart] = useState(eventData?.start || ""); // Data e hora de início
  const [end, setEnd] = useState(eventData?.end || ""); // Data e hora de término
  const [departure, setDeparture] = useState(eventData?.departure || ""); // Local de partida
  const [arrival, setArrival] = useState(eventData?.arrival || ""); // Local de chegada
  const [locomotion, setLocomotion] = useState(eventData?.locomotion || "driving"); // Meio de transporte
  const [isOutdoor, setIsOutdoor] = useState(eventData?.isOutdoor || false); // Indica se é ao ar livre

  // Opções de locomoção disponíveis
  const locomotionOptions = {
    driving: "Carro",
    walking: "Andando",
    bicycling: "Bicicleta",
    transit: "Transporte público",
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    // Processa os dados do evento
    const horaInicio = start;
    const horaFim = end;
    const [eventDate] = start.split("T"); // Extrai a data do início

    // Cria um objeto com os dados básicos do evento
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

    // Monta a URL da API para obter rota e clima
    const apiUrl = `/api/mapas%20e%20clima/rota_com_clima?origin=${encodeURIComponent(
      departure
    )}&destination=${encodeURIComponent(arrival)}&mode=${encodeURIComponent(
      locomotion
    )}&event_date_str=${encodeURIComponent(eventDate)}&event_time_str=${encodeURIComponent(
      horaInicio.split("T")[1]
    )}`;

    console.log("Começando conexão com API de rota e clima...");

    // Faz a chamada à API para obter rota e clima
    fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          // Lança erro se a resposta não for bem-sucedida
          throw new Error("Erro na resposta da API de rota e clima");
        }
        return response.json(); // Converte a resposta para JSON
      })
      .then((data) => {
        console.log("Resposta da API de rota e clima:", data);

        // Extrai informações da resposta da API
        const distance = data.route_details.distance;
        const duration = data.route_details.duration;
        const temperature = data.weather_forecast.forecast.temperature_celsius || 0;
        const weather = data.weather_forecast.forecast.condition || null;

        // Monta o payload do evento com os dados obtidos
        const eventPayload = {
          nome: title,
          local: arrival,
          duracao: duration,
          hora_inicio: horaInicio,
          hora_fim: horaFim,
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

        // Obtém o token JWT do localStorage
        const token = localStorage.getItem("access_token");

        if (token) {
          console.log("Token JWT encontrado:", token);
        } else {
          console.warn("Token JWT não está disponível no localStorage.");
        }

        // Faz a chamada ao backend para salvar o evento
        return fetch("/api/eventos/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined, // Passa o token se existir
          },
          body: JSON.stringify(eventPayload), // Envia o payload como JSON
        });
      })
      .then((backendResponse) => {
        if (!backendResponse.ok) {
          // Lança erro se a resposta do backend não for bem-sucedida
          throw new Error("Erro ao salvar o evento no backend");
        }
        return backendResponse.json(); // Converte a resposta para JSON
      })
      .then((savedEvent) => {
        console.log("Evento salvo com sucesso no backend:", savedEvent);
        onSave(newEvent); // Chama a função de salvar passada como prop
        onClose(); // Fecha o modal
      })
      .catch((error) => {
        console.error("Erro ao processar o evento:", error); // Loga erros no console
      });
  };

  return (
    // Estrutura do modal
    <div className={`event-modal ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="event-modal-content">
        <div className="event-modal-header">
          {/* Título do modal */}
          <h3>{eventData ? "Editar Evento" : "Criar Evento"}</h3>
          {/* Botão para fechar o modal */}
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>
        {/* Formulário para criar ou editar evento */}
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
              {/* Renderiza as opções de locomoção */}
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
          {/* Botão para salvar o evento */}
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
};

export default EventModal;