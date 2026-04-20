import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, User, ChevronRight, Minimize2, Maximize2, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI } from '../services/api';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your Placement Intelligence Assistant. Ask me anything about your applications, companies, or interview prep!" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSuggestion = (text) => {
    handleSend(null, text);
  };

  const handleSend = async (e, directText = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = directText || input;
    if (!query.trim() || loading) return;

    const userMsg = query.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const { data } = await aiAPI.chat({ query: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      console.error('AI Assistant Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Neural link connection failed. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 border border-indigo-400/30 text-white transition-opacity ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            className={`fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] bg-[#0d0d1e] border border-white/10 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px] max-h-[80vh]'}`}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-indigo-600 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide">Neural Assistant</h3>
                  <div className="flex items-center gap-1.5 ">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth"
                >
                  {messages.map((m, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-indigo-600' : 'bg-white/5 border border-white/10'}`}>
                          {m.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-indigo-400" />}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'}`}>
                          {m.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                          <Bot size={14} />
                        </div>
                        <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-1">
                          <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <form 
                  onSubmit={handleSend}
                  className="p-4 border-t border-white/5 bg-white/2"
                >
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/8 outline-none transition-all"
                      placeholder="Ask me anything..."
                      value={input}
                      onChange={e => setInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-50 disabled:grayscale transition-all"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <div className="flex justify-center gap-4 mt-3">
                    <button 
                      type="button"
                      onClick={() => handleSuggestion("Tell me about my recent applications")}
                      className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors"
                    >
                      Recent Apps
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleSuggestion("How to prepare for coding rounds?")}
                      className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors"
                    >
                      Prep Tips
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;
