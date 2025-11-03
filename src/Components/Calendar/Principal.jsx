import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FaComments, FaCog } from "react-icons/fa";
import "./Principal.css";
import EventModal from '/src/Components/Event/EventModal';
import Config from "../Config/Config";
import { useNavigate } from "react-router-dom";

const Principal = () => {
  const navigate = useNavigate();

  // Estados para controlar funcionalidades e dados da aplicação
  const [isChatOpen, setIsChatOpen] = useState(false); // Controle da janela de chat
  const [isConfigOpen, setIsConfigOpen] = useState(false); // Controle da janela de configurações
  const [messages, setMessages] = useState([]); // Mensagens do chat
  const [events, setEvents] = useState([]); // Eventos do calendário
  const [isEventModalOpen, setIsEventModalOpen] = useState(false); // Controle do modal de eventos
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento selecionado para edição
  const [isSoundEnabled, setIsSoundEnabled] = useState(true); // Controle do som
  const [isDarkMode, setIsDarkMode] = useState(false); // Controle do modo escuro
  const [userData, setUserData] = useState(null); // Dados do usuário

  // Efeito para aplicar o modo escuro ao corpo da página
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Função para buscar dados do usuário autenticado
  const fetchUserData = async () => {
    const token = localStorage.getItem('access_token'); // Recupera o token de autenticação
    if (!token) {
      console.error("Token não encontrado");
      return;
    }
  
    try {
      // Chamada à API para obter os dados do usuário
      const response = await fetch("/api/usuarios/me", {
        method: "GET",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário");
      }
  
      const data = await response.json();
      setUserData(data); // Armazena os dados do usuário no estado
  
      // Formata os eventos do calendário, se existirem
      if (data?.calendarios) {
        const formattedEvents = data.calendarios.flatMap((calendario) =>
          calendario.eventos.flatMap((evento) =>
            evento.datas.map((dataEvento) => ({
              id: evento.id_evento,
              title: evento.nome,
              start: `${dataEvento.data}T${evento.hora_inicio.split("T")[1]}`,
              end: `${dataEvento.data}T${evento.hora_fim.split("T")[1]}`,
              extendedProps: {
                clima: evento.clima,
                temperatura: evento.temperatura,
                local: evento.local,
                local_de_saida: evento.local_de_saida,
                distancia: evento.distancia,
                duracao: evento.duracao,
                transporte: evento.transporte,
                tipos: evento.tipos.map((tipo) => tipo.tipo),
              },
            }))
          )
        );
        setEvents(formattedEvents); // Atualiza os eventos no estado
      }
  
      console.log("Dados do usuário:", data);
    } catch (error) {
      console.error("Erro na chamada da API:", error);
    }
  };

  // Efeito para buscar os dados do usuário ao carregar o componente
  useEffect(() => {
    fetchUserData(); 
  }, []);

  // Função para lidar com o clique no ícone de chat
  const handleChatClick = async () => {
    const today = new Date(); // Data atual
    const eventsToday = events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === today.getFullYear() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getDate() === today.getDate()
      );
    });
  
    if (eventsToday.length > 0) {
      // Prepara os detalhes dos eventos do dia para o prompt
      const eventDetails = eventsToday.map((event) => ({
        title: event.title,
        start: event.start,
        end: event.end,
        local: event.extendedProps?.local,
        clima: event.extendedProps?.clima,
        temperatura: event.extendedProps?.temperatura,
        duracao: event.extendedProps?.duracao,
        transporte: event.extendedProps?.transporte,
      }));

      // Gera o prompt para a API de chat
      const prompt = `faca um relatorio breve, de forma fluida sem separar em topicos, meia linha para cada info informacoes dos meus eventos, veja se ta um bom dia e se minhas escolhas estao boa de tempo, se posso sofrer algum atraso ou coisas do genero. Eventos: ${JSON.stringify(
        eventDetails
      )}`;
  
      try {
        // Chamada à API de chat com o prompt gerado
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });
  
        if (!response.ok) {
          throw new Error("Erro ao chamar a API de chat");
        }
  
        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, data.response]); // Adiciona a resposta ao chat
        if (isSoundEnabled) speakMessage(data.response); // Fala a mensagem, se o som estiver ativado
      } catch (error) {
        console.error("Erro ao chamar a API:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          "Erro ao obter resposta do chat.",
        ]);
      }
    } else {
      // Mensagem padrão caso não haja eventos no dia
      const noEventsMessage = "Sua agenda está vazia.";
      setMessages((prevMessages) => [...prevMessages, noEventsMessage]);
      if (isSoundEnabled) speakMessage(noEventsMessage);
    }
  
    setIsChatOpen(true); // Abre a janela de chat
  };

  // Função para lidar com o logout do usuário
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove o token de autenticação
    console.log("Usuário deslogado");
    navigate("/login"); // Redireciona para a página de login
  };

  // Função para fechar o chat e limpar mensagens
  const handleCloseChat = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); // Cancela qualquer fala em andamento
    }
    setMessages([]);
    setIsChatOpen(false); 
  };

  // Função para falar uma mensagem usando a API de síntese de fala
  const speakMessage = (message) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "pt-BR";
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("A API de síntese de fala não é suportada neste navegador.");
    }
  };

  // Função para lidar com o clique em uma data no calendário
  const handleDateClick = (info) => {
    setSelectedEvent({
      start: info.dateStr,
      end: info.dateStr,
    });
    setIsEventModalOpen(true); // Abre o modal de evento
  };

  // Função para salvar um evento (novo ou editado)
  const handleEventSave = (newEvent) => {
    if (selectedEvent?.id) {
      // Atualiza um evento existente
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? { ...event, ...newEvent } : event
        )
      );
    } else {
      // Adiciona um novo evento
      setEvents((prevEvents) => [
        ...prevEvents,
        { id: Date.now().toString(), ...newEvent },
      ]);
    }
    setSelectedEvent(null);
  };

  // Função para deletar um evento
  const handleEventDelete = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  return (
    <div className={`demo-app-main ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Ícone de configurações */}
      <div className="config-icon" onClick={() => setIsConfigOpen(true)}>
        <FaCog size={30} color="#530b5b" />
      </div>

      {/* Componente do calendário */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        initialView="dayGridMonth"
        editable={false}
        selectable={false}
        dayMaxEvents={true}
        dateClick={handleDateClick}
        events={events}
      />

      {/* Modal de evento */}
      {isEventModalOpen && (
        <EventModal
          onClose={() => setIsEventModalOpen(false)} 
          onSave={handleEventSave} 
          eventData={selectedEvent} 
          isDarkMode={isDarkMode} 
        />
      )}

      {/* Janela de configurações */}
      {isConfigOpen && (
        <Config
          onClose={() => setIsConfigOpen(false)}
          isSoundEnabled={isSoundEnabled}
          setIsSoundEnabled={setIsSoundEnabled}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onLogout={handleLogout}
        />
      )}

      {/* Ícone de chat */}
      <div className="chat-icon" onClick={handleChatClick}>
        <FaComments size={30} color="#fff" />
      </div>

      {/* Janela de chat */}
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            Chat
            <button className="chat-close-button" onClick={handleCloseChat}>
              X
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className="chat-message">
                {message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Principal;