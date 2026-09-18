import { useState } from "react";
import { Bot, Send } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I can help you plan your career, improve your resume, and suggest your next learning steps.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/chat", {
        message: input,
        userProfile: user,
      });

      setMessages((prev) => [...prev, { sender: "bot", text: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "I’m unable to answer right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Career Advisor</h1>
          <p className="text-sm text-slate-500">Ask about your road map, skill gaps, or resume improvements.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
        <div className="mb-4 max-h-[420px] space-y-4 overflow-y-auto">
          {messages.map((message, idx) => (
            <div key={idx} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${message.sender === "user" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask: How do I become a Full Stack Developer?"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-4 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            <Send size={16} />
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
