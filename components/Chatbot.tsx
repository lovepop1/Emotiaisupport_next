"use client";

import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ user: string; bot: any }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input, sessionId: "someSessionId", userId: "someUserId" }),
    });

    const newMessage = await res.json();
    setMessages([...messages, { user: input, bot: newMessage.response }]);
    setInput("");
  };

  return (
    <div className="p-4">
      <div className="border rounded p-2 h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>You:</strong> {msg.user}
            <br />
            <strong>Bot:</strong> {msg.bot}
          </p>
        ))}
      </div>
      <input
        className="border p-2 w-full"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white p-2 mt-2">
        Send
      </button>
    </div>
  );
}
