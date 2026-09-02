import React, { useState, useEffect, useRef } from 'react';
import { CONTACT_INFO, SERVICE_PILLARS, GLOBAL_HUBS } from '../data/agencyData';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function InteractiveTerminal({ isOpen, onClose, onNavigateTo }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'THE UNFILTERED ENGINEER — MILITARY-GRADE INTERACTIVE CLI v4.9' },
    { type: 'system', text: 'All sessions are end-to-end verified via HMAC-SHA256 zero-trust tokens.' },
    { type: 'system', text: 'Type "help" to view available engineer commands, or "whatsapp" / "telegram" to contact immediately.' }
  ]);
  const inputRef = useRef(null);
  const scrollBottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    const cmd = input.trim();
    if (!cmd) return;

    const newHistory = [...history, { type: 'user', text: "$ " + cmd }];
    const parts = cmd.toLowerCase().split(' ');
    const mainCmd = parts[0];

    switch (mainCmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: `AVAILABLE COMMANDS:
  help              Display this command index
  services          List all 5 core engineering & marketing pillars
  squads            Inspect specialized engineering team rosters
  globe             Display worldwide connected delivery hubs & latencies
  security          Show unhackable zero-trust military defense specs
  audit <domain>    Run instant security & exploit assessment
  whatsapp          Launch WhatsApp direct channel (+918369804739)
  telegram          Launch Telegram direct channel (@Yourstrulyvikasmishra)
  pricing           View transparent retainer and sprint tiers
  clear             Clear terminal screen
  exit              Close interactive CLI session`
        });
        break;

      case 'services':
        newHistory.push({
          type: 'output',
          text: `PRACTICE VERTICALS:
  1. Cyber Security & Military Defense (0 breaches, red-team penetration, smart contract formal audits)
  2. Blockchain & Web3 Ecosystems ($1.2B+ TVL, EVM/Solana, ZK rollups)
  3. AI / ML & Cognitive Systems (Custom enterprise LLMs, multi-agent swarms, RAG)
  4. Full-Stack & Cloud Edge Systems (Go/Rust/Node microservices, 99.999% SLA)
  5. 360° Digital & Omni-Channel Marketing (Meta CAPI, Google PMax, Technical SEO, Offline Billboards)`
        });
        break;

      case 'squads':
        newHistory.push({
          type: 'output',
          text: `SPECIALIZED SQUADS ROSTER:
  • Red/Blue Defense Squad: 7 Principal Security Engineers
  • Core Protocol Squad: 6 Senior Protocol & ZK Devs
  • Neural Architectures Squad: 8 AI Scientists & MLOps SREs
  • Distributed Systems Core: 9 Senior Full-Stack Engineers
  • Growth & Media Squad: 6 Senior Media Buyers & SEO Leads`
        });
        break;

      case 'globe':
        newHistory.push({
          type: 'output',
          text: `GLOBAL DELIVERY HUBS (40+ Countries Served):
  • Mumbai NOC: Primary Engineering HQ (8ms)
  • San Francisco: AI Research & Vector Infra (14ms)
  • New York: Hedge Fund Cyber Defense (18ms)
  • London: Fintech & Smart Contract Audits (22ms)
  • Zurich: ZK Cryptography & Privacy (26ms)
  • Dubai: Web3 & Growth Hub (31ms)
  • Singapore: Exchange High-Frequency Infra (19ms)
  • Tokyo: Autonomous Robotics (27ms)
  • Sydney: Distributed Edge (38ms)`
        });
        break;

      case 'security':
        newHistory.push({
          type: 'output',
          text: `MILITARY-GRADE DEFENSE ARCHITECTURE:
  [✓] 100% Independent Self-Contained Stack (Zero 3rd-party vendor lock-in)
  [✓] HMAC-SHA256 Cryptographic Payload Signing on all API routes
  [✓] Token Bucket Rate Limiting & Anti-DDoS Layer-7 Protection
  [✓] Strict Zero-Trust Content Security Policy (CSP) & DOMPurify Anti-XSS
  [✓] Formal Smart Contract Bytecode Decompilation & Verification`
        });
        break;

      case 'audit':
        const target = parts[1] || 'target-system.io';
        newHistory.push({
          type: 'output',
          text: `Executing penetration audit on [${target}]...
  Testing TLS 1.3 / HSTS ........................ [OK]
  Bytecode Decompilation & Reentrancy Analysis .. [OK]
  Layer-7 DDoS Resistance Benchmarking .......... [PASS - < 3ms overhead]
  Zero-Day CVE Surface .......................... [CLEAN - 0 Vulnerabilities]
  OVERALL DEFENSE SCORE: 98/100 (Grade: A+)`
        });
        break;

      case 'whatsapp':
        window.open(CONTACT_INFO.whatsappUrl, '_blank');
        newHistory.push({
          type: 'output',
          text: `Opening WhatsApp chat with Vikas Mishra (${CONTACT_INFO.phoneDisplay})...`
        });
        break;

      case 'telegram':
        window.open(CONTACT_INFO.telegramUrl, '_blank');
        newHistory.push({
          type: 'output',
          text: `Opening Telegram channel with ${CONTACT_INFO.telegramUser}...`
        });
        break;

      case 'pricing':
        newHistory.push({
          type: 'output',
          text: `TRANSPARENT ENGAGEMENT TIERS:
  • Engineering Sprint: $4,800 / 2-week sprint (2-Senior Squad)
  • Dedicated Squad: $11,500 / month (4-5 Specialists, 99.999% SLA)
  • 360° Growth Retainer: $7,200 / month (Meta, Google, SEO, Offline)`
        });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
        onClose();
        setInput('');
        return;

      default:
        newHistory.push({
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" to view list of commands.`
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl h-[520px] bg-obsidian-950 border border-sky-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono text-xs glow-border-sky">
        
        {/* Terminal Header Bar */}
        <div className="px-4 py-3 bg-obsidian-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="ml-3 flex items-center gap-2">
              <img src="/assets/brand-logo.png" alt="Logo" className="size-4 rounded-xs object-contain" />
              <span className="text-slate-200 font-sans text-xs font-bold uppercase">THE UNFILTERED ENGINEER CLI (bash)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-[10px] text-sky-400 font-mono">TLS 1.3 SECURE</span>
            <button onClick={onClose} className="p-1 rounded hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-slate-300">
          {history.map((item, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
              {item.type === 'system' && (
                <span className="text-slate-400">{item.text}</span>
              )}
              {item.type === 'user' && (
                <span className="text-sky-300 font-semibold">{item.text}</span>
              )}
              {item.type === 'output' && (
                <span className="text-emerald-300">{item.text}</span>
              )}
              {item.type === 'error' && (
                <span className="text-red-400">{item.text}</span>
              )}
            </div>
          ))}
          <div ref={scrollBottomRef} />
        </div>

        {/* Terminal Input Bar */}
        <div className="p-3 bg-obsidian-900/90 border-t border-slate-800 flex items-center gap-2">
          <span className="text-sky-400 font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            placeholder="Type 'help', 'services', 'squads', 'whatsapp', 'telegram'..."
            className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-600"
          />
          <button
            onClick={() => handleCommand({ key: 'Enter' })}
            className="px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded text-[11px] hover:bg-sky-500/30"
          >
            Enter ↵
          </button>
        </div>

      </div>
    </div>
  );
}
