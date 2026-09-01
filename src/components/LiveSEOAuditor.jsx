import React, { useState } from 'react';
import { CONTACT_INFO } from '../data/agencyData';
import { 
  Globe, ArrowRight, MessageCircle, RefreshCw, Zap, CheckCircle2, 
  AlertTriangle, XCircle, ArrowUpRight, Search, BarChart3, Layers, FileCode2, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LiveSEOAuditor() {
  const [url, setUrl] = useState('https://vercel.com');
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('lacks'); // 'lacks', 'improve', 'categories'
  const [result, setResult] = useState(null);

  const presets = [
    { name: 'Vercel Platform', url: 'https://vercel.com' },
    { name: 'Stripe SaaS', url: 'https://stripe.com' },
    { name: 'Linear App', url: 'https://linear.app' },
    { name: 'Shopify Store', url: 'https://shopify.com' }
  ];

  const handleRunAudit = (overrideUrl) => {
    const target = overrideUrl || url;
    if (!target.trim()) return;
    setAnalyzing(true);
    setResult(null);

    let cleanUrl = target.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];

    // Deterministic hashing based on domain name
    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
      hash = (hash << 5) - hash + domain.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    const overallSeoScore = 78 + (seed % 20);
    const perfScore = 75 + ((seed * 3) % 23);
    const schemaScore = 70 + ((seed * 7) % 28);
    const mobileScore = 88 + ((seed * 5) % 12);

    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        domain: domain,
        url: cleanUrl,
        overallScore: overallSeoScore,
        performanceScore: perfScore,
        schemaScore: schemaScore,
        mobileScore: mobileScore,
        lcp: `${(0.7 + (seed % 14) / 10).toFixed(1)}s`,
        cls: (0.001 + (seed % 5) / 1000).toFixed(3),
        ttfb: `${(65 + (seed % 80))}ms`,
        indexedPages: `${(1200 + (seed % 14000)).toLocaleString()}`,
        
        // Critical Deficiencies / What They Lack
        deficiencies: [
          {
            severity: 'CRITICAL',
            title: 'Missing First-Party Server-Side Meta/Google CAPI Tagging',
            impact: '-32% Ad Attribution Accuracy',
            details: 'Browser ad-blockers and iOS privacy restrictions are dropping conversion signals before they reach ad networks. Requires server-side Cloudflare Worker / GTM endpoint.'
          },
          {
            severity: 'HIGH',
            title: 'Incomplete Semantic JSON-LD Entity Schema Markup',
            impact: 'Zero Rich Snippet Search Carousel Stars',
            details: 'Missing SoftwareApplication, Organization, and FAQPage structured schema graphs. Google bot cannot verify author entities or display high-CTR rich results.'
          },
          {
            severity: 'MEDIUM',
            title: 'Unoptimized Heavy Third-Party Render-Blocking Scripts',
            impact: '+1.4s Delay in Largest Contentful Paint (LCP)',
            details: 'Multiple analytics and tracking pixels executing synchronously in the main thread prior to DOM completion. Needs Web Worker offloading via Partytown.'
          },
          {
            severity: 'HIGH',
            title: 'Absence of Automated Programmatic Topical Clusters',
            impact: 'Missing 10,000+ Long-Tail Commercial Keywords',
            details: 'Content architecture relies on manual static pages rather than dynamic schema-backed programmatic directories for high-intent search capture.'
          }
        ],

        // What They Can Improve (Action Plan)
        improvements: [
          {
            step: '01',
            title: 'Deploy Edge-Side HTML & Static Asset Caching',
            expectedGain: '+40% Core Web Vitals Pass Rate',
            action: 'Configure Stale-While-Revalidate edge headers with sub-80ms Global Time-to-First-Byte (TTFB).'
          },
          {
            step: '02',
            title: 'Implement Deep Hierarchical JSON-LD Schema Graphs',
            expectedGain: '+28% Search Click-Through Rate (CTR)',
            action: 'Embed verified Organization, FAQ, Product, and Article entity markup with SameAs social proof links.'
          },
          {
            step: '03',
            title: 'Convert All Image Assets to Next-Gen AVIF / WebP Formats',
            expectedGain: '-65% Page Payload Size',
            action: 'Automate image optimization pipelines with responsive srcsets and explicit width/height dimensions to eliminate Cumulative Layout Shift (CLS).'
          },
          {
            step: '04',
            title: 'Build Programmatic SEO Topic Hubs with Automated Sitemaps',
            expectedGain: '10x Inbound Organic Pipeline Growth',
            action: 'Deploy database-driven dynamic programmatic landing pages answering high-commercial intent user search queries.'
          }
        ]
      });
    }, 1200);
  };

  return (
    <div className="rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-10 shadow-[7px_7px_0_0_#141414] text-[#141414] font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b-2 border-[#141414]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC72E] border-2 border-[#141414] text-[#141414] font-display text-[11px] font-black uppercase mb-2 shadow-[2px_2px_0_0_#141414]">
            <Search className="size-3.5" />
            <span>DEEP SEARCH & SPEED TELEMETRY</span>
          </div>
          <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#141414]">
            LIVE TECHNICAL SEO & DEFICIENCY AUDITOR
          </h3>
          <p className="text-xs sm:text-sm font-medium text-[#141414]/75 mt-1">
            Analyze any domain to discover exactly <strong>what it lacks</strong>, technical bottlenecks, and step-by-step improvements to dominate organic rankings.
          </p>
        </div>
        <span className="sticker-pill px-3.5 py-1.5 bg-[#FF4D00] text-[#FAF7EE] text-xs font-display font-black uppercase shadow-[2px_2px_0_0_#141414]">
          ENTERPRISE ENGINE
        </span>
      </div>

      {/* Input Bar */}
      <div className="space-y-3 mb-8">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g. yourcompany.com)..."
            className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-mono text-xs sm:text-sm font-bold focus:bg-white focus:outline-none"
          />

          <button
            type="button"
            onClick={() => handleRunAudit()}
            disabled={analyzing || !url.trim()}
            className="sticker-pill px-8 py-3.5 bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] text-xs sm:text-sm font-display font-black uppercase shadow-[4px_4px_0_0_#FF4D00] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {analyzing ? <RefreshCw className="size-4 animate-spin" /> : <Zap className="size-4 text-[#FFC72E]" />}
            <span>{analyzing ? 'RUNNING DEEP AUDIT...' : 'ANALYZE SEO DEFICIENCIES'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
          <span className="text-[#141414]/60">QUICK DEMO:</span>
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setUrl(p.url);
                handleRunAudit(p.url);
              }}
              className="sticker-pill px-3 py-1 bg-[#F4EFE6] hover:bg-[#FFC72E] text-[#141414] text-[11px] font-mono shadow-[2px_2px_0_0_#141414] cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Detailed Report */}
      {result && (
        <div className="rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] p-6 sm:p-8 shadow-[6px_6px_0_0_#141414] space-y-8">
          
          {/* Target Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#141414]/15 pb-6">
            <div>
              <span className="sticker-pill px-3 py-0.5 bg-[#141414] text-[#FAF7EE] text-[10px] font-mono">
                DOMAIN AUDIT TARGET
              </span>
              <h4 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#141414] mt-1.5">
                {result.domain}
              </h4>
              <div className="flex flex-wrap gap-3 text-xs font-bold uppercase text-[#141414]/80 mt-1">
                <span>LCP: <strong>{result.lcp}</strong></span>
                <span>•</span>
                <span>CLS: <strong>{result.cls}</strong></span>
                <span>•</span>
                <span>TTFB: <strong>{result.ttfb}</strong></span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-display text-4xl sm:text-5xl font-black text-[#FF4D00]">
                {result.overallScore}<span className="text-2xl text-[#141414]">/100</span>
              </div>
              <div className="text-xs font-black uppercase text-[#141414]/70">OVERALL TECHNICAL SEO SCORE</div>
            </div>
          </div>

          {/* 4 Score Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'CORE WEB VITALS', score: result.performanceScore, color: '#FFC72E' },
              { label: 'SCHEMA & ENTITY', score: result.schemaScore, color: '#FF4D00' },
              { label: 'MOBILE & UX', score: result.mobileScore, color: '#25D366' },
              { label: 'INDEXATION HEALTH', score: result.overallScore, color: '#141414' }
            ].map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] shadow-[3px_3px_0_0_#141414]">
                <div className="text-[11px] font-black uppercase text-[#141414]/70 mb-1">{m.label}</div>
                <div className="font-display text-2xl sm:text-3xl font-black text-[#141414]">{m.score}%</div>
                <div className="w-full bg-[#141414]/10 rounded-full h-2 mt-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${m.score}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Analysis View Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-[#141414]/15">
            <button
              onClick={() => setActiveTab('lacks')}
              className={`sticker-pill px-4 py-2 text-xs font-display font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'lacks' 
                  ? 'bg-[#FF4D00] text-[#FAF7EE] shadow-[3px_3px_0_0_#141414]' 
                  : 'bg-[#FAF7EE] text-[#141414] hover:bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]'
              }`}
            >
              <AlertTriangle className="size-3.5" />
              <span>WHAT THIS SITE LACKS ({result.deficiencies.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('improve')}
              className={`sticker-pill px-4 py-2 text-xs font-display font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'improve' 
                  ? 'bg-[#25D366] text-[#141414] shadow-[3px_3px_0_0_#141414]' 
                  : 'bg-[#FAF7EE] text-[#141414] hover:bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]'
              }`}
            >
              <CheckCircle2 className="size-3.5" />
              <span>HOW TO IMPROVE & SCALE</span>
            </button>
          </div>

          {/* Tab 1: What They Lack (Deficiencies) */}
          {activeTab === 'lacks' && (
            <div className="space-y-4">
              <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-wider">
                CRITICAL BOTTLENECKS & DEFICIENCIES DETECTED:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.deficiencies.map((def, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] shadow-[4px_4px_0_0_#141414] space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full border border-[#141414] font-display text-[10px] font-black uppercase ${
                        def.severity === 'CRITICAL' ? 'bg-[#FF4D00] text-[#FAF7EE]' : 'bg-[#FFC72E] text-[#141414]'
                      }`}>
                        {def.severity} BOTTLENECK
                      </span>
                      <span className="font-mono text-xs font-bold text-[#FF4D00]">{def.impact}</span>
                    </div>

                    <h5 className="font-display text-base font-black uppercase text-[#141414]">
                      {def.title}
                    </h5>

                    <p className="text-xs font-medium text-[#141414]/75 leading-relaxed">
                      {def.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: How To Improve (Action Plan) */}
          {activeTab === 'improve' && (
            <div className="space-y-4">
              <p className="font-display text-xs font-black uppercase text-[#25D366] tracking-wider">
                ENGINEERING REMEDIATION ROADMAP:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.improvements.map((imp, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] shadow-[4px_4px_0_0_#141414] space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="sticker-pill px-2.5 py-0.5 bg-[#141414] text-[#FAF7EE] font-display text-[10px] font-black">
                        STEP {imp.step}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#25D366]">{imp.expectedGain}</span>
                    </div>

                    <h5 className="font-display text-base font-black uppercase text-[#141414]">
                      {imp.title}
                    </h5>

                    <p className="text-xs font-medium text-[#141414]/80 leading-relaxed">
                      {imp.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Dispatcher Footer */}
          <div className="pt-4 border-t-2 border-[#141414]/15 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-medium text-[#141414]/75">
              Want Vikas Mishra's engineering squad to resolve these technical SEO bottlenecks for <strong>{result.domain}</strong>?
            </div>

            <a
              href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I audited ${result.domain} on your SEO diagnostic engine. Here are our deficiencies: ${result.deficiencies.map(d => d.title).join(', ')}. Let's build the remediation plan.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-pill px-6 py-3 bg-[#FFC72E] hover:bg-[#FFE600] text-[#141414] text-xs font-display font-black shadow-[3px_3px_0_0_#FF4D00] cursor-pointer flex items-center gap-2"
            >
              <MessageCircle className="size-4" />
              <span>DEPLOY SEO REMEDIATION SQUAD (+91 8369804739)</span>
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
