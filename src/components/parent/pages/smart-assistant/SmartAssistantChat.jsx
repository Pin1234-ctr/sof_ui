import React, { useState, useEffect, useRef, useContext } from "react";
import { Send, Sparkles, Loader, Download, Eye } from "lucide-react";
import ApiService from "../../../../service/ApiService";
import { POST_APIS } from "../../../../../connection";
import { UserContext } from "../../../../common/helper/UserContext";

function SmartAssistantChat() {
  const [isLoading, setIsLoading] = useState(true);
  const { chatMessages: messages, setChatMessages: setMessages, addChatMessage } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // If messages already exist in context, don't fetch initial message
    if (messages.length > 0) {
      setIsLoading(false);
      return;
    }

    const fetchInitialMessage = async () => {
      setIsLoading(true);
      try {
        const parentId = JSON.parse(localStorage.getItem("user"))?.userData?.id;
        if (!parentId) {
          throw new Error("Parent ID not found. Please log in again.");
        }
        const sessionId = sessionStorage.getItem("sessionId");
        const payload = {
          parentId,
          message: "",
          ...(sessionId && { sessionId }),
        };
        const result = await ApiService(POST_APIS.smartassistantchat, { method: 'POST', body: payload });
        if (result?.isSuccess && result.data) {
          const initialBotMessage = {
            id: 1,
            sender: "bot",
            text: result.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages([initialBotMessage]);
          if (result.data.sessionId) {
            sessionStorage.setItem("sessionId", result.data.sessionId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial message:", error);
        const errorMessage = {
          id: 1,
          sender: 'bot',
          text: 'Sorry, I could not connect to the Smart Assistant. Please try again later.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };
    // sessionStorage.removeItem("sessionId"); // Clear session on component mount
    fetchInitialMessage();
  }, [messages.length, setMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;
    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: trimmedInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    addChatMessage(newMessage);
    setInputValue("");
    setIsTyping(true);
    try {
      const parentId = JSON.parse(localStorage.getItem("user"))?.userData?.id;
      if (!parentId) {
        throw new Error("Parent ID not found. Please log in again.");
      }
      const sessionId = sessionStorage.getItem("sessionId");
      const payload = {
        parentId,
        message: trimmedInput,
        ...(sessionId && { sessionId }),
      };

      const result = await ApiService(POST_APIS.smartassistantchat, { method: 'POST', body: payload });

      if (result?.isSuccess && result.data) {
        const botResponse = {
          id: messages.length + 2, // Keeping original ID logic as requested
          sender: 'bot', // Adding sender for consistency
          text: result.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ...(result.data.action && { action: result.data.action }),
        };
        addChatMessage(botResponse);
        if (result.data.sessionId && !sessionStorage.getItem("sessionId")) {
          sessionStorage.setItem("sessionId", result.data.sessionId);
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDownload = async (e, url) => {
    e.preventDefault();
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok.");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop() || "download.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Could not download the file:", error);
      window.open(url, "_blank"); // Fallback to opening in a new tab
    }
  };

  // const handleQuickQuestion = (question) => {
  //   setInputValue(question);

  // };

  return (
    <div className="flex flex-col items-center h-[calc(100vh-200px)]">
      <div className="w-full h-full bg-white shadow-lg rounded-none sm:rounded-2xl px-4 sm:px-6 py-4 border-gray-200 flex flex-col">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
          <div className="bg-linear-to-br from-blue-500 to-green-400 text-white p-2.5 rounded-full shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1C398E]">Smart Assistant</h3>
            <p className="text-sm text-gray-500">Your AI-powered performance guide</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center gap-3 py-6">
            <Loader className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-600 text-sm">Waking up Smart Assistant...</p>
          </div>

        ) : (
          <>
            <div className="flex-1 overflow-y-scroll pr-2 space-y-6 py-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>

                  <div className={`w-fit max-w-md p-3 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-gray-100 text-gray-800 rounded-bl-lg'}`}>
                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                    {msg.sender === 'bot' && msg.action?.type === 'pdf_download' && (
                      <div className="mt-3 flex items-center gap-3">
                        <a
                          href={msg.action.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                        >
                          <Eye className="w-4 h-4" /> View
                        </a>
                        <a
                          href={msg.action.url}
                          onClick={(e) => handleDownload(e, msg.action.url)}
                          className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                        >
                          <Download className="w-4 h-4" /> Download
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-end gap-2">

                  <div className="w-fit max-w-md p-3 rounded-2xl shadow-sm bg-gray-100 text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 border border-gray-400 bg-white rounded-xl px-2 py-1.5 shadow-sm focus-within:ring-blue-[#1C398E] focus-within:ring-opacity-50">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything about learning performance…"
                  className="flex-1 focus:outline-none text-sm bg-transparent px-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputValue.trim()) {
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className={`p-2 rounded-lg transition-colors 
      ${inputValue.trim()
                      ? "bg-[#1C398E] hover:bg-blue-700 text-white cursor-pointer"
                      : "bg-blue-300 cursor-not-allowed opacity-70 text-white"}`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SmartAssistantChat;
