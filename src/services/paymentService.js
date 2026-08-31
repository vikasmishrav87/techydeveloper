// Payment Verification & Real-Time Approval Engine
import { supabase } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'ue_client_active_payment_v1';
const VIKAS_WHATSAPP_NUMBER = '919137507092';

/**
 * Submit a new payment verification request
 */
export async function submitPaymentVerification({
  amountUSD,
  amountINR,
  currency = 'USD',
  method = 'UPI QR Scanner',
  network = '',
  clientName,
  clientEmail,
  clientPhone = '',
  service = 'Custom Engineering Scope / Milestone Retainer',
  utr,
  screenshot = ''
}) {
  const orderId = 'TXN-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);

  const paymentRecord = {
    id: orderId,
    amountUSD: Number(amountUSD) || 0,
    amountINR: Number(amountINR) || 0,
    currency,
    method,
    network,
    clientName: clientName || 'Valued Client',
    clientEmail: clientEmail || '',
    clientPhone: clientPhone || '',
    service,
    utr: utr || '',
    screenshot: screenshot || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 1. Save to Client LocalStorage for seamless browser session restore
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(paymentRecord));
  } catch (e) {}

  // 2. Submit to Serverless Backend API
  try {
    fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentRecord)
    }).catch(err => console.error('API submission notice:', err));
  } catch (e) {}

  // 3. Submit directly to Supabase as fallback
  try {
    supabase.from('payments').insert([paymentRecord]).then(() => {}).catch(() => {});
  } catch (e) {}

  return paymentRecord;
}

/**
 * Check real-time payment status by ID
 */
export async function checkPaymentStatus(orderId) {
  if (!orderId) return null;

  // 1. Try Serverless API first
  try {
    const res = await fetch(`/api/payments?id=${orderId}&t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.payment) {
        // Update local session
        const current = getActiveClientPayment();
        if (current && current.id === orderId) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...current, ...data.payment }));
        }
        return data.payment;
      }
    }
  } catch (e) {}

  // 2. Try Supabase fallback
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', orderId)
      .single();
    if (data && !error) {
      const current = getActiveClientPayment();
      if (current && current.id === orderId) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...current, ...data }));
      }
      return data;
    }
  } catch (e) {}

  // 3. Fallback to LocalStorage
  return getActiveClientPayment();
}

/**
 * Retrieve current active payment in browser
 */
export function getActiveClientPayment() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Clear active payment session
 */
export function clearActiveClientPayment() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {}
}

/**
 * Generate formatted WhatsApp message for Vikas Mishra
 */
export function generateWhatsAppApprovalMessage(payment) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://theunfilteredengineer.vercel.app';
  const approveUrl = `${origin}/api/approve?id=${payment.id}&action=approve&token=vikas87`;
  const denyUrl = `${origin}/api/approve?id=${payment.id}&action=deny&token=vikas87`;
  const adminPortalUrl = `${origin}/admin/verify?id=${payment.id}`;

  const message = `🔔 *NEW PAYMENT SUBMITTED FOR EXECUTIVE APPROVAL* 🔔

📋 *Order ID:* ${payment.id}
💰 *Amount:* $${payment.amountUSD?.toLocaleString()} USD (₹${payment.amountINR?.toLocaleString()} INR)
💳 *Gateway:* ${payment.method} ${payment.network ? `(${payment.network})` : ''}
👤 *Client Name:* ${payment.clientName}
📧 *Email:* ${payment.clientEmail}
${payment.clientPhone ? `📱 *Phone:* ${payment.clientPhone}\n` : ''}🔢 *UTR / TxID / Ref:* \`${payment.utr}\`
🎯 *Engagement:* ${payment.service}

━━━━━━━━━━━━━━━━━━━━
👉 *1-CLICK EXECUTIVE ACTIONS:*

✅ *APPROVE PAYMENT:*
${approveUrl}

❌ *DENY / REJECT PAYMENT:*
${denyUrl}

🔍 *View Full Proof & Screenshot in Portal:*
${adminPortalUrl}
━━━━━━━━━━━━━━━━━━━━
_Note: Tapping Approve will instantly update the client's screen to Payment Successful with receipt._`;

  return encodeURIComponent(message);
}

/**
 * Open WhatsApp with prefilled approval request to Vikas Mishra
 */
export function triggerWhatsAppApprovalAlert(payment) {
  const encodedText = generateWhatsAppApprovalMessage(payment);
  const waUrl = `https://wa.me/${VIKAS_WHATSAPP_NUMBER}?text=${encodedText}`;
  if (typeof window !== 'undefined') {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }
  return waUrl;
}
