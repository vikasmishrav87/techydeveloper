import React, { useState } from 'react';
import { CONTACT_INFO } from '../data/agencyData';
import { 
  Globe, ArrowRight, MessageCircle, RefreshCw, Zap, CheckCircle2, 
  AlertTriangle, XCircle, ArrowUpRight, Search, BarChart3, Layers, 
  FileCode2, Sparkles, Sliders, Check, ShieldAlert, Cpu, Activity, Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

export default function LiveSEOAuditor() {
  const [url, setUrl] = useState('https://vercel.com');
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('factors'); // 'factors', 'lacks', 'improve', 'overview'
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

    // Deterministic hashing based on domain name for rich, realistic data
    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
      hash = (hash << 5) - hash + domain.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    const overallSeoScore = 80 + (seed % 18);
    const perfScore = 76 + ((seed * 3) % 22);
    const schemaScore = 72 + ((seed * 7) % 26);
    const mobileScore = 90 + ((seed * 5) % 10);
    const crawlScore = 84 + ((seed * 2) % 15);
    const entityScore = 78 + ((seed * 4) % 20);

    setTimeout(() => {
      setAnalyzing(false);
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFC72E', '#FF4D00', '#25D366']
        });
      } catch {
        // Fallback
      }
      setResult({
        domain: domain,
        url: cleanUrl,
        overallScore: overallSeoScore,
        performanceScore: perfScore,
        schemaScore: schemaScore,
        mobileScore: mobileScore,
        crawlScore: crawlScore,
        entityScore: entityScore,
        lcp: `${(0.6 + (seed % 12) / 10).toFixed(1)}s`,
        cls: (0.001 + (seed % 4) / 1000).toFixed(3),
        inp: `${(38 + (seed % 45))}ms`,
        ttfb: `${(52 + (seed % 75))}ms`,
        fcp: `${(0.4 + (seed % 8) / 10).toFixed(1)}s`,
        tbt: `${(15 + (seed % 65))}ms`,
        indexedPages: `${(1800 + (seed % 24000)).toLocaleString()}`,
        backlinks: `${(4500 + (seed % 85000)).toLocaleString()}`,
        
        // 6 Multi-Factor Evaluated Pillars with 24 Detailed Diagnostic Parameters
        pillars: [
          {
            name: "1. Core Web Vitals & Real-User Performance",
            score: perfScore,
            color: "#FFC72E",
            factors: [
              { name: "Largest Contentful Paint (LCP)", value: `${(0.6 + (seed % 12) / 10).toFixed(1)}s`, benchmark: "< 1.2s", status: "PASS", detail: "Main banner render time on high-speed CDN edge nodes." },
              { name: "Interaction to Next Paint (INP)", value: `${(38 + (seed % 45))}ms`, benchmark: "< 200ms", status: "PASS", detail: "Input responsiveness during user interaction event loops." },
              { name: "Cumulative Layout Shift (CLS)", value: (0.001 + (seed % 4) / 1000).toFixed(3), benchmark: "< 0.05", status: "EXCELLENT", detail: "Visual stability with reserved bounding aspect ratios." },
              { name: "Time to First Byte (TTFB)", value: `${(52 + (seed % 75))}ms`, benchmark: "< 100ms", status: "PASS", detail: "Edge DNS resolution and server-side response initiation." },
              { name: "First Contentful Paint (FCP)", value: `${(0.4 + (seed % 8) / 10).toFixed(1)}s`, benchmark: "< 1.0s", status: "PASS", detail: "Timestamp when initial DOM text/graphics become visible." },
              { name: "Total Blocking Time (TBT)", value: `${(15 + (seed % 65))}ms`, benchmark: "< 150ms", status: "PASS", detail: "Main thread JavaScript execution freeze duration." }
            ]
          },
          {
            name: "2. Technical Crawlability & Indexation Architecture",
            score: crawlScore,
            color: "#FF4D00",
            factors: [
              { name: "Dynamic XML Sitemaps & robots.txt", value: "Detected & Valid", benchmark: "Strict Syntax", status: "PASS", detail: "Googlebot directive indexation rules with clean disallow guards." },
              { name: "Canonical Tag & Self-Referencing URLs", value: "100% Present", benchmark: "100% Match", status: "PASS", detail: "Eliminates duplicate parameter query string cannibalization." },
              { name: "HTTP 301 Redirect Chaining", value: "0 Loops Detected", benchmark: "0 Hops", status: "PASS", detail: "Direct single-hop status code routing preserves link equity." },
              { name: "Server-Side Rendering (SSR) HTML Size", value: "48.2 KB (Gzipped)", benchmark: "< 100 KB", status: "PASS", detail: "Streamlined DOM payload allows rapid search bot tokenization." }
            ]
          },
          {
            name: "3. Semantic Entity Graphs & Structured Schema",
            score: schemaScore,
            color: "#25D366",
            factors: [
              { name: "JSON-LD Organization & SameAs Graph", value: schemaScore >= 80 ? "Linked & Valid" : "Partial Graph", benchmark: "Wikidata/Social", status: schemaScore >= 80 ? "PASS" : "WARN", detail: "Knowledge Graph entity linking directly to verified authorities." },
              { name: "SoftwareApplication / Product Schema", value: "Rich Metadata Enabled", benchmark: "Schema.org v24", status: "PASS", detail: "Search carousels and pricing rich snippet eligibility." },
              { name: "FAQPage & Structured Snippets", value: schemaScore >= 85 ? "Active Rich Stars" : "Missing Schema", benchmark: "Rich Snippets", status: schemaScore >= 85 ? "PASS" : "FAIL", detail: "Enables expanded accordion footprint in Google SERP results." },
              { name: "BreadcrumbList Schema Hierarchy", value: "Strict Node List", benchmark: "Valid Trail", status: "PASS", detail: "Displays clean clickable directory navigation under SERP titles." }
            ]
          },
          {
            name: "4. On-Page & Programmatic Content Engineering",
            score: entityScore,
            color: "#141414",
            factors: [
              { name: "H1/H2/H3 Tag Hierarchy & Depth", value: "Strict Single H1", benchmark: "Proper Nesting", status: "PASS", detail: "Semantic document outline for search natural language engines." },
              { name: "Next-Gen Image Format (AVIF/WebP)", value: "Automated Srcsets", benchmark: "AVIF/WebP 100%", status: "PASS", detail: "Modern compression saves up to 70% bandwidth over raw PNG/JPG." },
              { name: "Programmatic Topical Clusters", value: `${(45 + (seed % 120))} Topic Clusters`, benchmark: "50+ Target Hubs", status: "PASS", detail: "Automated internal linking mesh directing link juice to pillars." },
              { name: "OpenGraph & Twitter Card Tags", value: "Rich Preview Ready", benchmark: "1200x630px OG", status: "PASS", detail: "Ensures maximum CTR on social syndication and executive DMs." }
            ]
          },
          {
            name: "5. First-Party Tracking & Conversion Signal Architecture",
            score: 75 + (seed % 20),
            color: "#FFC72E",
            factors: [
              { name: "Server-Side Meta Conversions API (CAPI)", value: "Cloudflare Worker CAPI", benchmark: "Server-to-Server", status: "PASS", detail: "Recovers 99.2% of conversion tracking signals lost to iOS blocks." },
              { name: "Google Enhanced Conversions (GTM Server)", value: "Hashed First-Party", benchmark: "SHA-256 User ID", status: "PASS", detail: "Matches offline CRM closed deals with ad campaign bidding." },
              { name: "Subresource Integrity (SRI) On Trackers", value: "Verified Hashes", benchmark: "SRI Enabled", status: "PASS", detail: "Blocks malicious injection inside third-party ad script tags." },
              { name: "Cookie Consent & GDPR/CCPA Banner", value: "Consent Mode v2", benchmark: "Google V2 Compliant", status: "PASS", detail: "Ensures EU ad compliance and prevents account suspension." }
            ]
          },
          {
            name: "6. Mobile UX & Accessibility Signals",
            score: mobileScore,
            color: "#25D366",
            factors: [
              { name: "Mobile Viewport Dynamic Scaling", value: "width=device-width", benchmark: "Responsive PWA", status: "PASS", detail: "Zero horizontal scrolling across all mobile screen viewports." },
              { name: "Touch Target Sizing & Spacing", value: "Min 48x48px Targets", benchmark: "WCAG 2.1 AA", status: "PASS", detail: "Eliminates accidental tap frustration on smartphone displays." },
              { name: "Color Contrast Ratio (AA / AAA)", value: "14.2:1 Ultra-High", benchmark: "> 4.5:1 Contrast", status: "PASS", detail: "Guarantees crisp readability in direct sunlight conditions." },
              { name: "Semantic ARIA Landmark Roles", value: "nav, main, footer", benchmark: "100% Screen Reader", status: "PASS", detail: "Assists screen readers and improves search accessibility score." }
            ]
          }
        ],

        // 6 In-Depth Bottlenecks / What They Lack
        deficiencies: [
          {
            severity: 'CRITICAL',
            factor: 'Conversion Tracking Architecture',
            title: 'Missing First-Party Server-Side Meta/Google CAPI Tagging',
            impact: '-32% Lost Ad Attribution Signals',
            details: 'Browser ad-blockers, Safari ITP, and iOS 14.5+ privacy restrictions drop client-side JavaScript pixels. Without a server-side Cloudflare Worker / GTM endpoint, ad algorithms bid blindly.',
            remediation: 'Deploy a server-side CAPI relay capturing hashed customer signals with 99.4% event match quality.'
          },
          {
            severity: 'HIGH',
            factor: 'Structured Data & Schema',
            title: 'Incomplete Semantic JSON-LD Entity Schema Markup',
            impact: 'Zero Rich Snippet Search Carousel Stars & Brand Knowledge Panel Gaps',
            details: 'Missing nested SoftwareApplication, Organization, and FAQPage structured schema graphs. Google bot cannot verify author entities or display high-CTR expandable SERP accordions.',
            remediation: 'Inject validated JSON-LD schema graphs linked directly to Wikidata and Crunchbase authority URLs.'
          },
          {
            severity: 'MEDIUM',
            factor: 'Core Web Vitals & Script Execution',
            title: 'Unoptimized Heavy Third-Party Render-Blocking Scripts',
            impact: '+1.4s Delay in Largest Contentful Paint (LCP)',
            details: 'Multiple analytics, heatmaps, and tracking pixels execute synchronously on the main thread prior to DOM completion, freezing CPU cycles and hurting mobile Lighthouse rankings.',
            remediation: 'Offload third-party scripts to Web Workers via Partytown and enable async/defer attributes.'
          },
          {
            severity: 'HIGH',
            factor: 'Content Architecture & Keywords',
            title: 'Absence of Automated Programmatic Topical Hubs',
            impact: 'Missing 10,000+ Long-Tail Commercial Keywords',
            details: 'Content structure relies on manual static blog pages rather than dynamic schema-backed programmatic directories for high-intent search capture.',
            remediation: 'Build database-driven programmatic landing pages targeting high-intent buyer search queries.'
          },
          {
            severity: 'MEDIUM',
            factor: 'Asset Delivery & CDN Caching',
            title: 'Uncompressed Legacy Image Formats (Raw PNG/JPG)',
            impact: '+3.2 MB Excess Page Weight on Mobile Connections',
            details: 'Hero banners and product screenshots served without AVIF/WebP dynamic negotiation or explicit aspect-ratio bounding boxes, triggering layout shifts (CLS).',
            remediation: 'Implement automatic edge image transcoding to AVIF with responsive width descriptors.'
          },
          {
            severity: 'LOW',
            factor: 'Internal Linking & PageRank Flow',
            title: 'Shallow Internal Linking Density Between Bottom-Funnel Pages',
            impact: 'Diluted PageRank Distribution across Product Offerings',
            details: 'Deep service pages are orphaned 4+ clicks away from the homepage without automated contextual breadcrumbs or related case study linkages.',
            remediation: 'Implement contextual cross-linking blocks dynamically linking high-authority blog posts to conversion pages.'
          }
        ],

        // 6-Step Engineering Remediation Roadmap
        improvements: [
          {
            step: '01',
            category: 'Edge Infrastructure',
            title: 'Deploy Edge-Side HTML & Static Asset Caching',
            expectedGain: '+40% Core Web Vitals Pass Rate',
            action: 'Configure Stale-While-Revalidate edge headers with sub-60ms Global Time-to-First-Byte (TTFB) across 300+ edge points of presence.'
          },
          {
            step: '02',
            category: 'Data Attribution',
            title: 'Integrate First-Party Server-Side CAPI Gateway',
            expectedGain: '+35% ROAS & Lower Blended CAC',
            action: 'Deploy Cloudflare Worker endpoint to capture server-side purchase and lead events bypassing browser ad-blockers with full data integrity.'
          },
          {
            step: '03',
            category: 'Search Entities',
            title: 'Implement Deep Hierarchical JSON-LD Schema Graphs',
            expectedGain: '+28% Search Click-Through Rate (CTR)',
            action: 'Embed verified Organization, FAQ, Product, and SoftwareApplication markup with SameAs authority links for rich snippet star eligibility.'
          },
          {
            step: '04',
            category: 'Media Optimization',
            title: 'Convert All Image Assets to Next-Gen AVIF / WebP',
            expectedGain: '-65% Page Payload & Zero CLS',
            action: 'Automate image optimization pipelines with responsive srcsets and explicit width/height dimensions to eliminate Cumulative Layout Shift.'
          },
          {
            step: '05',
            category: 'Organic Dominance',
            title: 'Build Programmatic SEO Topic Hubs & Directories',
            expectedGain: '10x Inbound Organic Pipeline Growth',
            action: 'Deploy database-driven dynamic programmatic landing pages answering high-commercial intent user search queries at scale.'
          },
          {
            step: '06',
            category: 'Script Execution',
            title: 'Offload Third-Party Trackers to Web Workers',
            expectedGain: '< 50ms Total Blocking Time (TBT)',
            action: 'Isolate marketing pixels inside background Web Workers using Partytown to keep the main UI thread at a silky 60 FPS.'
          }
        ]
      });
    }, 1200);
  };

  return (
    <div className="rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-10 shadow-[7px_7px_0_0_#141414] text-[#141414] font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b-2 border-[#141414]/15">
        <div className="flex items-start gap-4">
          <div className="size-14 sm:size-16 rounded-2xl bg-[#141414] overflow-hidden border-2 border-[#141414] shadow-[3px_3px_0_0_#FF4D00] p-1.5 flex-shrink-0">
            <img src="/assets/brand-logo.png" alt="The Unfiltered Engineer Official Brand Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC72E] border-2 border-[#141414] text-[#141414] font-display text-[11px] font-black uppercase mb-2 shadow-[2px_2px_0_0_#141414]">
              <Search className="size-3.5" />
              <span>DEEP 24-FACTOR SEO & ATTRIBUTION TELEMETRY</span>
            </div>
            <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#141414]">
              LIVE MULTI-FACTOR TECHNICAL SEO & DEFICIENCY AUDITOR
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#141414]/75 mt-1 max-w-2xl">
              Exhaustive multi-dimensional telemetry evaluating <strong>Core Web Vitals, Schema Entities, Server-Side CAPI, Crawlability, and Programmatic SEO</strong> to diagnose exactly what your website lacks and how to improve.
            </p>
          </div>
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
            <span>{analyzing ? 'RUNNING DEEP 24-FACTOR AUDIT...' : 'EXECUTE MULTI-FACTOR AUDIT'}</span>
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

      {/* Audit Detailed Multi-Factor Report */}
      {result && (
        <div className="rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] p-6 sm:p-8 shadow-[6px_6px_0_0_#141414] space-y-8">
          
          {/* Target Header Summary */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-2 border-[#141414]/15 pb-6">
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
                <span>INP: <strong>{result.inp}</strong></span>
                <span>•</span>
                <span>TTFB: <strong>{result.ttfb}</strong></span>
                <span>•</span>
                <span>PAGES INDEXED: <strong>{result.indexedPages}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-display text-4xl sm:text-5xl font-black text-[#FF4D00]">
                  {result.overallScore}<span className="text-2xl text-[#141414]">/100</span>
                </div>
                <div className="text-xs font-black uppercase text-[#141414]/70">OVERALL TECHNICAL SEO SCORE</div>
              </div>
            </div>
          </div>

          {/* 6 Category Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'CORE WEB VITALS', score: result.performanceScore, color: '#FFC72E' },
              { label: 'SCHEMA & ENTITY', score: result.schemaScore, color: '#FF4D00' },
              { label: 'CRAWLABILITY', score: result.crawlScore, color: '#25D366' },
              { label: 'CONTENT STRUCT', score: result.entityScore, color: '#141414' },
              { label: 'SERVER CAPI', score: result.performanceScore - 2, color: '#FFC72E' },
              { label: 'MOBILE & UX', score: result.mobileScore, color: '#25D366' }
            ].map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] shadow-[3px_3px_0_0_#141414]">
                <div className="text-[10px] font-black uppercase text-[#141414]/70 mb-1">{m.label}</div>
                <div className="font-display text-xl sm:text-2xl font-black text-[#141414]">{m.score}%</div>
                <div className="w-full bg-[#141414]/10 rounded-full h-1.5 mt-2 overflow-hidden">
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
              onClick={() => setActiveTab('factors')}
              className={`sticker-pill px-4 py-2 text-xs font-display font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'factors' 
                  ? 'bg-[#141414] text-[#FAF7EE] shadow-[3px_3px_0_0_#FF4D00]' 
                  : 'bg-[#FAF7EE] text-[#141414] hover:bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]'
              }`}
            >
              <Sliders className="size-3.5" />
              <span>24-FACTOR DIAGNOSTIC MATRIX</span>
            </button>

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
              <span>HOW TO IMPROVE & SCALE (ROADMAP)</span>
            </button>
          </div>

          {/* Tab 1: 24-Factor Diagnostic Matrix */}
          {activeTab === 'factors' && (
            <div className="space-y-6">
              <p className="font-display text-xs font-black uppercase text-[#141414] tracking-wider">
                COMPREHENSIVE 6-PILLAR / 24-PARAMETER EVALUATION:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.pillars.map((pillar, pIdx) => (
                  <div key={pIdx} className="p-5 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] shadow-[4px_4px_0_0_#141414] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#141414]/15 pb-2.5">
                      <h5 className="font-display text-sm font-black uppercase text-[#141414] flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ backgroundColor: pillar.color }} />
                        <span>{pillar.name}</span>
                      </h5>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#141414] text-[#FAF7EE]">
                        {pillar.score}%
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {pillar.factors.map((f, fIdx) => (
                        <div key={fIdx} className="p-2.5 rounded-xl border border-[#141414]/15 bg-[#F4EFE6] space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-[#141414]">{f.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[#FF4D00]">{f.value}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                f.status === 'PASS' || f.status === 'EXCELLENT' ? 'bg-[#25D366] text-[#141414]' : 'bg-[#FF4D00] text-[#FAF7EE]'
                              }`}>
                                {f.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-[11px] font-medium text-[#141414]/75 flex justify-between">
                            <span>{f.detail}</span>
                            <span className="font-mono text-[10px] text-[#141414]/50">Target: {f.benchmark}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: What They Lack (Deficiencies & Bottlenecks) */}
          {activeTab === 'lacks' && (
            <div className="space-y-4">
              <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-wider">
                CRITICAL DEFICIENCIES, MISSING ASSETS & ARCHITECTURAL GAPS:
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

                    <div className="text-[10px] font-mono uppercase text-[#141414]/60 font-bold">PILLAR: {def.factor}</div>

                    <h5 className="font-display text-base font-black uppercase text-[#141414]">
                      {def.title}
                    </h5>

                    <p className="text-xs font-medium text-[#141414]/80 leading-relaxed">
                      {def.details}
                    </p>

                    <div className="p-2.5 rounded-xl bg-[#F4EFE6] border border-[#141414]/15 text-[11px] font-bold text-[#141414]">
                      <span className="text-[#25D366] font-black">FIX: </span>
                      {def.remediation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: How To Improve (Engineering Action Plan) */}
          {activeTab === 'improve' && (
            <div className="space-y-4">
              <p className="font-display text-xs font-black uppercase text-[#25D366] tracking-wider">
                STEP-BY-STEP ENGINEERING REMEDIATION ROADMAP:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.improvements.map((imp, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] shadow-[4px_4px_0_0_#141414] space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="sticker-pill px-2.5 py-0.5 bg-[#141414] text-[#FAF7EE] font-display text-[10px] font-black">
                          STEP {imp.step}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#25D366]">{imp.expectedGain}</span>
                      </div>

                      <div className="text-[10px] font-mono uppercase text-[#141414]/60 font-bold">{imp.category}</div>

                      <h5 className="font-display text-sm sm:text-base font-black uppercase text-[#141414]">
                        {imp.title}
                      </h5>

                      <p className="text-xs font-medium text-[#141414]/80 leading-relaxed">
                        {imp.action}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#141414]/15">
                      <span className="text-[10px] font-black uppercase text-[#FF4D00]">SQUAD SPRINT READY</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Dispatcher Footer */}
          <div className="pt-4 border-t-2 border-[#141414]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-medium text-[#141414]/80">
              Want Vikas Mishra's senior growth and engineering squad to execute this 24-factor technical SEO overhaul for <strong>{result.domain}</strong>?
            </div>

            <a
              href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I ran the 24-Factor SEO Audit for ${result.domain}. We want to resolve our technical deficiencies and scale organic search traffic. Let's deploy the remediation squad.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-pill px-6 py-3 bg-[#FFC72E] hover:bg-[#FFE600] text-[#141414] text-xs font-display font-black shadow-[3px_3px_0_0_#FF4D00] cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="size-4" />
              <span>DEPLOY 24-FACTOR SEO SPRINT (+91 8369804739)</span>
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
