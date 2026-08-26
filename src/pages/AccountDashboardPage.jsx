import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, upgradeUserSubscription, logoutUser } from '../services/authService';
import { getAuditRecords, getEstimateRecords } from '../services/storageService';
import { CONTACT_INFO } from '../data/agencyData';
import confetti from 'canvas-confetti';
import { 
  User, Shield, ShieldCheck, Sparkles, LogOut, CheckCircle2, Zap, MessageCircle, 
  ExternalLink, Calendar, Key, Clock, FileText, Calculator, ArrowRight, Layers, 
  ChevronRight, Award, Crown, Check
} from 'lucide-react';

export default function AccountDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [audits, setAudits] = useState([]);
  const [estimates, setEstimates] = useState([]);
  const [activeTab, setActiveTab] = useState('subscription'); // 'subscription' | 'audits' | 'estimates'
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setAudits(getAuditRecords());
    setEstimates(getEstimateRecords());
  }, [navigate]);

  const handleUpgrade = (tier) => {
    setUpgrading(true);
    try {
      const updated = upgradeUserSubscription(tier);
      setUser({ ...updated });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } finally {
      setTimeout(() => setUpgrading(false), 500);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!user) return null;

  const isPro = user.subscription?.tier === 'pro';
  const isEnterprise = user.subscription?.tier === 'enterprise';

  const getWhatsAppVIPLink = () => {
    const text = encodeURIComponent(
      `Hi Vikas, this is ${user.name} (Member ID: ${user.id}, Email: ${user.email}). ` +
      `I am on the ${user.subscription?.planName || 'Pro Engineering'} plan. Let's discuss activating our dedicated squad.`
    );
    return `https://wa.me/919137507092?text=${text}`;
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-sky-lavender-mesh text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Profile Bar */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.picture}
                alt={user.name}
                className="w-16 h-16 rounded-2xl border-2 border-sky-400 shadow-sm object-cover bg-slate-100"
              />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white shadow-xs">
                <Check className="w-3 h-3" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-950">{user.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${
                  isEnterprise 
                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                    : isPro
                    ? 'bg-sky-100 text-sky-800 border-sky-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  {user.subscription?.planName || 'Free Explorer'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-mono mt-0.5">{user.email}</p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono mt-2">
                <span>ID: <strong className="text-slate-800">{user.id}</strong></span>
                <span>• Auth: <strong className="text-slate-800 capitalize">{user.authProvider}</strong></span>
                <span>• Joined: <strong className="text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={getWhatsAppVIPLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>VIP WhatsApp Channel</span>
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-2xl bg-white/80 p-1.5 border border-indigo-100/80 mb-6 shadow-xs max-w-md">
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'subscription'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Membership & Tier</span>
          </button>

          <button
            onClick={() => setActiveTab('audits')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'audits'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Saved Audits ({audits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('estimates')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'estimates'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-sky-400" />
            <span>Scopes ({estimates.length})</span>
          </button>
        </div>

        {/* TAB 1: Subscription Tier & Upgrade */}
        {activeTab === 'subscription' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Free Tier Card */}
            <div className={`p-6 rounded-3xl bg-white border transition-all ${
              user.subscription?.tier === 'free'
                ? 'border-2 border-sky-500 shadow-md ring-2 ring-sky-100'
                : 'border-slate-200 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-950">Free Explorer</h3>
                {user.subscription?.tier === 'free' && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-mono font-semibold">ACTIVE</span>
                )}
              </div>
              <p className="text-xs text-slate-600 mb-4">Standard technical exploration & live audit tools.</p>
              <div className="text-2xl font-bold text-slate-950 mb-6">$0 <span className="text-xs text-slate-500 font-normal">/ forever</span></div>

              <div className="space-y-2.5 text-xs text-slate-700 mb-6">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Live Security Scan Reports</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Custom Scope Estimations</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> AI Solutions Architect Inquiries</div>
              </div>

              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-default"
              >
                {user.subscription?.tier === 'free' ? 'Current Plan' : 'Basic Tier'}
              </button>
            </div>

            {/* Pro Engineering Member Card */}
            <div className={`p-6 rounded-3xl bg-white border relative transition-all ${
              isPro
                ? 'border-2 border-indigo-600 shadow-lg ring-4 ring-indigo-100'
                : 'border-slate-200 hover:border-indigo-400'
            }`}>
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                Recommended
              </div>

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-950">Pro Engineering Access</h3>
                {isPro && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">ACTIVE</span>
                )}
              </div>
              <p className="text-xs text-slate-600 mb-4">Direct access to senior squad leads & deep architecture reviews.</p>
              <div className="text-2xl font-bold text-slate-950 mb-6">Verified <span className="text-xs text-slate-500 font-normal">/ Active Member</span></div>

              <div className="space-y-2.5 text-xs text-slate-700 mb-6">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Unlimited Security & SEO Dossiers</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Direct VIP WhatsApp with Vikas Mishra</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 24/7 Red-Team War Room Dispatch Priority</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Custom Architecture Blueprints</div>
              </div>

              <button
                onClick={() => handleUpgrade('pro')}
                disabled={isPro || upgrading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-sky-600/20 disabled:opacity-75"
              >
                {isPro ? '✓ Pro Membership Active' : 'Activate Pro Membership'}
              </button>
            </div>

            {/* Enterprise Retainer Card */}
            <div className={`p-6 rounded-3xl bg-slate-950 text-white border transition-all ${
              isEnterprise
                ? 'border-2 border-purple-500 shadow-xl ring-4 ring-purple-500/20'
                : 'border-slate-800 hover:border-purple-500/50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white">Enterprise Dedicated Squad</h3>
                {isEnterprise && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-900 border border-purple-400 text-purple-300 text-[10px] font-mono font-semibold">ACTIVE</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-4">4-9 Dedicated senior engineers assigned exclusively to your stack.</p>
              <div className="text-2xl font-bold text-white mb-6">Custom <span className="text-xs text-slate-400 font-normal">/ Monthly Retainer</span></div>

              <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Dedicated 4-9 Senior Engineer Squad</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> 0-Day Vulnerability SLA Defense</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Smart Contract Formal Verification</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Boardroom Level Strategic Support</div>
              </div>

              <button
                onClick={() => handleUpgrade('enterprise')}
                disabled={isEnterprise || upgrading}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md shadow-purple-600/30 disabled:opacity-75"
              >
                {isEnterprise ? '✓ Enterprise Retainer Active' : 'Activate Enterprise Access'}
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: User's Saved Audits */}
        {activeTab === 'audits' && (
          <div className="bg-white/95 border border-indigo-100 rounded-3xl p-6 sm:p-8 text-left shadow-sm">
            <h3 className="text-base font-bold text-slate-950 mb-1">Your Live Security & SEO Audits</h3>
            <p className="text-xs text-slate-600 mb-6">Real-time scan logs and health metrics generated on the platform.</p>

            {audits.length === 0 ? (
              <div className="text-center py-12">
                <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No audits executed in this session.</p>
                <Link to="/security-audit" className="inline-flex items-center gap-1 text-xs text-sky-600 font-semibold mt-3 hover:underline">
                  Run Zero-Trust Security Audit <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audits.map((aud) => (
                  <div key={aud.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">
                        {aud.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{new Date(aud.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 truncate">🌐 {aud.targetUrl}</div>
                    <div className="flex items-center gap-4 text-xs font-mono mt-2 text-slate-700">
                      <span>Score: <strong className="text-sky-700">{aud.score}/100</strong></span>
                      <span>Grade: <strong className="text-emerald-700">{aud.grade}</strong></span>
                      <span className="text-slate-500">{aud.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Saved Project Scopes */}
        {activeTab === 'estimates' && (
          <div className="bg-white/95 border border-indigo-100 rounded-3xl p-6 sm:p-8 text-left shadow-sm">
            <h3 className="text-base font-bold text-slate-950 mb-1">Your Project Estimates & Scopes</h3>
            <p className="text-xs text-slate-600 mb-6">Staffing models and velocity delivery targets configured in the Project Estimator.</p>

            {estimates.length === 0 ? (
              <div className="text-center py-12">
                <Calculator className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No project scopes configured yet.</p>
                <Link to="/estimator" className="inline-flex items-center gap-1 text-xs text-sky-600 font-semibold mt-3 hover:underline">
                  Launch Project Estimator <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {estimates.map((est) => (
                  <div key={est.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-mono font-semibold">
                        {est.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{new Date(est.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-xs text-slate-700 space-y-1 mt-2">
                      <div>⚡ Squad: <strong className="text-slate-900">{est.squadScale} ({est.headcount})</strong></div>
                      <div>⏱️ Delivery Velocity: <strong className="text-sky-700 font-mono">{est.duration}</strong></div>
                      <div>📦 Practices: <span className="text-slate-600">{est.services?.join(', ') || 'Custom Stack'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
