import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CONTACT_INFO, SERVICE_PILLARS } from '../data/agencyData';
import BrandLogo from './BrandLogo';
import { useAuth } from '../context/AuthContext';
import { 
  Terminal, Shield, ShieldCheck, MessageCircle, Send, Menu, X, Globe, 
  Sparkles, UserCheck, Bot, ChevronDown, ChevronRight, CreditCard, User, 
  LogIn, LogOut, Code, Cpu, Blocks, Cloud, Database, Server, TrendingUp, 
  Award, Layers, ArrowRight, Zap, FileText 
} from 'lucide-react';

export default function Navbar({ onOpenTerminal, onOpenAdmin, onOpenAIChat }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Primary focused desktop navigation links (fits cleanly without crowding)
  const primaryNavLinks = [
    { name: 'Services', to: '/services' },
    { name: '360° Growth', to: '/marketing' },
    { name: 'Security Audit', to: '/security-audit' },
    { name: 'Case Studies', to: '/case-studies' },
    { name: 'Pricing', to: '/pricing' },
  ];

  // Icon resolver for all 9 service pillars
  const getPillarIcon = (id) => {
    switch (id) {
      case 'saas-products': return Cloud;
      case 'cyber-security': return Shield;
      case 'fullstack-web-dev': return Code;
      case 'data-engineering-models': return Database;
      case 'blockchain-web3': return Blocks;
      case 'ai-cognitive': return Cpu;
      case 'ai-agents-workflow': return Bot;
      case 'software-services': return Server;
      case 'digital-marketing-360': return TrendingUp;
      default: return Layers;
    }
  };

  // Full platform directory for the mobile drawer menu ("all things")
  const mobilePlatformThings = [
    { name: 'Home', to: '/', icon: Globe, badge: 'Main' },
    { name: '360° Growth & Tech', to: '/marketing', icon: TrendingUp, badge: 'ROAS' },
    { name: 'Security Audit Scanner', to: '/security-audit', icon: Shield, badge: 'Zero-Trust' },
    { name: 'Project Scope Estimator', to: '/estimator', icon: Sparkles, badge: 'Instant' },
    { name: 'Free SEO & Speed Audit', to: '/seo-audit', icon: Zap, badge: 'Vitals' },
    { name: 'Worldwide 3D Network', to: '/worldwide', icon: Globe, badge: '1,000+' },
    { name: 'Client Case Studies', to: '/case-studies', icon: Award, badge: 'Proof' },
    { name: 'Pricing & Engagements', to: '/pricing', icon: CreditCard, badge: 'Clear' },
    { name: 'Contact & Briefing', to: '/contact', icon: Send, badge: '24h SLA' },
    { name: 'Legal Terms & SLA', to: '/terms', icon: FileText, badge: 'GDPR' },
  ];

  // Secondary tools in clean dropdown
  const extraTools = [
    { name: 'Project Scope Estimator', to: '/estimator', icon: Sparkles, desc: 'Calculate engineering timeline & costs' },
    { name: 'Executive Verification Portal', to: '/admin/verify', icon: ShieldCheck, desc: 'Review & approve client payments (Passkey required)' },
    { name: 'Client Payment & Checkout', to: '/checkout', icon: CreditCard, desc: 'Pay via UPI, SBI Bank Wire, or Web3 USDT' },
    { name: 'Free SEO & Speed Audit', to: '/seo-audit', icon: Sparkles, desc: 'Real-time Core Web Vitals scanner' },
    { name: 'Worldwide 3D Network', to: '/worldwide', icon: Globe, desc: '1,000+ senior engineers worldwide' },
    { name: 'Legal Terms of Service', to: '/terms', icon: Shield, desc: 'GDPR / CCPA enterprise compliance' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b-2 border-[#141414] ${
        scrolled
          ? 'bg-[#FAF7EE]/95 backdrop-blur-md py-3 shadow-[0_4px_0_0_#141414]'
          : 'bg-[#FAF7EE]/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-2 lg:gap-4 xl:gap-6">
        
        {/* Left: Brand Logo (Always flex-shrink-0 so desktop links never overlap) */}
        <div className="flex-shrink-0">
          <BrandLogo size="md" withText={true} linkTo="/" />
        </div>

        {/* Center: Desktop Nav Links (Cleanly spaced for all desktop and laptop resolutions) */}
        <nav className="hidden lg:flex items-center gap-2.5 xl:gap-5 2xl:gap-7 flex-shrink-0">
          {primaryNavLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.name}
                to={link.to}
                className={`font-display text-[11px] xl:text-xs 2xl:text-sm font-bold tracking-wide uppercase transition-colors whitespace-nowrap ${
                  isActive 
                    ? "text-[#FF4D00] underline decoration-[#141414] decoration-2 underline-offset-4" 
                    : "text-[#141414] hover:text-[#FF4D00]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* More Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 250)}
              className="inline-flex items-center gap-1 font-display text-[11px] xl:text-xs 2xl:text-sm font-bold tracking-wide uppercase text-[#141414] hover:text-[#FF4D00] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>MORE</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-[#FF4D00]' : 'text-[#141414]'}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 p-2.5 bg-[#FAF7EE] rounded-2xl border-2 border-[#141414] shadow-[5px_5px_0_0_#141414] animate-in fade-in slide-in-from-top-2 duration-200 z-50 text-left">
                {extraTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.name}
                      to={tool.to}
                      onClick={() => setMoreDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FFC72E] border border-transparent hover:border-[#141414] transition-all group"
                    >
                      <div className="size-8 rounded-lg bg-[#141414] text-[#FF4D00] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase text-[#141414]">{tool.name}</div>
                        <div className="text-[11px] text-[#141414]/70 font-medium line-clamp-1">{tool.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Desktop Action Buttons (lg+ screens) */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-3 flex-shrink-0">
          
          {/* Executive Portal (visible on ultra-wide 2xl screens) */}
          <Link
            to="/admin/verify"
            className="hidden 2xl:inline-flex brutal-btn items-center gap-1.5 px-3 py-2 rounded-full bg-[#FFC72E] hover:bg-[#FFE600] text-[#141414] border-2 border-[#141414] text-xs font-display font-black shadow-[2px_2px_0_0_#141414] whitespace-nowrap cursor-pointer"
            title="Executive Verification Portal"
          >
            <ShieldCheck className="w-4 h-4 text-[#141414]" />
            <span>PORTAL</span>
          </Link>

          {/* AI Bot */}
          <button
            onClick={onOpenAIChat}
            className="brutal-btn inline-flex items-center gap-1.5 px-2 xl:px-3 py-1.5 xl:py-2 rounded-full bg-[#F4EFE6] hover:bg-white text-[#141414] border-2 border-[#141414] text-xs font-display font-bold shadow-[2px_2px_0_0_#141414] cursor-pointer whitespace-nowrap"
            title="Ask AI Principal"
          >
            <Bot className="w-3.5 xl:w-4 h-3.5 xl:h-4 text-[#FF4D00]" />
            <span className="hidden xl:inline">AI BOT</span>
          </button>

          {/* Client Authentication Login / Profile */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="brutal-btn inline-flex items-center gap-1.5 px-3 xl:px-3.5 py-1.5 xl:py-2 rounded-full bg-[#FAF7EE] hover:bg-[#FFC72E] text-[#141414] border-2 border-[#141414] text-xs font-display font-black shadow-[2px_2px_0_0_#141414] whitespace-nowrap cursor-pointer"
              title="Client Login & Access"
            >
              <LogIn className="w-3.5 h-3.5 text-[#FF4D00]" />
              <span>LOGIN</span>
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7EE] border-2 border-[#141414] text-xs font-display font-black shadow-[2px_2px_0_0_#141414]">
              <div className="size-5 rounded-full bg-[#FF4D00] text-[#FAF7EE] flex items-center justify-center text-[10px] uppercase font-black">
                {user.name?.[0] || user.userId?.[0] || 'U'}
              </div>
              <span className="max-w-[85px] truncate text-[#141414] uppercase">
                {user.name || user.userId}
              </span>
              <button
                onClick={logout}
                title="Log Out of Account"
                className="text-[#141414]/60 hover:text-red-600 transition-colors p-0.5 cursor-pointer ml-0.5"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          )}

          {/* START A PROJECT Big Button with generous padding and space */}
          <Link
            to="/contact"
            className="brutal-btn inline-flex items-center justify-center gap-2 px-4 xl:px-6 py-2 xl:py-2.5 rounded-full bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] font-display text-xs xl:text-sm font-black tracking-wide uppercase shadow-[3px_3px_0_0_#FF4D00] whitespace-nowrap flex-shrink-0 cursor-pointer ml-1"
          >
            <span>START A PROJECT</span>
          </Link>

        </div>

        {/* Mobile Action Bar (< lg screens): Phone screen shows ONLY the 3-dash menu button */}
        <div className="flex lg:hidden items-center flex-shrink-0">
          {/* 3-DASH MENU BUTTON: Prominent amber-yellow button with bold, high-contrast 3-dash sign */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="brutal-btn flex items-center justify-center size-9 sm:size-10 rounded-full bg-[#FFC72E] hover:bg-[#FFE600] border-2 border-[#141414] text-[#141414] shadow-[2px_2px_0_0_#141414] cursor-pointer flex-shrink-0 active:scale-95 transition-all"
            aria-label="Toggle 3-dash navigation menu to view all services and features"
            title="View all services & menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5 sm:size-6 text-[#141414]" strokeWidth={2.5} />
            ) : (
              <Menu className="size-5 sm:size-6 text-[#141414]" strokeWidth={2.5} />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu: View All Services & All Things under the 3 Dash */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-h-[calc(100dvh-68px)] sm:max-h-[calc(100vh-76px)] overflow-y-auto overscroll-contain px-3 sm:px-4 py-4 bg-[#FAF7EE] border-b-4 border-[#141414] shadow-[0_8px_0_0_#141414] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
          
          {/* Primary Action: START A PROJECT */}
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="brutal-btn flex items-center justify-center gap-2 w-full py-3 rounded-xl font-display text-xs sm:text-sm font-black uppercase tracking-wider bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] border-2 border-[#141414] shadow-[3px_3px_0_0_#FF4D00] transition-all cursor-pointer"
          >
            <span>START A PROJECT</span>
          </Link>

          {/* Top Row: AI Assistant & Client Account Access */}
          <div className="space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAIChat(); }}
              className="brutal-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display text-xs font-black uppercase bg-[#FAF7EE] text-[#141414] border-2 border-[#141414] shadow-[2px_2px_0_0_#141414]"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#FF4D00]" />
                <span>ASK AI ARCHITECT</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#FFC72E] text-[#141414] text-[10px] font-black">ONLINE</span>
            </button>

            {!isAuthenticated ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="brutal-btn flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display text-xs font-black uppercase bg-white text-[#141414] border-2 border-[#141414] shadow-[2px_2px_0_0_#FF4D00]"
              >
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-[#FF4D00]" />
                  <span>CLIENT LOGIN / REGISTER</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FF4D00] text-[#FAF7EE] text-[10px] font-black">ACCESS</span>
              </Link>
            ) : (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display text-xs font-black uppercase bg-white text-[#141414] border-2 border-[#141414] shadow-[2px_2px_0_0_#141414]">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-[#FF4D00] text-white flex items-center justify-center text-[10px] font-black">
                    {user.name?.[0] || user.userId?.[0] || 'U'}
                  </div>
                  <span className="truncate max-w-[140px] text-xs font-black">{user.name || user.userId}</span>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-300 text-[10px] font-black cursor-pointer"
                >
                  LOGOUT
                </button>
              </div>
            )}
          </div>

          {/* ALL SERVICES (9 ENGINEERING PILLARS) DIRECTORY */}
          <div className="pt-2 border-t-2 border-[#141414]/15">
            <div className="flex items-center justify-between pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D00] animate-pulse"></span>
                <span className="font-display text-xs font-black uppercase tracking-wider text-[#141414]">
                  ALL SERVICES ({SERVICE_PILLARS.length} PILLARS)
                </span>
              </div>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[11px] font-bold text-[#FF4D00] hover:underline flex items-center gap-0.5 uppercase"
              >
                <span>Overview</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-1.5">
              {SERVICE_PILLARS.map((pillar) => {
                const IconComponent = getPillarIcon(pillar.id);
                const isActive = location.pathname === `/services/${pillar.id}`;
                return (
                  <Link
                    key={pillar.id}
                    to={`/services/${pillar.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border-2 border-[#141414] transition-all group ${
                      isActive 
                        ? 'bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]' 
                        : 'bg-white hover:bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]'
                    }`}
                  >
                    <div className="size-8 rounded-lg bg-[#141414] text-[#FAF7EE] group-hover:bg-[#FF4D00] flex items-center justify-center flex-shrink-0 transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-[#FF4D00] uppercase truncate">
                          {pillar.badge}
                        </span>
                        <span className="text-[9px] text-[#141414]/60 uppercase truncate">
                          • {pillar.category}
                        </span>
                      </div>
                      <div className="text-xs font-black text-[#141414] truncate">
                        {pillar.title}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#141414]/40 group-hover:text-[#141414] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                );
              })}
            </div>

            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="brutal-btn block w-full text-center py-2.5 rounded-xl font-display text-xs font-black uppercase bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] border-2 border-[#141414] shadow-[2px_2px_0_0_#FF4D00] mt-2.5 transition-colors cursor-pointer"
            >
              <span>EXPLORE ALL SERVICES & SPECS →</span>
            </Link>
          </div>

          {/* ALL PLATFORM TOOLS & PAGES ("ALL THINGS") */}
          <div className="pt-3 border-t-2 border-[#141414]/15">
            <div className="flex items-center gap-2 pb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
              <span className="font-display text-xs font-black uppercase tracking-wider text-[#141414]">
                ALL TOOLS & PLATFORM PAGES
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {mobilePlatformThings.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2 rounded-xl border-2 border-[#141414] text-left transition-all ${
                      isActive 
                        ? 'bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]' 
                        : 'bg-white hover:bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]'
                    }`}
                  >
                    <div className="size-6 rounded-md bg-[#141414] text-[#FAF7EE] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-black text-[#141414] truncate leading-tight">
                        {item.name}
                      </div>
                      <div className="text-[9px] text-[#FF4D00] font-bold uppercase truncate">
                        {item.badge}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* EXECUTIVE PORTAL & DIRECT PAYMENT */}
          <div className="pt-3 border-t-2 border-[#141414]/15 space-y-2">
            <Link
              to="/admin/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="brutal-btn flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display text-xs font-black uppercase bg-[#FFC72E] text-[#141414] border-2 border-[#141414] shadow-[2px_2px_0_0_#141414]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#141414]" />
                <span>EXECUTIVE PORTAL</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#141414] text-[#FAF7EE] text-[10px] font-black">PASSKEY</span>
            </Link>

            <Link
              to="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="brutal-btn block w-full text-center py-2.5 rounded-xl font-display text-xs font-black uppercase bg-[#FF4D00] text-[#FAF7EE] border-2 border-[#141414] shadow-[2px_2px_0_0_#141414]"
            >
              💳 DIRECT CLIENT CHECKOUT (UPI / WIRE / USDT)
            </Link>
          </div>

          {/* DIRECT FOUNDER WAR ROOM CONNECT (WhatsApp & Telegram) */}
          <div className="pt-2 border-t-2 border-[#141414]/15 flex items-center gap-2">
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] text-[#141414] border-2 border-[#141414] text-xs font-display font-black uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0_0_#141414]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WHATSAPP</span>
            </a>
            <a
              href={CONTACT_INFO.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn py-2.5 px-3 rounded-xl bg-[#F4EFE6] text-[#141414] border-2 border-[#141414] text-xs font-display font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#141414]"
            >
              <Send className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>TELEGRAM</span>
            </a>
          </div>
        </div>
      )}

    </header>
  );
}
