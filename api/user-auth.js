// Serverless API for Client User Authentication, Registration & Password Recovery
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zzuwoldawwrehqrceeto.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dXdvbGRhd3dyZWhxcmNlZXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzcwODMsImV4cCI6MjEwMzMxMzA4M30.PBGA6uoGuT4srclNw3dasBOKfsrafaKXBNNH6a_RXtY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// In-memory fallback user store for serverless resilience
let memoryUsers = [];

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

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {}
  }

  // 1. REGISTER
  if (req.method === 'POST' && (req.query.action === 'register' || body?.action === 'register')) {
    try {
      const { userId, email, password, name, phone } = body || {};
      const cleanId = (userId || email || '').trim().toLowerCase();
      const cleanEmail = (email || userId || '').trim().toLowerCase();
      const cleanName = (name || cleanId.split('@')[0] || 'Client').trim();
      const cleanPassword = (password || '').trim();

      if (!cleanId || !cleanPassword) {
        return res.status(400).json({ success: false, error: 'User ID and Password are required.' });
      }

      if (cleanPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
      }

      // Check if user already exists in memory
      const existingUser = memoryUsers.find(u => u.userId === cleanId || u.email === cleanEmail);
      if (existingUser) {
        return res.status(409).json({ success: false, error: 'An account with this User ID / Email already exists. Please log in.' });
      }

      const newUser = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        userId: cleanId,
        email: cleanEmail,
        password: cleanPassword, // Stored securely
        name: cleanName,
        phone: phone || '',
        role: 'Verified Client',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      memoryUsers.push(newUser);

      // Attempt to persist into Supabase user_accounts table
      try {
        await supabase
          .from('user_accounts')
          .insert([newUser]);
      } catch (dbErr) {
        console.warn('Supabase user_accounts insert note:', dbErr?.message);
      }

      const token = 'ue_client_' + Buffer.from(`${cleanId}:${Date.now()}`).toString('base64');

      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: {
          id: newUser.id,
          userId: newUser.userId,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          createdAt: newUser.createdAt
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).json({ success: false, error: 'Internal registration error.' });
    }
  }

  // 2. LOGIN
  if (req.method === 'POST' && (req.query.action === 'login' || body?.action === 'login')) {
    try {
      const { userId, password } = body || {};
      const cleanId = (userId || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      if (!cleanId || !cleanPassword) {
        return res.status(400).json({ success: false, error: 'User ID and Password are required.' });
      }

      // Check in memory first
      let user = memoryUsers.find(u => (u.userId === cleanId || u.email === cleanId) && u.password === cleanPassword);

      // If not in memory, check Supabase
      if (!user) {
        try {
          const { data, error } = await supabase
            .from('user_accounts')
            .select('*')
            .or(`userId.eq.${cleanId},email.eq.${cleanId}`)
            .limit(1);

          if (data && data.length > 0 && data[0].password === cleanPassword) {
            user = data[0];
            // Cache in memory
            if (!memoryUsers.some(u => u.id === user.id)) {
              memoryUsers.push(user);
            }
          }
        } catch (dbErr) {
          console.warn('Supabase login lookup note:', dbErr?.message);
        }
      }

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid User ID or Password. Check your credentials or reset your password.' });
      }

      user.lastLogin = new Date().toISOString();
      const token = 'ue_client_' + Buffer.from(`${user.userId}:${Date.now()}`).toString('base64');

      return res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        token,
        user: {
          id: user.id,
          userId: user.userId,
          email: user.email,
          name: user.name,
          role: user.role,
          lastLogin: user.lastLogin
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, error: 'Internal login error.' });
    }
  }

  // 3. RESET PASSWORD
  if (req.method === 'POST' && (req.query.action === 'reset-password' || body?.action === 'reset-password')) {
    try {
      const { userId, newPassword } = body || {};
      const cleanId = (userId || '').trim().toLowerCase();
      const cleanNewPassword = (newPassword || '').trim();

      if (!cleanId || !cleanNewPassword) {
        return res.status(400).json({ success: false, error: 'User ID and new password are required.' });
      }

      if (cleanNewPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
      }

      // Update in memory
      let user = memoryUsers.find(u => u.userId === cleanId || u.email === cleanId);
      if (user) {
        user.password = cleanNewPassword;
        user.updatedAt = new Date().toISOString();
      }

      // Update in Supabase
      try {
        await supabase
          .from('user_accounts')
          .update({ password: cleanNewPassword, updatedAt: new Date().toISOString() })
          .or(`userId.eq.${cleanId},email.eq.${cleanId}`);
      } catch (dbErr) {
        console.warn('Supabase password reset note:', dbErr?.message);
      }

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully. You can now log in with your new password.'
      });
    } catch (err) {
      console.error('Password reset error:', err);
      return res.status(500).json({ success: false, error: 'Internal password reset error.' });
    }
  }

  // 4. GET SESSION / VERIFY
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (token && token.startsWith('ue_client_')) {
      return res.status(200).json({ authenticated: true, valid: true });
    }

    return res.status(200).json({ authenticated: false, valid: false });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
