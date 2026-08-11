
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import gsap from 'gsap';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  isDarkMode: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Archival core active. How can I assist your navigation?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Refined entrance animation for the chat window
  useEffect(() => {
    if (isOpen && chatWindowRef.current) {
      gsap.fromTo(chatWindowRef.current, 
        { 
          opacity: 0, 
          scale: 0.98, 
          y: 20,
          filter: 'blur(10px)'
        },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          filter: 'blur(0px)',
          duration: 0.6, 
          ease: 'expo.out' 
        }
      );
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: "You are the AI for XILYAS, a high-end multidisciplinary artist. Your tone is clinical, brief, and artistic. Maintain the persona of an archival system intellect. Use Inter font.",
        },
      });

      const aiText = response.text || "Connection severed.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Signal interference detected." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (chatWindowRef.current) {
      gsap.to(chatWindowRef.current, {
        opacity: 0,
        scale: 0.98,
        y: 10,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => setIsOpen(false)
      });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-28 right-6 md:right-8 z-[60]">
      {isOpen ? (
        <div 
          ref={chatWindowRef}
          className={`w-80 md:w-96 h-[480px] flex flex-col rounded-none border shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
            isDarkMode ? 'bg-black/90 border-white/10 text-white/80' : 'bg-white/95 border-black/10 text-black/80'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-5 border-b ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse opacity-40"></div>
              <span className="text-[9px] tracking-[0.5em] font-bold uppercase opacity-40">SYSTEM_INTEL</span>
            </div>
            <button onClick={handleClose} className="opacity-30 hover:opacity-100 transition-opacity p-1">
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 text-[10px] md:text-[11px] leading-relaxed font-light scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] px-4 py-3 transition-all duration-500 ${
                    msg.role === 'user' 
                      ? 'bg-current/10 border border-transparent' 
                      : `bg-current/[0.02] border border-current/10 border-l-2 border-l-current/40`
                  }`}
                >
                  <p className="tracking-wide">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-current/[0.02] border border-current/5">
                  <Loader2 className="animate-spin opacity-20" size={14} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className={`p-5 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
            <div className="relative flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query the archive..."
                className="flex-1 bg-transparent outline-none text-[10px] md:text-[11px] tracking-[0.15em] placeholder:opacity-20 font-light"
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className={`transition-opacity duration-300 ${isLoading || !input.trim() ? 'opacity-10' : 'opacity-40 hover:opacity-100'}`}
              >
                <Send size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-none border transition-all duration-700 shadow-2xl backdrop-blur-md ${
            isDarkMode 
              ? 'bg-black border-white/10 text-white/40 hover:text-white hover:border-white/30' 
              : 'bg-white border-black/10 text-black/40 hover:text-black hover:border-black/30'
          }`}
          aria-label="Initiate AI Assistant"
        >
          <MessageSquare size={18} strokeWidth={1} />
          
          {/* Minimalist Tooltip */}
          <div className="absolute right-full mr-6 pointer-events-none overflow-hidden">
            <span className="block text-[8px] tracking-[0.8em] font-black uppercase opacity-0 group-hover:opacity-40 transition-all duration-700 whitespace-nowrap transform translate-x-4 group-hover:translate-x-0">
              Initiate AI Assistant
            </span>
          </div>
          
          {/* Subtle Activity Dot */}
          <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-current opacity-20 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
