import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io(import.meta.env.VITE_API_URL);

export default function ChatBox({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId = Cookies.get("user");
  const roomId = [currentUserId, user.user_id].sort().join("_");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    setMessages([]);
    socket.emit("join_room", roomId);

    axios
      .get(`${import.meta.env.VITE_API_URL}/messages/${roomId}`)
      .then((res) => {
        const formatted = res.data.messages.map((m) => ({
          text: m.text,
          sender: m.sender === currentUserId ? "me" : "other",
        }));
        setMessages(formatted);
      })
      .catch(console.error);

    socket.emit("mark_as_read", { room: roomId, receiver: currentUserId });

    // 🔔 Tell server to refresh unread count
    socket.emit("refresh_unread", currentUserId);

    return () => {
      socket.emit("leave_room", roomId);
    };
  }, [user?.user_id, currentUserId]);

  useEffect(() => {
    const handleReceive = (data) => {
      if (data.room === roomId && data.sender !== currentUserId) {
        setMessages((prev) => [...prev, { text: data.text, sender: "other" }]);
      }
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [roomId, currentUserId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      text: input,
      sender: currentUserId,
      receiver: user.user_id,
      room: roomId,
    };

    setMessages((prev) => [...prev, { text: input, sender: "me" }]);
    setInput("");
    socket.emit("send_message", newMessage);
  };

  return (
    <div
      className="d-flex flex-column"
      style={{
        height: "100%",
        width: "100%",
        borderLeft: "1px solid #ccc",
        overflow: "hidden",
      }}
    >
      <div className="bg-dark text-white px-3 py-2">
        <strong>Chat with {user?.first_name || "..."}</strong>
      </div>

      <div
        className="flex-grow-1 px-3 py-2 overflow-auto"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 d-flex ${
              msg.sender === "me"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              className={`p-2 rounded ${
                msg.sender === "me"
                  ? "bg-primary text-white"
                  : "bg-light border"
              }`}
              style={{ maxWidth: "75%", wordBreak: "break-word" }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-top bg-white p-2">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
