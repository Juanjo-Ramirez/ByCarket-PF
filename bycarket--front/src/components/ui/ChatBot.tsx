"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Mail, MailX } from "lucide-react";
import { getChatCompletion } from "@/services/api.service";
import { usePathname } from "next/navigation";
import { getResponseFromDictionary } from "@/data/chatbot-responses";

export default function AnimatedChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chatbot" | "messages">("chatbot");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ id: number; text: string; sender: "user" | "bot" }>
  >([{ id: 1, text: "¡Hola! ¿En qué puedo ayudarte hoy?", sender: "bot" }]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const getPostIdFromUrl = (): string | undefined => {
    if (!pathname) return undefined;

    const regex = /\/marketplace\/([\w-]+)$/;
    const match = pathname.match(regex);

    return match ? match[1] : undefined;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "user" as const,
    };

    setMessages((prev) => [...prev, newMessage]);
    const currentMessage = message;
    setMessage("");

    try {
      const postId = getPostIdFromUrl();
      const response = await getChatCompletion(
        [{ role: "user", content: currentMessage }],
        postId
      );

      if (!response?.response?.trim()) {
        throw new Error("Empty response from AI");
      }

      const botResponse = {
        id: Date.now() + 1,
        text: response.response,
        sender: "bot" as const,
      };
      setMessages((prev) => [...prev, botResponse]);
      return;
    } catch (error) {
      try {
        const dictionaryResponse = getResponseFromDictionary(currentMessage);

        if (
          typeof dictionaryResponse === "string" &&
          dictionaryResponse.trim()
        ) {
          const botResponse = {
            id: Date.now() + 1,
            text: dictionaryResponse,
            sender: "bot" as const,
          };
          setMessages((prev) => [...prev, botResponse]);
          return;
        }

        throw new Error("No mock response available");
      } catch (mockError) {
        const botResponse = {
          id: Date.now() + 1,
          text: "Lo siento, no pude procesar tu mensaje en este momento. ¿Podrías reformularlo?",
          sender: "bot" as const,
        };
        setMessages((prev) => [...prev, botResponse]);
      }
    }
  };

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5,
        }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-r from-[#103663] to-[#4a77a8] rounded-full shadow-lg flex items-center justify-center text-white relative overflow-hidden"
          whileHover={{
            scale: 1.1,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-white rounded-full"
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{
              scale: isOpen ? 0 : [0, 1.5],
              opacity: isOpen ? 0 : [0.7, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }}
          />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed bottom-20 right-4 w-80 h-[480px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-w-[calc(100vw-2rem)] flex flex-col"
              initial={{
                scale: 0,
                opacity: 0,
                x: 100,
                y: 100,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                x: 0,
                y: 0,
              }}
              exit={{
                scale: 0,
                opacity: 0,
                x: 100,
                y: 100,
              }}
            >
              <div className="flex flex-col h-full">
                <div className="p-4 bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">
                      {activeTab === "chatbot" ? "Asistente" : "Mensajes"}
                    </h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("chatbot")}
                    className={`flex-1 py-2 text-sm font-medium ${
                      activeTab === "chatbot"
                        ? "text-[#103663] border-b-2 border-[#103663]"
                        : "text-gray-500"
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab("messages")}
                    className={`flex-1 py-2 text-sm font-medium ${
                      activeTab === "messages"
                        ? "text-[#103663] border-b-2 border-[#103663]"
                        : "text-gray-500"
                    }`}
                  >
                    Mensajes
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "chatbot" ? (
                    <motion.div
                      key="chatbot"
                      className="flex-1 flex flex-col overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <AnimatePresence>
                          {messages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              className={`flex ${
                                msg.sender === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div
                                className={`max-w-[80%] p-3 rounded-xl ${
                                  msg.sender === "user"
                                    ? "bg-[#103663] text-white"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 17,
                                }}
                              >
                                <p className="text-sm">{msg.text}</p>
                              </motion.div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                      </div>

                      <div className="p-3 border-t border-gray-200 bg-white">
                        <form
                          onSubmit={handleSendMessage}
                          className="flex space-x-2"
                        >
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Escribe tu mensaje..."
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a77a8] focus:border-transparent"
                          />
                          <button
                            type="submit"
                            className="p-3 bg-[#103663] text-white rounded-xl hover:bg-[#0d2b52] transition-colors"
                          >
                            <Send size={20} />
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="messages"
                      className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Mail size={64} className="text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Mensajes Deshabilitados
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Esta función estará disponible próximamente
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
