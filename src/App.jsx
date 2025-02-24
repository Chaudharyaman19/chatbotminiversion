import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import "./index.css";
import axios from "axios";

const API_KEY = "AIzaSyBQzspnMDzSSZjtzNV44tjS5TyBgBdoGr8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

function App() {
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    const response = await axios.post(
      API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: input,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const modelRes =
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0];
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          text: modelRes.text || "I'd love to help you with that!",
        },
      ]);
      setIsTyping(false);
    }, 100);
  };
  return (
    <div className="chat-container man">
      <header className="header space">
        <div className="a-container">
          <div className="a-content">
            <div className="a-icon-box a-blue-bg">
              <i className="fas fa-user-plus a-blue-icon"></i>
            </div>
            <div className="a-text">
              <div className="a-name"> Chat Bot</div>
              <div className="a-status">
                <span className="a-green-dot"></span>
                <span>Active</span>
              </div>
            </div>
            <div className="a-icon-box a-red-bg">
              <i className="fas fa-times a-red-icon"></i>
            </div>
          </div>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type}`}>
            <div className="message-avatar">
              <img
                src={
                  msg.type === "bot"
                    ? "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=100&q=80"
                    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                }
                alt={`${msg.type} avatar`}
              />
            </div>
            <div className="message-content">
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message bot">
            <div className="message-avatar">
              <img
                src="https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=100&q=80"
                alt="bot avatar"
              />
            </div>
            <div className="message-content">
              <div className="typing-animation">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          className="input-field"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="icon-button" onClick={handleSend}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default App;
