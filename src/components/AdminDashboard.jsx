import React, { useState, useEffect } from 'react';
import { 
  getInquiries, 
  fetchServerLeads,
  getSecurityLogs, 
  getAuditRecords, 
  getEstimateRecords, 
  updateLeadStatus, 
  deleteLead, 
  verifyAdminCredentials, 
  isAdminAuthenticated, 
  adminLogout,
  getRegisteredUsers,
  saveRegisteredUser
} from '../services/storageService';
import { 
  Shield, Lock, Users, Activity, LogOut, X, RefreshCw, MessageCircle, Mail, Clock, 
  CheckCircle2, Download, Search, Globe, Calculator, Layers, Trash2, Eye, ShieldCheck, 
  Zap, FileText, Check, AlertCircle, ArrowUpRight, ChevronRight, Crown, UserCheck
} from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  
  // Dashboard Tabs: 'inquiries' | 'users' | 'audits' | 'estimates' | 'logs'
  const [activeTab, setActiveTab] = useState('inquiries');
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [audits, setAudits] = useState([]);
  const [estimates, setEstimates] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const auth = isAdminAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        loadData();
      }
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const serverLeads = await fetchServerLeads();
      setInquiries(serverLeads || getInquiries());
      setRegisteredUsers(getRegisteredUsers());
      setAudits(getAuditRecords());
      setEstimates(getEstimateRecords());
      setSecurityLogs(getSecurityLogs());
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingAuth(true);
    setAuthError('');

    try {
      const success = await verifyAdminCredentials(username, password);
      if (success) {
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
        loadData();
      } else {
        setAuthError('Invalid administrative credentials. Access denied.');
      }
    } catch (err) {
      setAuthError('Authentication server error. Try again.');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setSelectedLead(null);
  };

  const handleStatusChange = (id, newStatus) => {
    updateLeadStatus(id, newStatus);
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleUserSubscriptionChange = (userEmail, newTier) => {
    const users = getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    if (user) {
      const planNames = {
        free: 'Free Explorer Tier',
        pro: 'Pro Engineering Member',
        enterprise: 'Enterprise Dedicated Retainer'
      };
      user.subscription = {
        tier: newTier,
        status: 'active',
        planName: planNames[newTier] || 'Custom Tier',
        unlockedAt: new Date().toISOString()
      };
      saveRegisteredUser(user);
      setRegisteredUsers([...getRegisteredUsers()]);
    }
  };

  const handleDeleteLead = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Delete this inquiry record permanently?')) {
      deleteLead(id);
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(null);
      }
    }
  };

  const exportToCSV = () => {
    if (inquiries.length === 0 && registeredUsers.length === 0) {
      alert('No database records to export.');
      return;
    }

    const headers = ['Type', 'ID', 'Date', 'Name', 'Email', 'Company/Plan', 'Service/Tier', 'Status', 'Details'];
    const rows = [
      ...inquiries.map(inq => [
        'LEAD',
        inq.id,
        inq.timestamp ? new Date(inq.timestamp).toLocaleString() : 'N/A',
        `"${(inq.name || '').replace(/"/g, '""')}"`,
        `"${(inq.email || '').replace(/"/g, '""')}"`,
        `"${(inq.company || '').replace(/"/g, '""')}"`,
        `"${(inq.service || inq.selectedService || '').replace(/"/g, '""')}"`,
        `"${(inq.status || '').replace(/"/g, '""')}"`,
        `"${(inq.message || '').replace(/"/g, '""')}"`
      ]),
      ...registeredUsers.map(u => [
        'MEMBER',
        u.id,
        u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A',
        `"${(u.name || '').replace(/"/g, '""')}"`,
        `"${(u.email || '').replace(/"/g, '""')}"`,
        `"${(u.subscription?.planName || 'Free').replace(/"/g, '""')}"`,
        `"${(u.authProvider || 'google').toUpperCase()}"`,
        `"${(u.subscription?.status || 'Active').replace(/"/g, '""')}"`,
        `"Logins: ${u.loginCount || 1}"`
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ue_database_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInquiries = inquiries.filter(inq => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (inq.name && inq.name.toLowerCase().includes(q)) ||
      (inq.email && inq.email.toLowerCase().includes(q)) ||
      (inq.company && inq.company.toLowerCase().includes(q)) ||
      (inq.service && inq.service.toLowerCase().includes(q)) ||
      (inq.id && inq.id.toLowerCase().includes(q))
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-6xl h-[88vh] max-h-[780px] bg-[#030712] border border-sky-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header Bar */}
        <div className="px-6 py-3.5 bg-obsidian-950/90 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">Executive Management Portal</h3>
                {isAuthenticated ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE PRODUCTION
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-400 text-[10px] font-mono">
                    AUTH REQUIRED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-light">Real Database • Live Telemetry Stream • Registered User Subscriptions</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isAuthenticated && (
              <>
                <button
                  onClick={loadData}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-300 hover:text-white hover:border-sky-500/40 transition-colors"
                  title="Refresh Database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Sync</span>
                </button>

                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-300 hover:text-white hover:border-sky-500/40 transition-colors"
                  title="Export Database to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 hover:bg-red-950/70 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        {!isAuthenticated ? (
          /* Secure Executive Authentication Form */
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-[#030712] to-[#0B1120]">
            <div className="w-full max-w-sm p-8 rounded-3xl bg-obsidian-900/90 border border-sky-500/30 text-center shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/40 text-sky-400 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>
              
              <h4 className="text-xl font-light text-white mb-1">Executive Authentication</h4>
              <p className="text-xs text-slate-400 font-light mb-6">Enter administrative credentials to access backend pipeline.</p>

              {authError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs mb-4 flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Admin Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-400 font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Admin Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-400 font-mono transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingAuth}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all mt-3 shadow-lg shadow-sky-500/20 disabled:opacity-50"
                >
                  {loadingAuth ? 'Verifying Credentials...' : 'Authenticate Portal'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Real Metrics Counter Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 px-6 py-3 bg-obsidian-950 border-b border-slate-800 text-left">
              <div className="p-2.5 rounded-xl bg-obsidian-900/80 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                  <span>Inquiries</span>
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-xl font-bold text-white mt-1">{inquiries.length}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-obsidian-900/80 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                  <span>Registered Users</span>
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-white mt-1">{registeredUsers.length}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-obsidian-900/80 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                  <span>Audits Run</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-white mt-1">{audits.length}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-obsidian-900/80 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                  <span>Estimates</span>
                  <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-xl font-bold text-white mt-1">{estimates.length}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-obsidian-900/80 border border-slate-800/80 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                  <span>Live Telemetry</span>
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-white mt-1">{securityLogs.length}</div>
              </div>
            </div>

            {/* Navigation Tabs & Search */}
            <div className="px-6 py-2.5 bg-obsidian-900/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => { setActiveTab('inquiries'); setSelectedLead(null); }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    activeTab === 'inquiries'
                      ? 'bg-sky-500 text-black font-semibold'
                      : 'bg-obsidian-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Inquiries ({inquiries.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('users'); setSelectedLead(null); }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    activeTab === 'users'
                      ? 'bg-amber-400 text-black font-semibold'
                      : 'bg-obsidian-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Members & Subscriptions ({registeredUsers.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('audits'); setSelectedLead(null); }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    activeTab === 'audits'
                      ? 'bg-emerald-500 text-black font-semibold'
                      : 'bg-obsidian-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Audits ({audits.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('estimates'); setSelectedLead(null); }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    activeTab === 'estimates'
                      ? 'bg-indigo-500 text-white font-semibold'
                      : 'bg-obsidian-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Estimates ({estimates.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('logs'); setSelectedLead(null); }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    activeTab === 'logs'
                      ? 'bg-purple-500 text-white font-semibold'
                      : 'bg-obsidian-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Telemetry ({securityLogs.length})</span>
                </button>

                <a
                  href="/admin/verify"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm hover:from-sky-400 hover:to-indigo-500 transition-all ml-auto"
                  title="Open Full Founder Executive Portal with 12-Digit Secret Keys, Passwords & Live Database"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Executive Vault Portal ↗</span>
                </a>
              </div>

              {activeTab === 'inquiries' && (
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, company, id..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}
            </div>

            {/* TAB 1: Real Inquiries & Customer Submissions */}
            {activeTab === 'inquiries' && (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Leads List */}
                <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 ${selectedLead ? 'hidden md:block md:w-1/2' : 'w-full'}`}>
                  {filteredInquiries.length === 0 ? (
                    <div className="text-center py-16 px-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">Awaiting Live Client Submissions</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        No customer inquiries received yet. When visitors submit the Contact Wizard, Project Estimator, or Live Audit request, they will appear here instantly.
                      </p>
                    </div>
                  ) : (
                    filteredInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        onClick={() => setSelectedLead(inq)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                          selectedLead?.id === inq.id
                            ? 'bg-obsidian-900 border-sky-400 shadow-lg shadow-sky-500/10'
                            : 'bg-obsidian-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400 text-[10px] font-mono">
                              {inq.id}
                            </span>
                            <h4 className="text-sm font-semibold text-white">{inq.name}</h4>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                            inq.status?.includes('Closed')
                              ? 'bg-slate-900 border-slate-700 text-slate-400'
                              : inq.status?.includes('Contacted')
                              ? 'bg-indigo-950 border-indigo-500/40 text-indigo-300'
                              : 'bg-emerald-950 border-emerald-500/40 text-emerald-400'
                          }`}>
                            {inq.status || 'New / Priority'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 space-y-1 mb-2">
                          {inq.company && <div className="text-slate-400">🏢 {inq.company}</div>}
                          <div>🎯 <strong className="text-sky-300 font-normal">{inq.service || inq.selectedService}</strong></div>
                          <div>💰 Budget: <span className="text-emerald-400 font-mono">{inq.budget}</span></div>
                        </div>

                        {inq.message && (
                          <p className="text-xs text-slate-400 line-clamp-2 bg-obsidian-950/80 p-2 rounded-xl border border-slate-800/80 mb-3">
                            "{inq.message}"
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                          <span>{inq.timestamp ? new Date(inq.timestamp).toLocaleDateString() : 'Recent'}</span>
                          <span className="text-sky-400 flex items-center gap-1">
                            View Details <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Selected Lead Detail Drawer */}
                {selectedLead && (
                  <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-slate-800 bg-obsidian-950 p-6 overflow-y-auto flex flex-col text-left">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400 text-[10px] font-mono">
                            {selectedLead.id}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {selectedLead.timestamp ? new Date(selectedLead.timestamp).toLocaleString() : ''}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1">{selectedLead.name}</h3>
                        {selectedLead.company && <p className="text-xs text-slate-400">{selectedLead.company}</p>}
                      </div>

                      <button
                        onClick={() => setSelectedLead(null)}
                        className="p-1.5 rounded-lg bg-obsidian-900 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4 flex-1">
                      {/* Status Dropdown */}
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">Lead Status</label>
                        <select
                          value={selectedLead.status || 'New / Priority'}
                          onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-obsidian-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-sky-400"
                        >
                          <option value="New / Priority">New / Priority</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Review">In Review</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Closed / Won">Closed / Won</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>

                      {/* Contact Channels */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {selectedLead.phone ? (
                          <a
                            href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedLead.name}, this is Vikas Mishra from The Unfiltered Engineer regarding your inquiry.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>WhatsApp</span>
                          </a>
                        ) : (
                          <button disabled className="px-3 py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-mono">
                            No Phone Given
                          </button>
                        )}

                        {selectedLead.email ? (
                          <a
                            href={`mailto:${selectedLead.email}?subject=${encodeURIComponent(`The Unfiltered Engineer - Proposal for ${selectedLead.company || selectedLead.name}`)}`}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Send Email</span>
                          </a>
                        ) : (
                          <button disabled className="px-3 py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-mono">
                            No Email Given
                          </button>
                        )}
                      </div>

                      {/* Details Box */}
                      <div className="p-4 rounded-2xl bg-obsidian-900 border border-slate-800 space-y-2.5 text-xs">
                        <div>
                          <span className="text-slate-400 font-mono">Service Practice:</span>
                          <div className="text-white font-medium mt-0.5">{selectedLead.service || selectedLead.selectedService}</div>
                        </div>

                        <div>
                          <span className="text-slate-400 font-mono">Budget / Engagement:</span>
                          <div className="text-emerald-400 font-mono mt-0.5">{selectedLead.budget}</div>
                        </div>

                        {selectedLead.email && (
                          <div>
                            <span className="text-slate-400 font-mono">Email Address:</span>
                            <div className="text-slate-200 font-mono select-all mt-0.5">{selectedLead.email}</div>
                          </div>
                        )}

                        {selectedLead.phone && (
                          <div>
                            <span className="text-slate-400 font-mono">Phone / WhatsApp:</span>
                            <div className="text-slate-200 font-mono select-all mt-0.5">{selectedLead.phone}</div>
                          </div>
                        )}
                      </div>

                      {/* Message Text */}
                      {selectedLead.message && (
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Customer Message</label>
                          <div className="p-3.5 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                            {selectedLead.message}
                          </div>
                        </div>
                      )}

                      {/* Delete Lead */}
                      <div className="pt-3">
                        <button
                          onClick={(e) => handleDeleteLead(selectedLead.id, e)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-950 text-xs font-mono transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Inquiry Record</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Registered Users & Subscriptions Management */}
            {activeTab === 'users' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-left">
                {registeredUsers.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                      <Crown className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">No Users Registered Yet</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      When visitors sign in with Google or Email on the platform, their profiles, login history, and subscription tiers will appear here for management.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {registeredUsers.map((u) => (
                      <div key={u.id} className="p-4 rounded-2xl bg-obsidian-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={u.picture}
                            alt={u.name}
                            className="w-11 h-11 rounded-xl object-cover border border-sky-400/50 bg-slate-900"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{u.name}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                                u.subscription?.tier === 'enterprise'
                                  ? 'bg-purple-950 border-purple-500/50 text-purple-300'
                                  : u.subscription?.tier === 'pro'
                                  ? 'bg-sky-950 border-sky-500/50 text-sky-300'
                                  : 'bg-slate-900 border-slate-700 text-slate-400'
                              }`}>
                                {u.subscription?.planName || 'Free Explorer'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-1">
                              ID: {u.id} • Auth: {u.authProvider} • Joined: {new Date(u.createdAt).toLocaleDateString()} • Logins: {u.loginCount || 1}
                            </div>
                          </div>
                        </div>

                        {/* Subscription Tier Action Changer */}
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-mono text-slate-400 hidden sm:inline">Set Tier:</label>
                          <select
                            value={u.subscription?.tier || 'free'}
                            onChange={(e) => handleUserSubscriptionChange(u.email, e.target.value)}
                            className="px-3 py-1.5 rounded-xl bg-obsidian-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                          >
                            <option value="free">Free Explorer</option>
                            <option value="pro">Pro Engineering Member</option>
                            <option value="enterprise">Enterprise Dedicated Retainer</option>
                          </select>

                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Hi ${u.name}, this is Vikas Mishra from The Unfiltered Engineer.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-950"
                            title="WhatsApp Member"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Real Audits Executed */}
            {activeTab === 'audits' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {audits.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Zero Audits Executed Yet</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      When visitors run the Live Zero-Trust Security Scanner or Free SEO Audit on the website, their scanned domains and grades will be logged here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left">
                    {audits.map((aud) => (
                      <div key={aud.id} className="p-4 rounded-2xl bg-obsidian-900 border border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                            {aud.id}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {aud.timestamp ? new Date(aud.timestamp).toLocaleTimeString() : ''}
                          </span>
                        </div>

                        <div className="text-sm font-semibold text-white truncate mb-1">
                          🌐 {aud.targetUrl}
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono text-slate-300 mt-2">
                          <span>Score: <strong className="text-sky-400">{aud.score}/100</strong></span>
                          <span>Grade: <strong className="text-emerald-400">{aud.grade}</strong></span>
                          <span className="text-slate-400">Type: {aud.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Real Estimator Scopes */}
            {activeTab === 'estimates' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {estimates.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Zero Estimator Scopes Logged</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Calculated project estimates from visitors will appear here with selected practices, squad headcount, and estimated velocity.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left">
                    {estimates.map((est) => (
                      <div key={est.id} className="p-4 rounded-2xl bg-obsidian-900 border border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono">
                            {est.id}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {est.timestamp ? new Date(est.timestamp).toLocaleTimeString() : ''}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 space-y-1 mt-2">
                          <div>⚡ Squad: <strong className="text-white">{est.squadScale} ({est.headcount})</strong></div>
                          <div>⏱️ Delivery: <strong className="text-sky-300 font-mono">{est.duration}</strong></div>
                          <div>📦 Practices: <span className="text-slate-400">{est.services?.join(', ') || 'Custom'}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Real Telemetry Stream */}
            {activeTab === 'logs' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="rounded-2xl bg-obsidian-900 border border-slate-800 overflow-hidden font-mono text-xs text-left">
                  <table className="w-full">
                    <thead className="bg-obsidian-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                      <tr>
                        <th className="p-3">Log ID</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Event Description</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {securityLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500 font-mono text-xs">
                            No telemetry logs captured yet.
                          </td>
                        </tr>
                      ) : (
                        securityLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-obsidian-950/60">
                            <td className="p-3 text-sky-400">{log.id}</td>
                            <td className="p-3 text-slate-400">{log.category || 'TRAFFIC'}</td>
                            <td className="p-3 text-white max-w-xs sm:max-w-md truncate">{log.event}</td>
                            <td className="p-3 text-slate-400 text-[11px]">
                              {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recent'}
                            </td>
                            <td className="p-3 text-right">
                              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px]">
                                {log.status || 'VERIFIED'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
