
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Brain, Calculator, Landmark, Monitor } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am BankEdge Pro, your detailed exam coach. I cover all major banking exams including SBI, IBPS, and RRB (PO & Clerk). I can help you with deep-dive concepts, shortcuts, or generate practice questions instantly. What should we study?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: messageText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for Gemini (mapping our internal type to API type)
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendChatMessage(history, userMsg.text);

    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: "🧩 Puzzle Drill", prompt: "Generate a Reasoning Puzzle (Floor/Box based) for SBI PO Prelims with 1 question.", icon: Brain, color: "bg-purple-100 text-purple-700" },
    { label: "📊 Quant Quiz", prompt: "Generate a tough Arithmetic Word Problem (Profit & Loss or Time & Work) for IBPS PO.", icon: Calculator, color: "bg-blue-100 text-blue-700" },
    { label: "🏛️ Banking Fact", prompt: "Tell me a critical static Banking Awareness fact that is often asked.", icon: Landmark, color: "bg-amber-100 text-amber-700" },
    { label: "💻 Computer Q", prompt: "Ask me a technical question about Computer Networking or OSI Model.", icon: Monitor, color: "bg-emerald-100 text-emerald-700" },
    { label: "🚀 Exam Strategy", prompt: "Give me a time management strategy for IBPS Clerk Prelims.", icon: Sparkles, color: "bg-rose-100 text-rose-700" }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
             <Bot size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sm md:text-base">BankEdge Pro Coach</h2>
            <p className="text-[10px] text-slate-300">Detailed Explanations & Question Generator</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-white/10 border border-white/20 px-2 py-1 rounded text-white/80">Gemini 3.0 Flash</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              flex max-w-[90%] md:max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}
            `}>
              <div className="mr-3 mt-0.5 flex-shrink-0 opacity-80">
                 {msg.role === 'user' ? <User size={18} /> : <Bot size={18} className="text-indigo-600" />}
              </div>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start w-full animate-pulse">
             <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center space-x-3">
                <Loader2 size={18} className="animate-spin text-indigo-600" />
                <span className="text-slate-400 text-sm font-medium">Analyzing & Generating...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-slate-100 flex flex-col">
        {/* Quick Actions Toolbar */}
        <div className="flex items-center gap-2 p-3 overflow-x-auto scrollbar-hide border-b border-slate-50">
           {quickActions.map((action, i) => {
             const Icon = action.icon;
             return (
               <button
                 key={i}
                 onClick={() => handleSend(action.prompt)}
                 className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-transform active:scale-95 ${action.color}`}
               >
                 <Icon size={14} /> {action.label}
               </button>
             )
           })}
        </div>

        <div className="p-4 relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'Generate a tough puzzle' or 'Explain Repo Rate'..."
            className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 border-0 rounded-xl py-3.5 pl-4 pr-12 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-6 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
