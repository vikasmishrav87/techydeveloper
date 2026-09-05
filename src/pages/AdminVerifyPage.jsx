import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, Check, X, Clock, RefreshCw, Eye, EyeOff, Lock, Key, MessageCircle, 
  ExternalLink, ArrowLeft, Search, Filter, AlertCircle, Copy, CheckCircle2,
  Users, CreditCard, FileText, Database, Activity, Plus, Trash2, Edit3, Save,
  Download, Code, Building, Mail, Phone, DollarSign, Shield, Sparkles
} from 'lucide-react';

export default function AdminVerifyPage() {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('id');

  // Master Authentication State (Persisted in sessionStorage so refreshes remain active during session)
  const [passcode, setPasscode] = useState(() => sessionStorage.getItem('ue_executive_passcode') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(sessionStorage.getItem('ue_executive_passcode')));
  const [loginPasscode, setLoginPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Active Multi-Portal Tab
  // 'users' | 'payments' | 'leads' | 'telemetry' | 'vault-editor'
  const [activeTab, setActiveTab] = useState('users');

  // Core Data States
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [leads, setLeads] = useState([]);
  const [telemetry, setTelemetry] = useState(null);

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState(highlightId || '');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [leadSearch, setLeadSearch] = useState('');

  // Password / Secret Key Visibility Toggles (keyed by userId or index)
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [revealedKeys, setRevealedKeys] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  // Modals & Sub-actions
  const [selectedImage, setSelectedImage] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [editUserModal, setEditUserModal] = useState(null); // user object or null
  const [createUserModal, setCreateUserModal] = useState(false);
  const [createPaymentModal, setCreatePaymentModal] = useState(false);
  const [editPaymentModal, setEditPaymentModal] = useState(null);

  // Raw Database Editor State
  const [activeRawFile, setActiveRawFile] = useState('users.json');
  const [rawEditorContent, setRawEditorContent] = useState('');
  const [rawEditorSha, setRawEditorSha] = useState('');
  const [rawEditorLoading, setRawEditorLoading] = useState(false);
  const [rawEditorStatus, setRawEditorStatus] = useState('');

  // Forms State
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'client',
    phone: '',
    company: '',
    recoveryKey: ''
  });

  const [newPaymentForm, setNewPaymentForm] = useState({
    clientName: '',
    clientEmail: '',
    amountUSD: 500,
    amountINR: 42000,
    method: 'Direct Bank Wire / UPI',
    utr: '',
    service: 'Custom Engineering Retainer',
    status: 'approved'
  });

  // Check login
  const handleLogin = (e) => {
    e.preventDefault();
    const clean = (loginPasscode || '').trim();
    if (clean === 'vikasmusickeytosuccess' || clean === 'unfilteredtrader9372') {
      sessionStorage.setItem('ue_executive_passcode', clean);
      setPasscode(clean);
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Access denied: Invalid passkey.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ue_executive_passcode');
    setIsAuthenticated(false);
    setPasscode('');
    setUsers([]);
    setPayments([]);
    setLeads([]);
  };

  // Fetch all live data from Master Vault API
  const fetchAllData = async () => {
    if (!isAuthenticated || !passcode) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin-vault?action=all-data', {
        headers: {
          'x-admin-passcode': passcode,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setPayments(data.payments || []);
        setLeads(data.leads || []);
        setTelemetry(data.telemetry || null);
      } else if (res.status === 401) {
        handleLogout();
        setAuthError('Session expired. Please re-authenticate.');
      }
    } catch (err) {
      console.error('Failed to fetch vault data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
      const timer = setInterval(fetchAllData, 12000);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated, passcode]);

  // Load raw file when editor tab or active file changes
  useEffect(() => {
    if (isAuthenticated && activeTab === 'vault-editor') {
      loadRawVaultFile(activeRawFile);
    }
  }, [isAuthenticated, activeTab, activeRawFile]);

  const loadRawVaultFile = async (file) => {
    setRawEditorLoading(true);
    setRawEditorStatus('');
    try {
      const res = await fetch(`/api/admin-vault?action=vault-raw&file=${file}`, {
        headers: { 'x-admin-passcode': passcode }
      });
      const data = await res.json();
      if (data.success) {
        setRawEditorContent(data.content);
        setRawEditorSha(data.sha);
      }
    } catch (e) {
      setRawEditorStatus('Error loading file: ' + e.message);
    } finally {
      setRawEditorLoading(false);
    }
  };

  const handleSaveRawVault = async () => {
    try {
      JSON.parse(rawEditorContent); // Test valid JSON
    } catch (err) {
      alert('Invalid JSON: ' + err.message);
      return;
    }

    setRawEditorLoading(true);
    try {
      const res = await fetch('/api/admin-vault?action=vault-save-raw', {
        method: 'POST',
        headers: {
          'x-admin-passcode': passcode,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: activeRawFile,
          content: rawEditorContent,
          commitMessage: `Executive portal update to ${activeRawFile}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setRawEditorStatus('✅ Successfully committed changes permanently to GitHub Vault!');
        setRawEditorSha(data.sha);
        fetchAllData();
      } else {
        setRawEditorStatus('❌ Error: ' + (data.error || 'Commit failed'));
      }
    } catch (err) {
      setRawEditorStatus('❌ Error: ' + err.message);
    } finally {
      setRawEditorLoading(false);
    }
  };

  const handleDownloadBackup = () => {
    const backupObj = {
      exportedAt: new Date().toISOString(),
      vaultRepo: 'vikasmishrav87/ue-vault',
      users,
      payments,
      leads,
      telemetry
    };
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ue-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy helper
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate random 12-digit recovery key in form XXXX-XXXX-XXXX
  const generateNewKey = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let raw = '';
    for (let i = 0; i < 12; i++) {
      raw += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
  };

  // ---------------------------------------------------------------------------
  // USER ACTIONS
  // ---------------------------------------------------------------------------
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin-vault?action=user-create', {
        method: 'POST',
        headers: {
          'x-admin-passcode': passcode,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('User successfully created and stored in permanent vault!');
        setCreateUserModal(false);
        setNewUserForm({
          fullName: '',
          email: '',
          password: '',
          role: 'client',
          phone: '',
          company: '',
          recoveryKey: ''
        });
        fetchAllData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (e) {
      alert('Network error: ' + e.message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin-vault?action=user-update', {
        method: 'PUT',
        headers: {
          'x-admin-passcode': passcode,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editUserModal)
      });
      const data = await res.json();
      if (data.success) {
        alert('User details updated permanently in vault!');
        setEditUserModal(null);
        fetchAllData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (e) {
      alert('Network error: ' + e.message);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${email}" from the vault?`)) return;
    try {
      const res = await fetch(`/api/admin-vault?action=user-delete&userId=${userId}&email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { 'x-admin-passcode': passcode }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u.userId !== userId && u.email !== email));
        alert('User permanently deleted.');
      } else {
        alert('Error deleting user: ' + data.error);
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  // ---------------------------------------------------------------------------
  // PAYMENT ACTIONS
  // ---------------------------------------------------------------------------
  const handlePaymentDecision = async (id, status, reason = '') => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch('/api/admin-vault?action=payment-update', {
        method: 'PUT',
        headers: {
          'x-admin-passcode': passcode,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status, reason })
      });
      const data = await res.json();
      if (data.success) {
        setPayments(prev => prev.map(p => (p.id === id ? { ...p, status, rejectionReason: reason, updatedAt: new Date().toISOString() } : p)));
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Error updating payment: ' + err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleCreateManualPayment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin-vault?action=payment-create', {
        method: 'POST',
        headers: {
          'x-admin-passcode': passcode,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPaymentForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('Manual payment recorded permanently in vault!');
        setCreatePaymentModal(false);
        setNewPaymentForm({
          clientName: '',
          clientEmail: '',
          amountUSD: 500,
          amountINR: 42000,
          method: 'Direct Bank Wire / UPI',
          utr: '',
          service: 'Custom Engineering Retainer',
          status: 'approved'
        });
        fetchAllData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (e) {
      alert('Network error: ' + e.message);
    }
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm(`Are you sure you want to purge payment transaction ${id}?`)) return;
    try {
      const res = await fetch(`/api/admin-vault?action=payment-delete&id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-passcode': passcode }
      });
      const data = await res.json();
      if (data.success) {
        setPayments(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Error: ' + data.error);
      }
    } catch (e) {
      alert('Network error: ' + e.message);
    }
  };

  // ---------------------------------------------------------------------------
  // LEADS ACTIONS
  // ---------------------------------------------------------------------------
  const handleUpdateLead = async (id, status, notes) => {
    try {
      const res = await fetch('/api/admin-vault?action=lead-update', {
        method: 'PUT',
        headers: {
          'x-admin-passcode': passcode,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status, notes })
      });
      const data = await res.json();
      if (data.success) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status, notes } : l));
      }
    } catch (e) {
      alert('Error updating lead: ' + e.message);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      const res = await fetch(`/api/admin-vault?action=lead-delete&id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-passcode': passcode }
      });
      const data = await res.json();
      if (data.success) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    } catch (e) {
      alert('Error deleting lead: ' + e.message);
    }
  };

  // Filtered lists
  const filteredUsers = users.filter(u => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      u.userId?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.fullName?.toLowerCase().includes(q) ||
      u.recoveryKey?.toLowerCase().includes(q) ||
      u.company?.toLowerCase().includes(q)
    );
  });

  const filteredPayments = payments.filter(p => {
    if (paymentFilter !== 'all' && p.status !== paymentFilter) return false;
    if (paymentSearch) {
      const q = paymentSearch.toLowerCase();
      return (
        p.id?.toLowerCase().includes(q) ||
        p.clientName?.toLowerCase().includes(q) ||
        p.clientEmail?.toLowerCase().includes(q) ||
        p.utr?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredLeads = leads.filter(l => {
    if (!leadSearch) return true;
    const q = leadSearch.toLowerCase();
    return (
      l.clientName?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.service?.toLowerCase().includes(q) ||
      l.message?.toLowerCase().includes(q)
    );
  });

  // ===========================================================================
  // LOGIN SCREEN
  // ===========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#070B14] text-slate-100 font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-center space-y-6 relative overflow-hidden backdrop-blur-xl">
          
          <div className="size-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-300">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-mono font-medium mb-2">
              <span>Security Check</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">Authentication Required</h2>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-mono">
              Please enter your security passkey to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 uppercase mb-1.5">
                Passkey
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  autoComplete="new-password"
                  value={loginPasscode}
                  onChange={(e) => setLoginPasscode(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white font-mono text-sm tracking-wider focus:border-sky-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium leading-relaxed font-mono">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all cursor-pointer"
            >
              Verify & Proceed
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 text-center">
            <Link to="/" className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // MAIN EXECUTIVE COMMAND CENTER (AUTHENTICATED)
  // ===========================================================================
  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#060913] text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Executive Header */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-violet-600 overflow-hidden border border-sky-400/40 p-1 flex-shrink-0 shadow-lg shadow-sky-500/20 flex items-center justify-center">
              <img src="/assets/brand-logo.png" alt="Logo" className="w-full h-full object-contain rounded-xl" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE PERMANENT CLOUD VAULT
                </span>
                <span className="text-slate-400 font-mono text-xs">
                  Repo: <strong className="text-sky-400">vikasmishrav87/ue-vault</strong>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Executive Command Center
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Master operational ledger: client account management, verified payment records, and cloud database vault.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchAllData}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center gap-2 border border-slate-700 cursor-pointer transition-all active:scale-95"
              title="Refresh all collections from GitHub Vault"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
              <span>Sync Vault</span>
            </button>

            <button
              onClick={handleDownloadBackup}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              title="Export complete database backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>

        {/* Global KPI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Registered Accounts</div>
              <div className="text-xl font-extrabold text-white">{users.length}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Secret Recovery Keys</div>
              <div className="text-xl font-extrabold text-amber-300">{users.filter(u => u.recoveryKey).length}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Permanent Inflows</div>
              <div className="text-xl font-extrabold text-emerald-400">
                ${telemetry?.totalVolumeUSD?.toLocaleString() || '0'} USD
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Pending Approvals</div>
              <div className="text-xl font-extrabold text-amber-400">
                {payments.filter(p => p.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Portal Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
          {[
            { id: 'users', label: '👥 Registered Clients & 12-Digit Keys', count: users.length },
            { id: 'payments', label: '💳 Payment Verifications', count: payments.length, alert: payments.filter(p => p.status === 'pending').length },
            { id: 'leads', label: '📨 Leads & Project Scopes', count: leads.length },
            { id: 'telemetry', label: '📜 Telemetry & Health Stream' },
            { id: 'vault-editor', label: '⚙️ Raw Cloud Vault DB Editor' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
              {tab.alert > 0 && (
                <span className="size-2 rounded-full bg-amber-400 animate-ping" title="${tab.alert} pending approval" />
              )}
            </button>
          ))}
        </div>

        {/* =================================================================== */}
        {/* TAB 1: USERS & SECRET 12-DIGIT KEYS PORTAL */}
        {/* =================================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by User ID, Email, Recovery Key, or Client Name..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>

              <button
                onClick={() => {
                  setNewUserForm({
                    fullName: '',
                    email: '',
                    password: '',
                    role: 'client',
                    phone: '',
                    company: '',
                    recoveryKey: generateNewKey()
                  });
                  setCreateUserModal(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold font-mono flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Client Account</span>
              </button>
            </div>

            {/* User List */}
            {filteredUsers.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center text-slate-400 font-mono text-xs">
                No user accounts found matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredUsers.map((u) => {
                  const isPassRevealed = Boolean(revealedPasswords[u.userId || u.email]);
                  const isKeyRevealed = revealedKeys[u.userId || u.email] !== false; // revealed by default in admin portal!

                  return (
                    <div
                      key={u.userId || u.email}
                      className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Identity Badge */}
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="size-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-sky-400 font-mono font-bold text-base flex-shrink-0">
                            {(u.fullName || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-white text-base">{u.fullName || 'Valued Client'}</span>
                              <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-bold uppercase">
                                {u.role || 'client'}
                              </span>
                              <span className="text-slate-500 text-xs font-mono">
                                ID: <span className="text-slate-300">{u.userId}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                              <span className="flex items-center gap-1 font-mono text-slate-300">
                                <Mail className="w-3.5 h-3.5 text-slate-500" />
                                {u.email}
                              </span>
                              {u.phone && (
                                <span className="flex items-center gap-1 font-mono text-slate-400">
                                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                                  {u.phone}
                                </span>
                              )}
                              {u.company && (
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Building className="w-3.5 h-3.5 text-slate-500" />
                                  {u.company}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-end lg:self-center">
                          <button
                            onClick={() => setEditUserModal({ ...u })}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Account</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.userId, u.email)}
                            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Credentials Display Grid (Password + 12-Digit Secret Recovery Key) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                        
                        {/* PASSWORD LEDGER BOX */}
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <Lock className="w-3 h-3 text-sky-400" />
                              Client Password (Master Vault)
                            </div>
                            <div className="font-mono text-sm font-bold text-white tracking-wider mt-1 truncate select-all">
                              {isPassRevealed ? u.password : '••••••••••••••••'}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => setRevealedPasswords(prev => ({ ...prev, [u.userId || u.email]: !isPassRevealed }))}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                              title={isPassRevealed ? 'Mask Password' : 'Reveal Password'}
                            >
                              {isPassRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(u.password, `pass-${u.userId}`)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                              title="Copy Password"
                            >
                              {copiedKey === `pass-${u.userId}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* 12-DIGIT SECRET RECOVERY KEY LEDGER BOX */}
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)] flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Key className="w-3 h-3" />
                              Secret 12-Digit Recovery Code
                            </div>
                            <div className="font-mono text-sm font-bold text-amber-300 tracking-widest mt-1 truncate select-all">
                              {u.recoveryKey || 'NO KEY GENERATED'}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => copyToClipboard(u.recoveryKey || '', `key-${u.userId}`)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center gap-1 border border-amber-500/40 cursor-pointer"
                              title="Copy 12-Digit Secret Recovery Key"
                            >
                              {copiedKey === `key-${u.userId}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-[10px] text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">Copy Code</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: PAYMENTS PORTAL */}
        {/* =================================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  placeholder="Search by Order ID, Client Name, Email, or UTR..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto font-mono text-xs">
                {['all', 'pending', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setPaymentFilter(st)}
                    className={`px-3 py-1.5 rounded-lg uppercase text-[11px] font-bold transition-all cursor-pointer ${
                      paymentFilter === st
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCreatePaymentModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Record Payment</span>
              </button>
            </div>

            {/* Payments List */}
            {filteredPayments.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center text-slate-400 font-mono text-xs">
                No payment transactions found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPayments.map((p) => {
                  const isPending = p.status === 'pending';
                  const isApproved = p.status === 'approved';
                  const isRejected = p.status === 'rejected';

                  return (
                    <div
                      key={p.id}
                      className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                        isPending
                          ? 'bg-slate-900/90 border-amber-500/40 ring-1 ring-amber-500/20'
                          : isApproved
                          ? 'bg-slate-900/80 border-emerald-500/40'
                          : 'bg-slate-900/60 border-rose-500/30'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Transaction Information */}
                        <div className="space-y-3 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono font-bold text-sm text-sky-400 select-all">
                              {p.id}
                            </span>

                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                isPending
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : isApproved
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {p.status}
                            </span>

                            <span className="text-slate-500 text-xs font-mono">
                              {new Date(p.createdAt || Date.now()).toLocaleString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <div className="text-slate-500 text-[10px] font-mono uppercase">CLIENT DETAILS</div>
                              <div className="font-bold text-white truncate">{p.clientName || 'Direct Client'}</div>
                              <div className="text-slate-400 text-[11px] truncate">{p.clientEmail || 'No email provided'}</div>
                            </div>

                            <div>
                              <div className="text-slate-500 text-[10px] font-mono uppercase">METHOD & VOLUME</div>
                              <div className="font-bold text-white">{p.method || 'UPI / Wire'}</div>
                              <div className="text-emerald-400 font-mono font-bold text-sm">
                                ${p.amountUSD?.toLocaleString()} USD <span className="text-slate-400 text-xs font-normal">(₹{p.amountINR?.toLocaleString()})</span>
                              </div>
                            </div>

                            <div>
                              <div className="text-slate-500 text-[10px] font-mono uppercase">SUBMITTED UTR / REFERENCE</div>
                              <div className="font-mono font-bold text-amber-400 text-xs break-all select-all flex items-center gap-1.5">
                                <span>{p.utr || 'No UTR provided'}</span>
                                {p.utr && (
                                  <button
                                    onClick={() => copyToClipboard(p.utr, `utr-${p.id}`)}
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                                    title="Copy UTR"
                                  >
                                    {copiedKey === `utr-${p.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                )}
                              </div>
                              {p.rejectionReason && (
                                <div className="text-rose-400 text-[11px] mt-1 italic">
                                  Reason: {p.rejectionReason}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Screenshot Proof */}
                        <div className="flex-shrink-0">
                          {p.screenshot ? (
                            <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-lg">
                              <div
                                onClick={() => setSelectedImage(p.screenshot)}
                                className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-700 bg-black"
                              >
                                <img
                                  src={p.screenshot}
                                  alt="Payment Proof"
                                  className="w-24 h-24 rounded-xl object-cover group-hover:scale-105 transition-all"
                                  title="Click to expand screenshot proof"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-mono font-bold">
                                  🔍 Expand
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedImage(p.screenshot)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40 cursor-pointer flex items-center gap-1 transition-all"
                              >
                                <span>📸 Attached SS</span>
                              </button>
                            </div>
                          ) : (
                            <div className="px-3 py-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-500 text-[10px] font-mono text-center">
                              <div>No SS Attached</div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col gap-2 flex-shrink-0">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => handlePaymentDecision(p.id, 'approved')}
                                disabled={actionLoading[p.id]}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                              >
                                <Check className="w-4 h-4 stroke-[3]" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => {
                                  const reason = prompt('Enter rejection reason:', 'UTR could not be matched with bank ledger');
                                  if (reason !== null) handlePaymentDecision(p.id, 'rejected', reason);
                                }}
                                disabled={actionLoading[p.id]}
                                className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                              >
                                <X className="w-4 h-4 stroke-[3]" />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : isApproved ? (
                            <div className="text-right space-y-1">
                              <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold">
                                <Check className="w-4 h-4" /> Approved
                              </span>
                              <button
                                onClick={() => handlePaymentDecision(p.id, 'rejected', 'Revoked by Executive')}
                                className="block text-[11px] text-slate-400 hover:text-rose-400 underline font-mono cursor-pointer"
                              >
                                Revoke Approval
                              </button>
                            </div>
                          ) : (
                            <div className="text-right space-y-1">
                              <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-bold">
                                <X className="w-4 h-4" /> Rejected
                              </span>
                              <button
                                onClick={() => handlePaymentDecision(p.id, 'approved')}
                                className="block text-[11px] text-slate-400 hover:text-emerald-400 underline font-mono cursor-pointer"
                              >
                                Change to Approved
                              </button>
                            </div>
                          )}

                          <button
                            onClick={() => handleDeletePayment(p.id)}
                            className="text-[11px] text-slate-500 hover:text-rose-400 font-mono text-center cursor-pointer transition-colors"
                          >
                            Purge
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: LEADS & INQUIRIES PORTAL */}
        {/* =================================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="Search inquiries by client name, email, or requirements..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
              />
            </div>

            {filteredLeads.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center text-slate-400 font-mono text-xs">
                No inquiries or project estimates in vault.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{lead.clientName || 'Inquiry Contact'}</span>
                          <span className="text-slate-400 font-mono text-xs">{lead.email}</span>
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5">
                          Phone: {lead.phone || 'N/A'} • Submitted: {new Date(lead.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status || 'new'}
                          onChange={(e) => handleUpdateLead(lead.id, e.target.value, lead.notes)}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-sky-400 focus:outline-none"
                        >
                          <option value="new">Status: New</option>
                          <option value="contacted">Status: Contacted</option>
                          <option value="proposal_sent">Status: Proposal Sent</option>
                          <option value="converted">Status: Converted Client</option>
                          <option value="archived">Status: Archived</option>
                        </select>

                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                      {lead.message || lead.scope || 'No detailed scope text provided.'}
                    </div>

                    {lead.budget && (
                      <div className="text-xs text-emerald-400 font-mono font-bold">
                        Estimated Budget: {lead.budget}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: TELEMETRY & HEALTH STREAM */}
        {/* =================================================================== */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Permanent GitHub Cloud Vault Telemetry</h3>
                  <p className="text-slate-400 text-xs font-mono">Real-time repository blob status & commit checksums</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 font-mono text-[11px] uppercase">Connected Repository</div>
                  <div className="text-sky-400 font-mono font-bold text-sm mt-1">{telemetry?.vaultRepo || 'vikasmishrav87/ue-vault'}</div>
                  <div className="text-emerald-400 font-mono text-xs mt-1">Status: Operational (Private)</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 font-mono text-[11px] uppercase">Storage Engine</div>
                  <div className="text-white font-mono font-bold text-sm mt-1">{telemetry?.storageEngine || 'Git Blobstore Object'}</div>
                  <div className="text-slate-400 font-mono text-xs mt-1">Zero auto-pause • Zero reset risk</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 font-mono text-[11px] uppercase">Last Server Timestamp</div>
                  <div className="text-white font-mono font-bold text-xs mt-1">{telemetry?.serverTimestamp || new Date().toISOString()}</div>
                  <div className="text-emerald-400 font-mono text-xs mt-1">Clock Sync: Verified Accurate</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-400">Latest Git Tree Commit SHAs</h4>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">users.json</span>
                    <span className="text-sky-400 font-bold">{telemetry?.vaultSha?.users || 'Loaded'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">payments.json</span>
                    <span className="text-emerald-400 font-bold">{telemetry?.vaultSha?.payments || 'Loaded'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">leads.json</span>
                    <span className="text-violet-400 font-bold">{telemetry?.vaultSha?.leads || 'Loaded'}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: RAW CLOUD VAULT DB EDITOR */}
        {/* =================================================================== */}
        {activeTab === 'vault-editor' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-sky-400" />
                  Live Cloud Database JSON Editor
                </h3>
                <p className="text-slate-400 text-xs font-mono mt-0.5">
                  Direct master control: edit, validate, and commit directly to GitHub repository <strong className="text-sky-400">vikasmishrav87/ue-vault</strong>.
                </p>
              </div>

              {/* File Selector Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
                {['users.json', 'payments.json', 'leads.json'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveRawFile(f)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      activeRawFile === f ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Message */}
            {rawEditorStatus && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                {rawEditorStatus}
              </div>
            )}

            {/* Code Editor Area */}
            <div className="relative">
              <textarea
                value={rawEditorContent}
                onChange={(e) => setRawEditorContent(e.target.value)}
                disabled={rawEditorLoading}
                rows={20}
                spellCheck={false}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-sky-500 resize-y"
              />
            </div>

            {/* Toolbar Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(rawEditorContent);
                      setRawEditorContent(JSON.stringify(parsed, null, 2));
                    } catch (e) {
                      alert('Invalid JSON: ' + e.message);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Format / Beautify</span>
                </button>

                <button
                  onClick={() => loadRawVaultFile(activeRawFile)}
                  disabled={rawEditorLoading}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
                >
                  Reload Original
                </button>
              </div>

              <button
                onClick={handleSaveRawVault}
                disabled={rawEditorLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{rawEditorLoading ? 'Committing...' : 'Commit Changes to Cloud Vault'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* =================================================================== */}
      {/* MODAL: ADD CLIENT USER */}
      {/* =================================================================== */}
      {createUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" />
                Register New Client Account
              </h3>
              <button onClick={() => setCreateUserModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="client@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Client Password</label>
                <input
                  type="text"
                  required
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="Set initial password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono uppercase text-amber-400">Secret 12-Digit Recovery Key</label>
                  <button
                    type="button"
                    onClick={() => setNewUserForm({ ...newUserForm, recoveryKey: generateNewKey() })}
                    className="text-[10px] font-mono text-sky-400 hover:underline cursor-pointer"
                  >
                    🎲 Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newUserForm.recoveryKey}
                  onChange={(e) => setNewUserForm({ ...newUserForm, recoveryKey: e.target.value })}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-xs font-mono font-bold text-amber-300 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                    <option value="partner">Enterprise Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="+91..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-sky-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs cursor-pointer shadow-md"
                >
                  Commit User to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: EDIT USER */}
      {/* =================================================================== */}
      {editUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-400" />
                Edit Account: {editUserModal.email}
              </h3>
              <button onClick={() => setEditUserModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editUserModal.fullName || ''}
                  onChange={(e) => setEditUserModal({ ...editUserModal, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Password</label>
                <input
                  type="text"
                  value={editUserModal.password || ''}
                  onChange={(e) => setEditUserModal({ ...editUserModal, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono uppercase text-amber-400">Secret 12-Digit Recovery Key</label>
                  <button
                    type="button"
                    onClick={() => setEditUserModal({ ...editUserModal, recoveryKey: generateNewKey() })}
                    className="text-[10px] font-mono text-sky-400 hover:underline cursor-pointer"
                  >
                    🎲 Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  value={editUserModal.recoveryKey || ''}
                  onChange={(e) => setEditUserModal({ ...editUserModal, recoveryKey: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-xs font-mono font-bold text-amber-300 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Role</label>
                  <select
                    value={editUserModal.role || 'client'}
                    onChange={(e) => setEditUserModal({ ...editUserModal, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                    <option value="partner">Enterprise Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Company</label>
                  <input
                    type="text"
                    value={editUserModal.company || ''}
                    onChange={(e) => setEditUserModal({ ...editUserModal, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditUserModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs cursor-pointer shadow-md"
                >
                  Save Changes to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: RECORD MANUAL PAYMENT */}
      {/* =================================================================== */}
      {createPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Record Offline / Manual Payment
              </h3>
              <button onClick={() => setCreatePaymentModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualPayment} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={newPaymentForm.clientName}
                  onChange={(e) => setNewPaymentForm({ ...newPaymentForm, clientName: e.target.value })}
                  placeholder="e.g. Acme Corp / John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Client Email</label>
                <input
                  type="email"
                  value={newPaymentForm.clientEmail}
                  onChange={(e) => setNewPaymentForm({ ...newPaymentForm, clientEmail: e.target.value })}
                  placeholder="client@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Amount (USD)</label>
                  <input
                    type="number"
                    value={newPaymentForm.amountUSD}
                    onChange={(e) => setNewPaymentForm({ ...newPaymentForm, amountUSD: e.target.value, amountINR: Math.round(e.target.value * 83.8) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    value={newPaymentForm.amountINR}
                    onChange={(e) => setNewPaymentForm({ ...newPaymentForm, amountINR: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Payment Method</label>
                <input
                  type="text"
                  value={newPaymentForm.method}
                  onChange={(e) => setNewPaymentForm({ ...newPaymentForm, method: e.target.value })}
                  placeholder="e.g. Direct Bank Swift / UPI / Cash"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">UTR / Transaction Hash</label>
                <input
                  type="text"
                  value={newPaymentForm.utr}
                  onChange={(e) => setNewPaymentForm({ ...newPaymentForm, utr: e.target.value })}
                  placeholder="Bank UTR or Tx Hash"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreatePaymentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs cursor-pointer shadow-md"
                >
                  Save Payment to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: IMAGE LIGHTBOX */}
      {/* =================================================================== */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Attached Payment Proof Screenshot (Full Resolution)
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={selectedImage}
                  target="_blank"
                  rel="noreferrer"
                  download="payment_screenshot.jpg"
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium flex items-center gap-1 border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  <span>Open Full ↗</span>
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-3 overflow-auto flex items-center justify-center bg-black/80 max-h-[80vh]">
              <img
                src={selectedImage}
                alt="Full Resolution Proof"
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
