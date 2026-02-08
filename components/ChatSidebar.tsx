
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { ChatMessage } from '../types';
import { chatWithAssistant } from '../services/geminiService';

export const ChatSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: "Welcome to Lumina. I am your personal travel concierge. How may I refine your journey today?", 
      timestamp: new Date() 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessageText = input.trim();
    if (!userMessageText || isTyping) return;

    setInput('');
    const userMsg: ChatMessage = { role: 'user', content: userMessageText, timestamp: new Date() };
    
    const currentHistory = [...messages];
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await chatWithAssistant(userMessageText, currentHistory);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.text, 
        timestamp: new Date(),
        sources: response.sources
      }]);
    } catch (error: any) {
      const errorMessage = error.message === "QUOTA_EXHAUSTED" 
        ? "I am currently attending to many distinguished guests. Please allow me a moment."
        : "I encountered a brief interruption in our connection. Could you kindly repeat that?";
        
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Premium FAB */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-950 text-white rounded-full shadow-[0_20px_50px_rgba(15,23,42,0.3)] hover:bg-blue-600 hover:scale-110 hover:-translate-y-1 transition-all flex items-center justify-center group z-40 active:scale-95 border-4 border-white"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-blue-400/20 group-hover:hidden"></div>
        <Icons.Sparkles />
      </button>

      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:right-8 md:bottom-28 md:w-[420px] md:h-[650px] bg-white/80 backdrop-blur-2xl md:rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] z-50 flex flex-col overflow-hidden border border-white animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
          
          {/* Elegant Header */}
          <div className="p-6 bg-gradient-to-b from-blue-950 to-blue-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                <Icons.Plane />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-[0.2em]">Lumina</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Bespoke Concierge</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
            >
              <Icons.Close />
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-grow p-6 overflow-y-auto space-y-6 scroll-smooth"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'assistant' && (
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 ml-1">Assistant</span>
                )}
                <div className={`max-w-[85%] rounded-[1.5rem] p-4 text-[14px] leading-relaxed shadow-sm transition-all duration-300 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-200/50 font-medium' 
                    : 'bg-white text-blue-950 border border-slate-100 rounded-tl-none font-semibold'
                }`}>
                  {msg.content}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 max-w-[85%] flex flex-wrap gap-2">
                    {msg.sources.map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-blue-50/50 border border-blue-100/50 px-3 py-1.5 rounded-full text-blue-700 hover:bg-blue-100 transition-all flex items-center gap-2 font-bold"
                      >
                        <div className="w-1 h-1 rounded-full bg-blue-600"></div>
                        <span className="truncate max-w-[120px]">{source.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 ml-1">Lumina is thinking</span>
                <div className="bg-white border border-slate-100 rounded-[1.5rem] rounded-tl-none p-4 flex gap-1.5 items-center shadow-sm">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-duration:0.6s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.1s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white/50 border-t border-slate-100">
            <form onSubmit={handleSend} className="relative group">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="How can I assist your travels?"
                className="w-full pl-6 pr-14 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm text-blue-950 font-bold placeholder:text-slate-300 shadow-sm"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-950 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all active:scale-90 disabled:opacity-20 shadow-lg shadow-blue-950/20"
              >
                <Icons.Send />
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
              <div className="w-2 h-[1px] bg-slate-400"></div>
              <p className="text-[8px] text-slate-500 uppercase tracking-[0.4em] font-black">
                Encrypted Intelligence
              </p>
              <div className="w-2 h-[1px] bg-slate-400"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
