import nodemailer from 'nodemailer';

// In-memory OTP storage for serverless runtime
global._ACTIVE_EMAIL_OTPS = global._ACTIVE_EMAIL_OTPS || new Map();

// Gmail SMTP Credentials (from Environment variables or configured fallback)
const GMAIL_USER = process.env.GMAIL_USER || 'vikasmishraoffice87@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || ''; // 16-character Google App Password

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body || {};
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!GMAIL_APP_PASSWORD) {
      return res.status(500).json({ 
        error: 'Gmail App Password is not yet configured. Please provide your 16-character Google App Password.' 
      });
    }

    // 1. Generate real 6-digit random code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 2. Save in active store
    global._ACTIVE_EMAIL_OTPS.set(cleanEmail, {
      code: otpCode,
      expiresAt,
      attempts: 0
    });

    // 3. Create Gmail SMTP Transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD.replace(/\s+/g, '') // remove any spaces
      }
    });

    // 4. Send HTML Email
    const info = await transporter.sendMail({
      from: `"The Unfiltered Engineer" <${GMAIL_USER}>`,
      to: cleanEmail,
      subject: `🔐 ${otpCode} is your verification code — The Unfiltered Engineer`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #030712; color: #f8fafc; margin: 0; padding: 30px 15px; }
            .card { max-width: 500px; margin: 0 auto; background: #0B1120; border: 1px solid #1e293b; border-radius: 20px; padding: 36px 28px; }
            .badge { display: inline-block; padding: 4px 14px; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 9999px; color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            h1 { color: #ffffff; font-size: 22px; font-weight: 800; margin: 16px 0 8px; }
            p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
            .code-box { background: #030712; border: 2px solid #38bdf8; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
            .code-text { font-family: monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; }
            .footer { color: #64748b; font-size: 11px; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 28px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">The Unfiltered Engineer</span>
            <h1>Email Verification Code</h1>
            <p>Your one-time verification code is below. It will expire in <strong>10 minutes</strong>.</p>
            <div class="code-box">
              <div class="code-text">${otpCode}</div>
            </div>
            <p style="font-size: 12px; color: #cbd5e1;">If you did not request this code, you can safely ignore this email.</p>
            <div class="footer">
              The Unfiltered Engineer • Founded by Vikas Mishra<br>
              Direct Line: +918369804739 • Telegram: @Yourstrulyvikasmishra
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log(`[Gmail SMTP] Sent to ${cleanEmail}, messageId: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Gmail SMTP send error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to send email via Gmail SMTP.' 
    });
  }
}
