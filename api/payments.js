// Serverless API for Managing Real-Time Payment Submissions, Approvals & Verification
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zzuwoldawwrehqrceeto.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dXdvbGRhd3dyZWhxcmNlZXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzcwODMsImV4cCI6MjEwMzMxMzA4M30.PBGA6uoGuT4srclNw3dasBOKfsrafaKXBNNH6a_RXtY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fallback in-memory store for instantaneous warm serverless operations
let memoryPayments = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Fetch payment by ID or list all pending payments
  if (req.method === 'GET') {
    const { id } = req.query;

    if (id) {
      // Find in memory
      let payment = memoryPayments.find(p => p.id === id);

      // Also try querying Supabase if available
      if (!payment) {
        try {
          const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('id', id)
            .single();
          if (data && !error) {
            payment = data;
          }
        } catch (e) {}
      }

      if (!payment) {
        return res.status(404).json({ success: false, error: 'Payment record not found' });
      }

      return res.status(200).json({
        success: true,
        payment
      });
    }

    // Return all payments (latest first)
    return res.status(200).json({
      success: true,
      count: memoryPayments.length,
      payments: memoryPayments
    });
  }

  // 2. POST: Submit a new payment verification request
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
      const orderId = body.id || ('TXN-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900));

      const newPayment = {
        id: orderId,
        amountUSD: Number(body.amountUSD) || 0,
        amountINR: Number(body.amountINR) || 0,
        currency: body.currency || 'USD',
        method: body.method || 'UPI QR Scanner',
        network: body.network || '',
        clientName: body.clientName || 'Valued Client',
        clientEmail: body.clientEmail || '',
        clientPhone: body.clientPhone || '',
        service: body.service || 'Custom Engineering Scope / Milestone Retainer',
        utr: body.utr || body.txHash || '',
        screenshot: body.screenshot || '', // Base64 or URL
        status: 'pending', // 'pending' | 'approved' | 'rejected'
        rejectionReason: '',
        clientIp,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to in-memory store
      memoryPayments.unshift(newPayment);
      if (memoryPayments.length > 500) memoryPayments.pop();

      // Attempt Supabase insert
      try {
        await supabase.from('payments').insert([newPayment]);
      } catch (err) {
        console.error('Supabase write notice:', err?.message);
      }

      return res.status(201).json({
        success: true,
        message: 'Payment verification submitted successfully',
        payment: newPayment
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // 3. PATCH / PUT: Update status (Approve / Reject)
  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const { id, status, reason, secret } = body;

      if (!id || !status) {
        return res.status(400).json({ error: 'Missing payment ID or status' });
      }

      // Find in memory
      let payment = memoryPayments.find(p => p.id === id);

      if (payment) {
        payment.status = status;
        payment.rejectionReason = reason || '';
        payment.updatedAt = new Date().toISOString();
      } else {
        payment = {
          id,
          status,
          rejectionReason: reason || '',
          updatedAt: new Date().toISOString()
        };
        memoryPayments.unshift(payment);
      }

      // Update Supabase
      try {
        await supabase
          .from('payments')
          .update({ status, rejectionReason: reason || '', updatedAt: new Date().toISOString() })
          .eq('id', id);
      } catch (e) {}

      return res.status(200).json({
        success: true,
        message: `Payment status updated to ${status}`,
        payment
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
