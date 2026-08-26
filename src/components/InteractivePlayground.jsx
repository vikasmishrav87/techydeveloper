import React, { useState } from 'react';
import { 
  Cpu, 
  Coins, 
  Globe, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  Zap, 
  Terminal, 
  Sliders,
  RefreshCw
} from 'lucide-react';

export default function InteractivePlayground() {
  const [activeDemo, setActiveDemo] = useState('ai');
  
  // AI Agent Simulator State
  const [agentStep, setAgentStep] = useState(0);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentLogs, setAgentLogs] = useState([
    { agent: "SYSTEM", text: "Ready. Click 'Execute Agent Swarm' to simulate live multi-agent task execution." }
  ]);

  // Blockchain Gas Simulator State
  const [contractOptimization, setContractOptimization] = useState('optimized'); // 'unoptimized', 'optimized'

  // Web Speed Simulator State
  const [edgeCaching, setEdgeCaching] = useState(true);
  const [compression, setCompression] = useState(true);

  const runAgentSwarm = () => {
    setIsAgentRunning(true);
    setAgentStep(1);
    setAgentLogs([{ agent: "SYSTEM", text: "Initiating Autonomous Multi-Agent Pipeline for Enterprise Task..." }]);

    const workflow = [
      { step: 1, agent: "PLANNER_AGENT", text: "Decomposed prompt into 3 sub-tasks: [1] Schema Validation, [2] Vector Retrieval, [3] Synthesis." },
      { step: 2, agent: "RAG_RETRIEVER", text: "Queried Qdrant vector index. Retrieved 6 dense chunk embeddings in 14ms (Cosine Similarity: 0.942)." },
      { step: 3, agent: "SECURITY_GUARD", text: "Checked prompt injection & PII leakage. Output cleared with 0 violations." },
      { step: 4, agent: "SYNTHESIS_MODEL", text: "Generated typed response with formal verification proof. Token throughput: 142 tokens/sec." },
      { step: 5, agent: "SYSTEM", text: "Pipeline finished in 420ms total latency. Ready for production deployment." }
    ];

    workflow.forEach((item, index) => {
      setTimeout(() => {
        setAgentStep(item.step);
        setAgentLogs(prev => [...prev, item]);
        if (index === workflow.length - 1) {
          setIsAgentRunning(false);
        }
      }, (index + 1) * 700);
    });
  };

  return (
    <section className="py-24 bg-dark-950 border-t border-dark-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[350px] bg-bronze-600/5 blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-dark-850 border border-bronze-500/30 text-bronze-400 text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>[INTERACTIVE_ENGINEERING_PLAYGROUND]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            See Our Engineering <br />
            <span className="bronze-gradient-text">In Real-Time Execution.</span>
          </h2>
          <p className="mt-4 text-titanium-400 text-sm sm:text-base">
            Test our autonomous AI agent pipelines, smart contract gas optimizations, and ultra-low latency full-stack architecture.
          </p>
        </div>

        {/* Playground Container */}
        <div className="rounded-2xl bg-dark-900 border border-dark-750 shadow-2xl overflow-hidden max-w-5xl mx-auto">
          
          {/* Top Toggle Bar */}
          <div className="bg-dark-850 p-4 border-b border-dark-750 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-bronze-500"></span>
              <span className="font-mono text-xs text-white font-bold">SYSTEM PLAYGROUND // LIVE SIMULATOR</span>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-dark-950 border border-dark-800">
              {[
                { id: 'ai', label: 'AI Agent Swarm', icon: Cpu },
                { id: 'blockchain', label: 'Smart Contract Gas', icon: Coins },
                { id: 'web', label: 'Full-Stack Vitals', icon: Globe },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeDemo === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDemo(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      isActive
                        ? 'bg-bronze-500 text-dark-950 font-bold shadow-bronze-sm'
                        : 'text-titanium-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab 1: AI Agent Swarm Simulator */}
          {activeDemo === 'ai' && (
            <div className="p-6 sm:p-8 bg-dark-950 font-mono">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-dark-800">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Autonomous Multi-Agent Enterprise Orchestrator</span>
                    <span className="px-2 py-0.5 rounded bg-bronze-500/20 text-bronze-400 text-[10px]">LangGraph + Qdrant</span>
                  </div>
                  <div className="text-xs text-titanium-400 mt-1">
                    Simulates self-healing retrieval, security inspection & tool execution.
                  </div>
                </div>

                <button
                  onClick={runAgentSwarm}
                  disabled={isAgentRunning}
                  className="px-5 py-2.5 rounded-xl bg-bronze-500 hover:bg-bronze-400 text-dark-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-bronze-sm disabled:opacity-50"
                >
                  {isAgentRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-dark-950" />}
                  <span>{isAgentRunning ? "Agents Reasoning..." : "Execute Agent Swarm"}</span>
                </button>
              </div>

              {/* Agent Swarm Visual Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { title: "1. Planner", desc: "Task Decomposition" },
                  { title: "2. Vector RAG", desc: "Hybrid BM25 + Qdrant" },
                  { title: "3. SecGuard", desc: "Zero-Trust Filter" },
                  { title: "4. Synthesizer", desc: "Streaming SLM 14B" },
                ].map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all ${
                      agentStep >= idx + 1
                        ? 'bg-dark-850 border-bronze-500 text-bronze-300'
                        : 'bg-dark-900 border-dark-800 text-titanium-500'
                    }`}
                  >
                    <div className="text-xs font-bold">{st.title}</div>
                    <div className="text-[10px] text-titanium-400 mt-0.5">{st.desc}</div>
                  </div>
                ))}
              </div>

              {/* Terminal Logs Window */}
              <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 h-52 overflow-y-auto space-y-2 text-xs">
                {agentLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-bronze-400 font-bold shrink-0">[{log.agent}]:</span>
                    <span className="text-titanium-200">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Smart Contract Gas Optimizer */}
          {activeDemo === 'blockchain' && (
            <div className="p-6 sm:p-8 bg-dark-950 font-mono">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-dark-800">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>EVM Smart Contract Bytecode & Gas Optimization</span>
                    <span className="px-2 py-0.5 rounded bg-bronze-500/20 text-bronze-400 text-[10px]">Solidity + Assembly (Yul)</span>
                  </div>
                  <div className="text-xs text-titanium-400 mt-1">
                    Compare unoptimized template code vs. The Unfiltered Engineer's gas-slicing Yul assembly.
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-dark-900 p-1 rounded-xl border border-dark-800">
                  <button
                    onClick={() => setContractOptimization('unoptimized')}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      contractOptimization === 'unoptimized' ? 'bg-dark-800 text-red-400 font-bold' : 'text-titanium-400'
                    }`}
                  >
                    Standard Bloat
                  </button>
                  <button
                    onClick={() => setContractOptimization('optimized')}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      contractOptimization === 'optimized' ? 'bg-bronze-500 text-dark-950 font-bold' : 'text-titanium-400'
                    }`}
                  >
                    Unfiltered Yul Engine
                  </button>
                </div>
              </div>

              {/* Code comparison & telemetry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-dark-900 border border-dark-800">
                  <div className="text-xs font-bold text-titanium-400 mb-2 uppercase">Execution Code Snippet</div>
                  <pre className="text-xs text-titanium-300 leading-relaxed overflow-x-auto">
                    <code>
                      {contractOptimization === 'unoptimized'
                        ? `// Standard OpenZeppelin loop
function batchTransfer(address[] calldata rec, uint256[] calldata amt) external {
    for (uint256 i = 0; i < rec.length; i++) {
        _balances[rec[i]] += amt[i]; // Memory expansion & repeated SLOAD/SSTORE
    }
}`
                        : `// Unfiltered Yul inline assembly
assembly {
    let ptr := add(rec.offset, 0x20)
    let end := add(ptr, mul(rec.length, 0x20))
    for {} lt(ptr, end) { ptr := add(ptr, 0x20) } {
        // Direct storage slot caching + zero memory alloc
        sstore(keccak256(calldataload(ptr), 0x20), calldataload(add(amt.offset, sub(ptr, rec.offset))))
    }
}`}
                    </code>
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-titanium-400 mb-3 uppercase">Gas & Cost Benchmarks</div>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-2 border-b border-dark-800">
                        <span className="text-titanium-400">Gas per 1,000 Transations:</span>
                        <span className={`font-bold ${contractOptimization === 'optimized' ? 'text-bronze-400' : 'text-red-400'}`}>
                          {contractOptimization === 'optimized' ? '21,400 Gas (-76%)' : '89,200 Gas'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dark-800">
                        <span className="text-titanium-400">Reentrancy Risk:</span>
                        <span className="text-white font-bold">
                          {contractOptimization === 'optimized' ? 'Formally Verified 0 Risk' : 'Potential Reentrancy'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-titanium-400">Estimated Annual Gas Saved:</span>
                        <span className="text-bronze-300 font-bold">
                          {contractOptimization === 'optimized' ? '$142,000 USD' : '$0 USD'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-bronze-950/40 border border-bronze-900/50 text-[11px] text-bronze-300 mt-4">
                    ⚡ High-liquidity protocols save hundreds of thousands in gas by auditing and writing assembly-level contracts with us.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Full-Stack Web Vitals Tuner */}
          {activeDemo === 'web' && (
            <div className="p-6 sm:p-8 bg-dark-950 font-mono">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-dark-800">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Full-Stack Web Performance & Edge Acceleration</span>
                    <span className="px-2 py-0.5 rounded bg-bronze-500/20 text-bronze-400 text-[10px]">Next.js 15 + Cloudflare Edge</span>
                  </div>
                  <div className="text-xs text-titanium-400 mt-1">
                    Toggle Edge caching and Brotli compression to see instant Core Web Vitals optimization.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Controls */}
                <div className="space-y-4">
                  <div
                    onClick={() => setEdgeCaching(!edgeCaching)}
                    className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      edgeCaching ? 'bg-dark-850 border-bronze-500' : 'bg-dark-900 border-dark-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">Global Edge Cache (Cloudflare Workers)</div>
                      <div className="text-[11px] text-titanium-400">Routes static & ISR assets to 280+ POPs</div>
                    </div>
                    <div className={`px-2.5 py-1 rounded text-xs font-bold ${
                      edgeCaching ? 'bg-bronze-500 text-dark-950' : 'bg-dark-800 text-titanium-500'
                    }`}>
                      {edgeCaching ? 'ENABLED' : 'DISABLED'}
                    </div>
                  </div>

                  <div
                    onClick={() => setCompression(!compression)}
                    className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      compression ? 'bg-dark-850 border-bronze-500' : 'bg-dark-900 border-dark-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">Zero-Bundle CSS & Tree-Shaking</div>
                      <div className="text-[11px] text-titanium-400">Strips unused JS & compiles critical CSS</div>
                    </div>
                    <div className={`px-2.5 py-1 rounded text-xs font-bold ${
                      compression ? 'bg-bronze-500 text-dark-950' : 'bg-dark-800 text-titanium-500'
                    }`}>
                      {compression ? 'ENABLED' : 'DISABLED'}
                    </div>
                  </div>
                </div>

                {/* Scorecard */}
                <div className="p-5 rounded-xl bg-dark-900 border border-dark-800 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-titanium-400 mb-3 uppercase">Simulated Performance Score</div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`text-4xl font-display font-extrabold ${
                        edgeCaching && compression ? 'text-bronze-400' : 'text-yellow-400'
                      }`}>
                        {edgeCaching && compression ? '100 / 100' : edgeCaching || compression ? '82 / 100' : '54 / 100'}
                      </div>
                      <div className="text-xs text-titanium-400">
                        Lighthouse Score
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-dark-800">
                        <span className="text-titanium-400">TTFB (Time to First Byte):</span>
                        <span className="text-white font-bold">{edgeCaching ? '22ms' : '380ms'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-dark-800">
                        <span className="text-titanium-400">LCP (Largest Contentful Paint):</span>
                        <span className="text-white font-bold">{edgeCaching && compression ? '0.4s' : '2.8s'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-titanium-400">Cumulative Layout Shift (CLS):</span>
                        <span className="text-bronze-300 font-bold">0.00 (Zero Shift)</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
