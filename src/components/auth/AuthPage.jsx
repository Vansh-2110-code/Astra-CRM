import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Sparkles, ShieldCheck, Mail, Lock, User, Building, ArrowRight, CheckCircle2, Key } from 'lucide-react';

const AuthPage = ({ onBackToLanding }) => {
  const { login, signup } = useCRM();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setAuthError('');
    
    // Simulate 2FA prompt for enterprise admins
    if (!show2FA && email.includes('admin')) {
      setShow2FA(true);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setAuthError(err.response?.data?.error || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !company) return;
    setAuthError('');
    setLoading(true);
    try {
      await signup({ email, password, name, company });
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail, userRole) => {
    setEmail(userEmail);
    setPassword('admin123');
    login(userEmail, 'admin123');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0b0f19 70%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="btn btn-secondary"
          style={{
            position: 'absolute',
            top: '24px',
            left: '36px',
            zIndex: 10,
            borderRadius: '12px',
            padding: '10px 18px',
            fontSize: '0.85rem',
            fontWeight: '700'
          }}
        >
          ← Back to Interactive Cover Page
        </button>
      )}

      {/* Decorative Glow Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '36px',
        borderRadius: '24px',
        background: 'rgba(17, 24, 39, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.5)'
          }}>
            <Sparkles style={{ color: '#fff', width: '28px', height: '28px' }} />
          </div>

          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ASTRA CRM
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            {mode === 'login' ? 'Sign in to access your sales workspace' : 'Provision your multi-tenant sales organization'}
          </p>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            {!show2FA ? (
              <>
                <div className="form-group">
                  <label className="form-label">Work Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '38px', width: '100%' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Account Password</label>
                    <button type="button" onClick={() => setMode('forgot')} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', cursor: 'pointer' }}>
                      Forgot?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '38px', width: '100%' }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">Two-Factor Authentication (2FA) Code</label>
                <div style={{ position: 'relative' }}>
                  <Key style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#fbbf24' }} />
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit TOTP code (e.g. 849201)"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '38px', width: '100%', letterSpacing: '0.2em', fontWeight: '800' }}
                  />
                </div>
              </div>
            )}

            {authError && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', fontSize: '0.85rem', marginTop: '12px', textAlign: 'center' }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn gradient-btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', marginTop: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', opacity: loading ? 0.7 : 1 }}
            >
              <span>{loading ? 'Authenticating...' : show2FA ? 'Verify 2FA & Enter Portal' : 'Sign In to Astra CRM'}</span>
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px', width: '100%' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <div style={{ position: 'relative' }}>
                <Building style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Tech"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px', width: '100%' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Work Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="sarah@apexglobal.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px', width: '100%' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Create Master Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="Min 12 chars, special & numbers"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px', width: '100%' }}
                />
              </div>
            </div>

            {authError && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', fontSize: '0.85rem', marginBottom: '14px', textAlign: 'center' }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn gradient-btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', marginTop: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', opacity: loading ? 0.7 : 1 }}
            >
              <span>{loading ? 'Creating Workspace...' : 'Onboard & Launch Workspace'}</span>
              <CheckCircle2 style={{ width: '18px', height: '18px' }} />
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Enter your work email address below to receive an encrypted reset link.
            </p>
            <div className="form-group">
              <label className="form-label">Work Email Address</label>
              <input type="email" placeholder="sarah@apexglobal.io" className="form-input" />
            </div>
            <button onClick={() => alert('Password reset token dispatched to email.')} className="btn gradient-btn-primary" style={{ width: '100%' }}>
              Send Reset Instructions
            </button>
          </div>
        )}



        {/* Toggle Mode Footer */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {mode === 'login' ? (
            <span>
              New organization?{' '}
              <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: '700', cursor: 'pointer' }}>
                Onboard Company
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: '700', cursor: 'pointer' }}>
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
