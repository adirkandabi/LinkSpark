import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const message = { text: input, sender: "me" };
    setMessages((prev) => [...prev, message]);
    socket.emit("send_message", { text: input });
    setInput("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { text: data.text, sender: "other" }]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div
        className="card shadow-sm"
        style={{ maxWidth: "600px", margin: "auto", height: "600px" }}
      >
        <div className="card-header bg-dark text-white">
          <strong>User Chat</strong>
        </div>
        <div
          className="card-body d-flex flex-column overflow-auto"
          style={{ height: "450px" }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${
                msg.sender === "me" ? "text-end" : "text-start"
              }`}
            >
              <div
                className={`rounded p-2 d-inline-block ${
                  msg.sender === "me" ? "bg-primary text-white" : "bg-light"
                }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="card-footer">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                className="form-control no-focus"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
              <button className="btn btn-primary" type="submit">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
