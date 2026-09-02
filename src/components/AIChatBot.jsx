import React, { useState, useEffect, useRef } from 'react';
import { sendAIChatMessage } from '../services/aiChatService';
import { CONTACT_INFO } from '../data/agencyData';
import { logSecurityEvent } from '../services/storageService';
import { Bot, MessageSquare, Send, X, Sparkles, User, RefreshCw, MessageCircle, ExternalLink, ChevronDown, Check, Copy } from 'lucide-react';

export default function AIChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `👋 **Welcome to The Unfiltered Engineer!**\n\nI am your **AI Solutions Architect** powered by GPT-4o. I have deep knowledge across our **1,000+ senior engineer collective** and 8 specialized practices.\n\nI can answer **any technical question**, scope your architecture, or connect you directly with **Vikas Mishra**.\n\nHow can I help you today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const starterPrompts = [
    "🚀 How does your 1,000+ engineer squad work?",
    "🛡️ Tell me about your Zero-Trust Cyber Security SLA",
    "🤖 What can you build with custom AI LLMs & Agent Swarms?",
    "💬 How can I consult directly with Vikas Mishra?",
    "📈 How does the 360° Marketing ROAS engine work?",
    "⛓️ What Web3 & Blockchain protocols do you engineer?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setLoading(true);

    try {
      logSecurityEvent('AI_CHAT', `Visitor Queried AI Solutions Architect: "${text.slice(0, 60)}..."`, { prompt: text });

      // Build conversation history for context (exclude welcome message if needed)
      const history = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const reply = await sendAIChatMessage(history.slice(1, -1), text);

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: reply
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: `I ran into an issue connecting to the AI brain. You can chat directly with **Vikas Mishra** on WhatsApp: [Chat on WhatsApp](https://wa.me/918369804739)`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `👋 **Chat Reset.** I am ready for your next question about our engineering squads, architecture design, or custom projects!`
      }
    ]);
  };

  // Helper to format basic markdown-style text (bold, links, code, lists)
  const renderFormattedContent = (content) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;

          // Bullet point
          const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ') || line.trim().startsWith('* ');
          const lineText = isBullet ? line.trim().replace(/^[-•*]\s+/, '') : line;

          // Simple markdown parsing for **bold** and [links](url)
          const parts = lineText.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);

          const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-slate-950">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
              const match = part.match(/\[(.*?)\]\((.*?)\)/);
              if (match) {
                return (
                  <a
                    key={pIdx}
                    href={match[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 underline font-semibold hover:text-sky-800 inline-flex items-center gap-0.5"
                  >
                    <span>{match[1]}</span>
                    <ExternalLink className="w-3 h-3 inline" />
                  </a>
                );
              }
            }
            return part;
          });

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-sky-600 font-bold">•</span>
                <div className="flex-1">{formattedLine}</div>
              </div>
            );
          }

          return <div key={idx}>{formattedLine}</div>;
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex items-end justify-end p-0 sm:p-0">
      
      {/* Mobile Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs sm:hidden transition-opacity" 
      />

      {/* Chat Window Container */}
      <div className="relative w-full sm:w-[440px] md:w-[480px] h-[92vh] sm:h-[620px] bg-[#FAF7EE] rounded-t-3xl sm:rounded-3xl border-2 border-[#141414] shadow-[7px_7px_0_0_#141414] flex flex-col overflow-hidden animate-fadeIn font-sans z-10 text-[#141414]">
        
        {/* Header Bar */}
        <div className="p-4 bg-[#141414] text-[#FAF7EE] flex items-center justify-between border-b-2 border-[#141414]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-[#141414] overflow-hidden flex items-center justify-center border-2 border-[#141414] shadow-[2px_2px_0_0_#FF4D00] p-0.5">
                <img src="/assets/brand-logo.png" alt="Brand Logo" className="w-full h-full object-contain rounded-xl" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#141414] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-black uppercase text-[#FAF7EE]">AI ARCHITECT</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#FFC72E] text-[10px] font-display font-black text-[#141414]">
                  GPT-4o
                </span>
              </div>
              <p className="text-[11px] text-[#FAF7EE]/70 font-medium">
                Vikas Mishra Senior Engineering Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl text-[#FAF7EE]/70 hover:text-[#FAF7EE] hover:bg-white/10 transition-colors text-xs cursor-pointer"
              title="Reset Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#FAF7EE]/70 hover:text-[#FAF7EE] hover:bg-white/10 transition-colors cursor-pointer"
              title="Close AI Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Founder Callout Banner */}
        <div className="bg-[#FFC72E] px-4 py-2 border-b-2 border-[#141414] flex items-center justify-between text-xs text-[#141414] font-display font-black uppercase">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
            <span>DIRECT FOUNDER: <strong>{CONTACT_INFO.phoneDisplay}</strong></span>
          </div>
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#FF4D00]"
          >
            WHATSAPP →
          </a>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F4EFE6]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="size-8 rounded-xl bg-[#141414] overflow-hidden border border-[#141414] shadow-[1px_1px_0_0_#FF4D00] flex items-center justify-center flex-shrink-0 mt-0.5 p-0.5">
                    <img src="/assets/brand-logo.png" alt="AI" className="w-full h-full object-contain rounded-lg" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 transition-all relative group ${
                    isUser
                      ? 'bg-slate-950 text-white rounded-br-xs shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {isUser ? (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div>
                      {renderFormattedContent(msg.content)}
                      
                      {/* Copy snippet button */}
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="mt-2 text-[10px] font-mono text-slate-400 hover:text-slate-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Response</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-2.5 items-start animate-fadeIn">
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-slate-500 font-mono ml-1.5">Analyzing architecture & specs...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompts Horizontal Scroll */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
          {starterPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-slate-700 text-xs whitespace-nowrap transition-colors border border-slate-200/80 flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about architecture, code, or our squads..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputMessage.trim()}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white disabled:opacity-40 transition-all shadow-xs"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
