import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";

function ChatAI({problem}) {
  const [messages, setMessages] = useState([
    { role: "model", parts: [{ text: "Hi, How are you" }] },
    { role: "user", parts: [{ text: "I am Good" }] },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", parts: [{ text: data.message }] },
    ]);
    reset();

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: messages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
      });

      console.log(response);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: response.data.message }],
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Error from AI Chatbot" }],
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px] text-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 backdrop-blur-xl bg-white/5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div
              className={`chat-bubble max-w-[75%] px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md border border-white/20 ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-indigo-500/30 to-blue-500/30 text-white"
                  : "bg-white/20 text-white"
              }`}
            >
              {msg.parts[0].text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sticky bottom-0 p-4 bg-white/10 backdrop-blur-xl border-t border-white/20 flex items-center gap-2"
      >
        <input
          placeholder="Ask me anything"
          className="input flex-1 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 shadow-md"
          {...register("message", { required: true, minLength: 2 })}
        />
        <button
          type="submit"
          className="btn rounded-xl bg-gradient-to-r from-purple-500/40 to-pink-500/40 hover:from-purple-500 hover:to-pink-500 text-white border border-white/30 shadow-lg backdrop-blur-md transition duration-300"
          disabled={errors.message}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default ChatAI;
