import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  type?: 'text' | 'products';
  data?: any[];
  suggestions?: { label: string, url: string }[];
}

// --- CONFIGURATION ---
const BRAND_COLOR = '#326638';
const BRAND_GRADIENT = 'linear-gradient(135deg, #326638 0%, #1a3c1e 100%)';
const BG_COLOR = '#F2E8D5';

const QUICK_LINKS = [
  { label: "🔥 Products & Promotions", url: "/collections" },
  { label: "📦 Track Order", url: "/track-order" },
  { label: "↩️ Return Policy", url: "/return-policy" },
];

const ChatWidget: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your **Moore Market** assistant. How can I help you today?", sender: 'bot', type: 'text' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  // --- DRAG STATE ---
  const [positionX, setPositionX] = useState<number | null>(null); 
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffsetX = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isLoading]);

  // --- HORIZONTAL DRAG LOGIC ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();

      const newX = e.clientX - dragOffsetX.current;
      const widgetWidth = 380;
      const maxX = window.innerWidth - widgetWidth - 20;
      const minX = 20;

      setPositionX(Math.min(Math.max(minX, newX), maxX));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = "auto";
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOpen]);

  const startDrag = (e: React.MouseEvent) => {
    if (chatWindowRef.current) {
      isDragging.current = true;
      const rect = chatWindowRef.current.getBoundingClientRect();
      dragOffsetX.current = e.clientX - rect.left;
      document.body.style.userSelect = "none";
    }
  };

  // --- PARSE LOGIC ---
  const processResponse = (responseText: string): Message => {
    let msg: Message = { text: responseText, sender: 'bot', type: 'text' };

    const productMatch = responseText.match(/<PRODUCTS>([\s\S]*?)<\/PRODUCTS>/);
    if (productMatch && productMatch[1]) {
      try {
        msg.type = 'products';
        msg.data = JSON.parse(productMatch[1]);
        msg.text = responseText.replace(/<PRODUCTS>[\s\S]*?<\/PRODUCTS>/, '').trim() || "Here are the books I found:";
        return msg;
      } catch {}
    }

    const suggestionMatch = responseText.match(/<SUGGESTIONS>([\s\S]*?)<\/SUGGESTIONS>/);
    if (suggestionMatch && suggestionMatch[1]) {
      try {
        msg.suggestions = JSON.parse(suggestionMatch[1]);
        msg.text = responseText.replace(/<SUGGESTIONS>[\s\S]*?<\/SUGGESTIONS>/, '').trim();
        return msg;
      } catch {}
    }

    return msg;
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user', type: 'text' }]);
    setInput("");
    setIsLoading(true);

    try {
      const endpoint = threadId ? `http://localhost:8000/chat/${threadId}` : `http://localhost:8000/chat`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();

      if (!threadId && data.threadId) setThreadId(data.threadId);

      const botMessage = processResponse(data.response);
      setMessages(prev => [...prev, botMessage]);

    } catch {
      setMessages(prev => [...prev, { text: "I'm having trouble connecting to the server.", sender: 'bot', type: 'text' }]);
    } finally { setIsLoading(false); }
  };

  // --- RENDERING ---
  const renderMessageContent = (msg: Message) => (
    <div className="w-full">
      <div className={`text-sm leading-relaxed markdown-content mb-2 ${msg.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
        <ReactMarkdown>{msg.text}</ReactMarkdown>
      </div>

      {msg.type === 'products' && msg.data && (
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-2 px-2 custom-scrollbar mt-2">
          {msg.data.map((prod: any, idx: number) => (
            <div key={idx}
              className="flex-shrink-0 w-44 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="h-32 bg-white flex items-center justify-center relative overflow-hidden border-b border-gray-100">
                {prod.image ? (
                  <img src={prod.image} alt={prod.title}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }} />
                ) : null}
                <span className={`text-4xl absolute text-gray-300 ${prod.image ? 'hidden' : ''}`}>📚</span>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-xs text-gray-900 truncate mb-1">{prod.title}</h4>
                <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide">{prod.category || "Book"}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-[#326638] text-sm">₹{prod.price}</span>
                  <button onClick={() => navigate(`/product-detail/${prod.id}`)}
                    className="bg-[#326638] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#254d2a] transition-colors shadow-sm">
                    VIEW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {msg.suggestions && (
        <div className="flex flex-wrap gap-2 mt-3 animate-fade-in-up">
          {msg.suggestions.map((btn, idx) => (
            <button key={idx} onClick={() => navigate(btn.url)}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:bg-[#326638] hover:text-white hover:border-[#326638] transition-all duration-200 group">
              <span className="text-xs font-semibold">{btn.label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                className="text-gray-400 group-hover:text-white">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const toggleChat = () => {
    if (!isOpen && positionX === null) {
      setPositionX(window.innerWidth - 400);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(50, 102, 56, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(50, 102, 56, 0); } 100% { box-shadow: 0 0 0 0 rgba(50, 102, 56, 0); } }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
        .animate-pulse-glow { animation: pulseGlow 2s infinite; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4c5a9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #326638; }
        .markdown-content p { margin-bottom: 0.5rem; }
        .markdown-content strong { font-weight: 700; }
        .markdown-content ul { list-style-type: disc; padding-left: 1.2rem; }
        .markdown-content a { text-decoration: underline; color: inherit; }
      `}</style>

      <div className="font-sans z-[9999]">

        {/* FLOATING BUTTON (when closed) */}
        {!isOpen && (
          <button 
            onClick={toggleChat}
            className="fixed bottom-20 md:bottom-8 right-8 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 animate-pulse-glow flex items-center justify-center group"
            style={{ background: BRAND_GRADIENT }}
          >
            <svg
  xmlns="http://www.w3.org/2000/svg"
  width="28"
  height="28"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="group-hover:rotate-12 transition-transform duration-300"
  style={{
    display: "block",
    margin: "auto",
  }}
>
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
</svg>

          </button>
        )}

        {/* CHAT WINDOW (when open) */}
        {isOpen && (
          <div
            ref={chatWindowRef}
            className="fixed flex flex-col overflow-hidden rounded-2xl shadow-2xl border border-[#d4c5a9]/50 animate-fade-in-up backdrop-blur-sm"
            style={{
              width: window.innerWidth < 420 ? '92vw' : '380px',
              height: '600px',
              backgroundColor: BG_COLOR,

        // DESKTOP (no dragging applied yet)
          left: window.innerWidth >= 768
          ? (positionX !== null ? positionX : undefined): 'unset',

          right: window.innerWidth < 768
          ? '12px'   // FORCE MOBILE TO STAY INSIDE SCREEN
          : (positionX === null ? '24px' : undefined),

          bottom: window.innerWidth < 768 ? '90px' : '24px',

          top: 'auto',
          zIndex: 9999,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}

          >

            {/* HEADER */}
            <div 
              onMouseDown={startDrag}
              className="p-5 flex justify-between items-center text-white select-none bg-gradient-to-r from-[#326638] to-[#1e4222]"
              style={{ cursor: 'ew-resize' }}
            >
              <div className="flex flex-col">
                <h3 className="font-bold text-lg tracking-wide font-serif">Moore Market</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-medium text-green-100 uppercase tracking-wider">
                    AI Assistant • Online
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-[#F2E8D5]">
              
              {messages.length === 1 && (
                <div className="mb-6 animate-fade-in-up">
                  <p className="text-xs font-bold text-[#326638]/70 mb-3 uppercase tracking-wider ml-1">
                    Quick Actions
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {QUICK_LINKS.map((link, idx) => (
                      <a key={idx} href={link.url}
                        className="bg-white/80 border border-[#326638]/10 text-[#326638] px-4 py-3.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md hover:bg-[#326638] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-between group"
                      >
                        {link.label} <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className={`max-w-[88%] p-3.5 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#326638] text-white rounded-2xl rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-[#e0d4c0]'
                  }`}>
                    {renderMessageContent(msg)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="bg-white/80 border border-[#e0d4c0] p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-[#326638] rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-[#326638] rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-[#326638] rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT BOX */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-[#d4c5a9] bg-white/60 backdrop-blur-md flex gap-3 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about books, orders..."
                className="flex-1 border border-[#d4c5a9] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#326638] focus:ring-2 focus:ring-[#326638]/20 bg-white shadow-inner transition-all"
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#326638] text-white p-3 rounded-full hover:bg-[#254d2a] disabled:opacity-50 shadow-lg transition-transform active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>

          </div>
        )}
      </div>
    </>
  );
};

export default ChatWidget;
