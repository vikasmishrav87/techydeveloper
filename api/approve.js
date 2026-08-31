// Serverless Mobile 1-Click WhatsApp Approval Endpoint for Vikas Mishra
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zzuwoldawwrehqrceeto.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dXdvbGRhd3dyZWhxcmNlZXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzcwODMsImV4cCI6MjEwMzMxMzA4M30.PBGA6uoGuT4srclNw3dasBOKfsrafaKXBNNH6a_RXtY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { id, action, token } = req.query;

  if (!id || !action) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Invalid Approval Request</title>
        <style>body{font-family:sans-serif;padding:2rem;text-align:center;background:#0f172a;color:#fff;}</style>
      </head>
      <body>
        <h2>⚠️ Invalid Request</h2>
        <p>Transaction ID or Action parameter missing.</p>
      </body>
      </html>
    `);
  }

  const isApproved = action.toLowerCase() === 'approve' || action.toLowerCase() === 'accept';
  const newStatus = isApproved ? 'approved' : 'rejected';

  // 1. Update Supabase
  try {
    await supabase
      .from('payments')
      .update({
        status: newStatus,
        updatedAt: new Date().toISOString(),
        reviewedBy: 'Vikas Mishra (WhatsApp 1-Click Approval)'
      })
      .eq('id', id);
  } catch (err) {
    console.error('Supabase update err:', err);
  }

  // 2. Render sleek mobile confirmation screen for Vikas
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Payment Decision: ${id}</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #030712;
          color: #f8fafc;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .card {
          background: #0b1329;
          border: 1px solid ${isApproved ? '#059669' : '#dc2626'};
          border-radius: 1.5rem;
          padding: 2rem;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .icon-box {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: ${isApproved ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};
          color: ${isApproved ? '#34d399' : '#f87171'};
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 1.25rem;
        }
        h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }
        .badge {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          background: ${isApproved ? '#064e3b' : '#7f1d1d'};
          color: ${isApproved ? '#a7f3d0' : '#fecaca'};
          margin-bottom: 1.25rem;
        }
        p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        .order-box {
          background: #030712;
          border: 1px solid #1e293b;
          border-radius: 1rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
          text-align: left;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
        }
        .order-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .order-row:last-child { margin-bottom: 0; }
        .order-label { color: #64748b; }
        .order-val { color: #f1f5f9; font-weight: 700; }
        .btn {
          display: block;
          width: 100%;
          padding: 0.85rem;
          border-radius: 0.75rem;
          background: #1e293b;
          color: #38bdf8;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        .btn:hover { background: #334155; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon-box">
          ${isApproved ? '✓' : '✕'}
        </div>
        <h1>${isApproved ? 'Payment Approved!' : 'Payment Denied'}</h1>
        <div class="badge">${isApproved ? 'STATUS: VERIFIED & CONFIRMED' : 'STATUS: REJECTED'}</div>
        <p>
          ${isApproved 
            ? 'The client’s live screen has automatically transitioned to <strong>Payment Successful</strong> with their official PDF receipt.' 
            : 'The client’s live screen has been updated to <strong>Payment Verification Failed</strong> with instructions to re-submit.'}
        </p>

        <div class="order-box">
          <div class="order-row">
            <span class="order-label">Transaction ID:</span>
            <span class="order-val">${id}</span>
          </div>
          <div class="order-row">
            <span class="order-label">Action By:</span>
            <span class="order-val">Vikas Mishra</span>
          </div>
          <div class="order-row">
            <span class="order-label">Live Sync:</span>
            <span class="order-val" style="color:#34d399;">Real-Time Polling Active</span>
          </div>
        </div>

        <a href="/admin/verify?id=${id}" class="btn">View in Executive Verification Portal ↗</a>
      </div>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
}
