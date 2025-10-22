import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { FaComments } from "react-icons/fa";
import "./Principal.css";

const Principal = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleChatClick = () => {
    setIsChatOpen(true);
    const newMessage = "Resumo de hoje";
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    speakMessage(newMessage); // Lê a mensagem em voz alta
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const speakMessage = (message) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "pt-BR"; // Define o idioma para português
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("A API de síntese de fala não é suportada neste navegador.");
    }
  };

  return (
    <div className="demo-app-main">
      <FullCalendar
        plugins={[dayGridPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        initialView="dayGridMonth"
        editable={false}
        selectable={false}
        dayMaxEvents={true}
      />
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