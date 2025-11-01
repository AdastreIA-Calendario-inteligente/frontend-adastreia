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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); 

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const handleChatClick = () => {
    setIsChatOpen(true);
    const newMessage = "Resumo de hoje";
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    if (isSoundEnabled) speakMessage(newMessage); 
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    console.log("Usuário deslogado");
    navigate("/login");
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const speakMessage = (message) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "pt-BR";
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("A API de síntese de fala não é suportada neste navegador.");
    }
  };

  const handleDateClick = (info) => {
    setSelectedEvent({
      start: info.dateStr,
      end: info.dateStr,
    });
    setIsEventModalOpen(true);
  };

  const handleEventSave = (newEvent) => {
    if (selectedEvent?.id) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? { ...event, ...newEvent } : event
        )
      );
    } else {
      setEvents((prevEvents) => [
        ...prevEvents,
        { id: Date.now().toString(), ...newEvent },
      ]);
    }
    setSelectedEvent(null);
  };

  const handleEventDelete = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  return (
    <div className={`demo-app-main ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="config-icon" onClick={() => setIsConfigOpen(true)}>
        <FaCog size={30} color="#530b5b" />
      </div>
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
      {isEventModalOpen && (
        <EventModal
          onClose={() => setIsEventModalOpen(false)} 
          onSave={handleEventSave} 
          eventData={selectedEvent} 
          isDarkMode={isDarkMode} 

        />
      )}
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
      <div className="chat-icon" onClick={handleChatClick}>
        <FaComments size={30} color="#fff" />
      </div>
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