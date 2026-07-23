import React, { useState, useEffect, useRef } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Kanban,
  FileText,
  Headphones,
  Users,
  Building,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  Play,
  Globe,
  Award,
  Star,
  Activity,
  Layers,
  Shield,
  Wallet,
  LogIn
} from 'lucide-react';

const LandingPage = ({ onNavigateToAuth, onQuickLogin }) => {
  const { login } = useCRM();
  const canvasRef = useRef(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeFeatureTab, setActiveFeatureTab] = useState('pipeline');
  const [showQuickModal, setShowQuickModal] = useState(false);

  // 3D Canvas Interactive Particle Sphere & Grid Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Particles & Nodes
    const particleCount = 70;
    const particles = [];
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 100,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#a855f7' : '#38bdf8',
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: Math.random() * 0.5 + 0.2
      });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      angleY = (mouse.x - width / 2) * 0.0003;
      angleX = (mouse.y - height / 2) * 0.0003;

      const fov = 400;
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw background ambient 3D glowing radial gradient
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        50,
        centerX,
        centerY,
        width * 0.7
      );
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      gradient.addColorStop(1, 'rgba(11, 15, 25, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Project & draw 3D particle sphere
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 3D Rotation Math
        let cosY = Math.cos(angleY);
        let sinY = Math.sin(angleY);
        let cosX = Math.cos(angleX);
        let sinX = Math.sin(angleX);

        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        let y1 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        p.z -= p.vz;
        if (p.z < 100) p.z = 900;

        const scale = fov / (fov + z2);
        const projX = x1 * scale + centerX;
        const projY = y1 * scale + centerY;
        const projR = p.radius * scale * 1.5;

        projected.push({ x: projX, y: projY, scale, color: p.color });

        if (projX > 0 && projX < width && projY > 0 && projY < height) {
          ctx.beginPath();
          ctx.arc(projX, projY, Math.max(0.5, projR), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, Math.max(0.1, scale * 0.8));
          ctx.fill();
        }
      }

      // Connect 3D node lines between nearby particles
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 0.6;

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleLaunchDemo = (email) => {
    if (onQuickLogin) {
      onQuickLogin(email);
    } else if (onNavigateToAuth) {
      onNavigateToAuth();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#0b0f19',
      color: '#fff',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* 3D Canvas Background Container */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      {/* TOP NAVIGATION HEADER */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '76px',
        background: 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        zIndex: 100
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.5)'
          }}>
            <Sparkles style={{ color: '#fff', width: '24px', height: '24px' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: '900', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ASTRA CRM
            </span>
            <span style={{ fontSize: '0.65rem', color: '#a5b4fc', fontWeight: '800', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Enterprise Suite
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
          <a href="#architecture" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>Zero-Trust Security</a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing & Plans</a>
          <a href="#portal" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>Customer Portal</a>
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setShowQuickModal(true)}
            className="btn btn-secondary"
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.875rem',
              fontWeight: '700'
            }}
          >
            <span>Instant 1-Click Demo</span>
          </button>

          <button
            onClick={onNavigateToAuth}
            className="btn gradient-btn-primary"
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '700',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
            }}
          >
            <span>Launch Platform</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        paddingTop: '160px',
        paddingBottom: '100px',
        paddingLeft: '48px',
        paddingRight: '48px',
        maxWidth: '1280px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Micro Security Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '30px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#a5b4fc',
          fontSize: '0.8rem',
          fontWeight: '700',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)'
        }}>
          <ShieldCheck style={{ width: '16px', height: '16px', color: '#818cf8' }} />
          <span>SOC2 TYPE II & HIPAA COMPLIANT • ZERO-TRUST MULTI-TENANT ARCHITECTURE</span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: '4.2rem',
          fontWeight: '900',
          lineHeight: 1.1,
          letterSpacing: '-0.04em',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc 70%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Accelerate Sales Operations & Automate Customer Lifecycles
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#94a3b8',
          maxWidth: '820px',
          margin: '0 auto 40px auto',
          lineHeight: 1.6
        }}>
          The enterprise multi-tenant CRM designed for B2B product sales teams. Featuring drag-and-drop pipeline forecasting, multi-currency quotation engines, dynamic RBAC matrices, and a self-service customer portal.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '60px' }}>
          <button
            onClick={() => handleLaunchDemo('sarah.jenkins@apexglobal.io')}
            className="btn gradient-btn-primary"
            style={{
              padding: '16px 36px',
              borderRadius: '16px',
              fontSize: '1.05rem',
              fontWeight: '800',
              boxShadow: '0 12px 35px rgba(99, 102, 241, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Play style={{ width: '20px', height: '20px', fill: '#fff' }} />
            <span>Launch Live Interactive App</span>
          </button>

          <button
            onClick={() => setShowQuickModal(true)}
            className="btn btn-secondary"
            style={{
              padding: '16px 32px',
              borderRadius: '16px',
              fontSize: '1.05rem',
              fontWeight: '700',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Users style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
            <span>Explore 6 System Roles</span>
          </button>
        </div>

        {/* 3D FLOATING GLASSMORTIC DASHBOARD MOCKUP SHOWCASE */}
        <div style={{
          perspective: '1200px',
          position: 'relative',
          marginTop: '20px'
        }}>
          <div style={{
            transform: 'rotateX(8deg) scale(0.96)',
            transition: 'all 0.5s ease',
            borderRadius: '24px',
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.9), 0 0 50px rgba(99, 102, 241, 0.25)',
            backdropFilter: 'blur(20px)'
          }}>
            {/* Live Interactive Feature Switcher Bar */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveFeatureTab('pipeline')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: activeFeatureTab === 'pipeline' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                  background: activeFeatureTab === 'pipeline' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(0,0,0,0.3)',
                  color: activeFeatureTab === 'pipeline' ? '#818cf8' : '#94a3b8',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Kanban style={{ width: '16px', height: '16px' }} />
                <span>Sales Pipeline Kanban</span>
              </button>

              <button
                onClick={() => setActiveFeatureTab('quotes')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: activeFeatureTab === 'quotes' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                  background: activeFeatureTab === 'quotes' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(0,0,0,0.3)',
                  color: activeFeatureTab === 'quotes' ? '#c084fc' : '#94a3b8',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FileText style={{ width: '16px', height: '16px' }} />
                <span>Quotation & Invoice Builder</span>
              </button>

              <button
                onClick={() => setActiveFeatureTab('portal')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: activeFeatureTab === 'portal' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  background: activeFeatureTab === 'portal' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.3)',
                  color: activeFeatureTab === 'portal' ? '#34d399' : '#94a3b8',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Headphones style={{ width: '16px', height: '16px' }} />
                <span>Customer Self-Service Portal</span>
              </button>
            </div>

            {/* Simulated Live Preview Screen */}
            <div style={{
              background: '#0f172a',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'left',
              border: '1px solid rgba(255,255,255,0.1)',
              minHeight: '340px'
            }}>
              {activeFeatureTab === 'pipeline' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>Enterprise Sales Pipeline Kanban</h3>
                    <span className="badge badge-purple">Weighted Forecast: $695,000</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#60a5fa', marginBottom: '10px' }}>QUALIFIED (75% Win)</div>
                      <div className="glass-card" style={{ padding: '12px', marginBottom: '10px', background: 'var(--bg-secondary)' }}>
                        <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>BioGenetics Cloud Overhaul</div>
                        <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '700', marginTop: '4px' }}>$280,000</div>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#c084fc', marginBottom: '10px' }}>PROPOSAL SENT (85% Win)</div>
                      <div className="glass-card" style={{ padding: '12px', marginBottom: '10px', background: 'var(--bg-secondary)' }}>
                        <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>OmniTech Bulk Hardware</div>
                        <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '700', marginTop: '4px' }}>$180,000</div>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#34d399', marginBottom: '10px' }}>CLOSED WON (100%)</div>
                      <div className="glass-card" style={{ padding: '12px', marginBottom: '10px', background: 'var(--bg-secondary)' }}>
                        <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>Heavy Machinery Telemetry</div>
                        <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '700', marginTop: '4px' }}>$220,000</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'quotes' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>Quotation & Invoice Builder</h3>
                    <span className="badge badge-emerald">PDF Generator Ready</span>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '800' }}>QT-2026-880 • Acme Corporation</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Astra CRM Enterprise License x 2 Seats</div>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#34d399' }}>$49,137</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Automatic GST/VAT taxes computed • Discount tier: 8% • Extended 24-month warranty terms.
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'portal' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>Customer Portal Support Queue</h3>
                    <span className="badge badge-blue">SLA Guarantee: 2hr Resolution</span>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-purple">TCK-9401</span>
                      <span className="badge badge-amber">Open Ticket</span>
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>Database Sync Latency Timeout</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Submitted by Dr. Aris Thorne (BioGenetics) • Assigned SLA Engineer: Marcus Vance
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ZERO-TRUST SECURITY & AUDIT VAULT SECTION */}
      <section id="architecture" style={{
        position: 'relative',
        zIndex: 10,
        padding: '80px 48px',
        maxWidth: '1280px',
        margin: '0 auto',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(99, 102, 241, 0.05) 50%, rgba(15, 23, 42, 0) 100%)',
        borderRadius: '32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Enterprise Zero-Trust Security Framework
          </span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-0.03em', marginTop: '6px' }}>
            Zero-Trust Security & Audit Vault
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '720px', margin: '12px auto 0 auto' }}>
            Bank-grade data isolation, encrypted payload transmission, and real-time security audit telemetry.
          </p>
        </div>

        {/* Security Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '40px' }}>
          
          <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', borderLeft: '4px solid #6366f1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '12px', borderRadius: '12px' }}>
                <Lock style={{ color: '#818cf8', width: '24px', height: '24px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Strict Tenant Context Lockdown</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              JWT claims are strictly decrypted on every incoming HTTP request. Tenant isolation parameters (<code style={{ color: '#818cf8' }}>decoded.tenantId</code>) cannot be overridden by frontend headers, guaranteeing 100% data boundary integrity between organizations.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', borderLeft: '4px solid #a855f7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '12px', borderRadius: '12px' }}>
                <ShieldCheck style={{ color: '#c084fc', width: '24px', height: '24px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Dynamic 6-Role RBAC Scoping</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Fine-grained permission matrices for Super Admin, Sales Manager, Sales Executive, HR Manager, Operations Head, and Customer Users. Employees strictly see data relevant to their domain.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '12px', borderRadius: '12px' }}>
                <Activity style={{ color: '#38bdf8', width: '24px', height: '24px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Immutable Audit Log Vault</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Every security-critical operation—including data exports, policy modifications, password resets, and role assignments—is captured with timestamping and client IP origin logs.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '12px' }}>
                <Shield style={{ color: '#34d399', width: '24px', height: '24px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>2FA Enforcement & IP Whitelisting</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Mandatory two-factor authentication codes for privileged enterprise accounts, configurable session inactivity timeouts, and static IP whitelist restrictions.
            </p>
          </div>

        </div>

        {/* Live Interactive Security Log Stream Terminal */}
        <div style={{
          background: '#090d16',
          borderRadius: '20px',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '24px',
          fontFamily: 'monospace',
          fontSize: '0.825rem',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ color: '#94a3b8', marginLeft: '8px', fontWeight: '700' }}>live-audit-telemetry-stream.log</span>
            </div>
            <span className="badge badge-emerald">STATUS: ACTIVE SECURE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#a5b4fc' }}>
            <div><span style={{ color: '#34d399' }}>[2026-07-23 21:58:02] INFO</span> JWT Claim Decrypted • tenantId: <span style={{ color: '#fbbf24' }}>"tenant-sanna-001"</span> • roleId: <span style={{ color: '#c084fc' }}>"role-admin"</span> • scope: <span style={{ color: '#60a5fa' }}>"FULL_SUPER_ADMIN"</span></div>
            <div><span style={{ color: '#34d399' }}>[2026-07-23 21:58:14] AUTH</span> 2FA Validation Passed • email: <span style={{ color: '#fff' }}>"sarah.jenkins@apexglobal.io"</span> • method: <span style={{ color: '#38bdf8' }}>"TOTP_AUTHENTICATOR"</span></div>
            <div><span style={{ color: '#38bdf8' }}>[2026-07-23 21:58:30] RBAC</span> Evaluated Permission Check • resource: <span style={{ color: '#fff' }}>"/api/salary"</span> • role: <span style={{ color: '#c084fc' }}>"role-hr"</span> • result: <span style={{ color: '#34d399' }}>"GRANTED (manage_salary)"</span></div>
            <div><span style={{ color: '#fbbf24' }}>[2026-07-23 21:59:01] SEC_VAULT</span> Encrypted Log Saved • action: <span style={{ color: '#fff' }}>"EXPORT_SALARY_DATA"</span> • severity: <span style={{ color: '#ef4444' }}>"HIGH"</span> • hash: <span style={{ color: '#94a3b8' }}>"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"</span></div>
          </div>
        </div>
      </section>

      {/* DEDICATED CUSTOMER SELF-SERVICE PORTAL SECTION */}
      <section id="portal" style={{
        position: 'relative',
        zIndex: 10,
        padding: '80px 48px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Client Self-Service Experience
          </span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-0.03em', marginTop: '6px' }}>
            B2B Customer Self-Service Portal
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '750px', margin: '12px auto 0 auto' }}>
            Empower your enterprise corporate clients to raise support tickets, track SLA countdowns, review quotes, and access contract documents.
          </p>
        </div>

        {/* Portal Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '50px' }}>
          
          <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', borderTop: '4px solid #10b981' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '14px', width: 'fit-content', marginBottom: '16px' }}>
              <Headphones style={{ color: '#34d399', width: '24px', height: '24px' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '10px' }}>Instant Ticket & Complaint Desk</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Customers submit technical issues, attach logs, monitor real-time ticket progress, and receive instant status notifications from support engineers.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', borderTop: '4px solid #38bdf8' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '12px', borderRadius: '14px', width: 'fit-content', marginBottom: '16px' }}>
              <Award style={{ color: '#38bdf8', width: '24px', height: '24px' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '10px' }}>SLA Guarantee Telemetry</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Guaranteed resolution turnaround times based on SLA tiers: Platinum 1hr SLA, Gold 2hr SLA, Silver, and Standard B2B support guarantees.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', borderTop: '4px solid #a855f7' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '12px', borderRadius: '14px', width: 'fit-content', marginBottom: '16px' }}>
              <FileText style={{ color: '#c084fc', width: '24px', height: '24px' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '10px' }}>Quote & Invoice Inspection</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Corporate clients review itemized product quotes, approve customized proposals, track warranty terms, and process instant online payments.
            </p>
          </div>

        </div>

        {/* Interactive Customer Login Callout Banner */}
        <div className="glass-panel" style={{
          padding: '36px',
          borderRadius: '24px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '800', textTransform: 'uppercase' }}>TRY CLIENT PORTAL EXPERIENCE</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0 6px 0' }}>Log In as Customer Persona</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Test the client portal experience directly as Dr. Aris Thorne (CTO of BioGenetics Lab Solutions).
            </p>
          </div>

          <button
            onClick={() => handleLaunchDemo('a.thorne@biogenetics.org')}
            className="btn gradient-btn-primary"
            style={{ padding: '14px 28px', borderRadius: '14px', fontSize: '0.95rem', fontWeight: '800' }}
          >
            <span>Launch Customer Portal Demo</span>
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      </section>

      {/* PRICING MATRIX SECTION */}
      <section id="pricing" style={{
        position: 'relative',
        zIndex: 10,
        padding: '80px 48px',
        maxWidth: '1280px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Transparent Enterprise SaaS Plans
        </span>
        <h2 style={{ fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-0.03em', marginTop: '6px', marginBottom: '16px' }}>
          Flexible Pricing for Every Scale
        </h2>

        {/* Pricing Billing Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '50px' }}>
          <span style={{ fontSize: '0.9rem', color: billingCycle === 'monthly' ? '#fff' : 'var(--text-muted)', fontWeight: '700' }}>Monthly Billing</span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            style={{
              width: '54px',
              height: '28px',
              borderRadius: '20px',
              background: '#6366f1',
              border: 'none',
              padding: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: billingCycle === 'yearly' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fff' }} />
          </button>
          <span style={{ fontSize: '0.9rem', color: billingCycle === 'yearly' ? '#fff' : 'var(--text-muted)', fontWeight: '700' }}>
            Annual Billing <span className="badge badge-emerald" style={{ marginLeft: '6px' }}>20% OFF</span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
          
          {/* Starter Plan */}
          <div className="glass-card" style={{ padding: '36px', borderRadius: '24px', textAlign: 'left', borderTop: '4px solid #a855f7' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>Starter Plan</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>For growing sales teams up to 10 seats.</p>
            
            <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#fff', marginBottom: '24px' }}>
              ${billingCycle === 'yearly' ? '79' : '99'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ month</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <CheckCircle2 style={{ color: '#34d399', width: '16px', height: '16px' }} />
                <span>Up to 10 Seats Included</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <CheckCircle2 style={{ color: '#34d399', width: '16px', height: '16px' }} />
                <span>Lead & Pipeline Kanban</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <CheckCircle2 style={{ color: '#34d399', width: '16px', height: '16px' }} />
                <span>Quotation Engine</span>
              </div>
            </div>

            <button onClick={onNavigateToAuth} className="btn btn-secondary" style={{ width: '100%', padding: '12px' }}>
              Select Starter
            </button>
          </div>

          {/* Professional Plan */}
          <div className="glass-card" style={{
            padding: '36px',
            borderRadius: '24px',
            textAlign: 'left',
            borderTop: '4px solid #10b981',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(17, 24, 39, 0.9) 100%)',
            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Professional</h3>
              <span className="badge badge-emerald">MOST POPULAR</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>For mid-size sales ops up to 25 seats.</p>
            
            <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#fff', marginBottom: '24px' }}>
              ${billingCycle === 'yearly' ? '239' : '299'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ month</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <CheckCircle2 style={{ color: '#34d399', width: '16px', height: '16px' }} />
                <span>Up to 25 Seats Included</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <CheckCircle2 style={{ color: '#34d399', width: '16px', height: '16px' }} />
                <span>Orders, Invoices & WhatsApp API</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <CheckCircle2 style={{ color: '#34d399', width: '16px', height: '16px' }} />
                <span>Customer Support Portal Desk</span>
              </div>
            </div>

            <button onClick={onNavigateToAuth} className="btn gradient-btn-primary" style={{ width: '100%', padding: '12px' }}>
              Get Started Now
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-card" style={{ padding: '36px', borderRadius: '24px', textAlign: 'left', borderTop: '4px solid #6366f1' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>Enterprise</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>Unlimited seats with custom isolation.</p>
            
            <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#fff', marginBottom: '24px' }}>
              ${billingCycle === 'yearly' ? '639' : '799'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ month</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <CheckCircle2 style={{ color: '#34d399', width: '16px', height: '16px' }} />
                <span>50 Seats & Unlimited Records</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <CheckCircle2 style={{ color: '#34d399', width: '16px', height: '16px' }} />
                <span>Zero-Trust Security & Audit Logs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <CheckCircle2 style={{ color: '#34d399', width: '16px', height: '16px' }} />
                <span>Dedicated Account Manager & 24/7 SLA</span>
              </div>
            </div>

            <button onClick={onNavigateToAuth} className="btn btn-secondary" style={{ width: '100%', padding: '12px' }}>
              Contact Enterprise Sales
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '40px 48px',
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles style={{ color: '#6366f1', width: '20px', height: '20px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>ASTRA CRM Enterprise Platform</span>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © 2026 Astra CRM SaaS Inc. All rights reserved. SOC2 Type II Certified.
        </div>
      </footer>

      {/* 1-CLICK DEMO LOGIN MODAL */}
      {showQuickModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '32px', maxWidth: '520px', borderRadius: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <LogIn style={{ color: '#fff', width: '24px', height: '24px' }} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>1-Click Interactive Demo Login</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Select a persona role to instantly enter the live application.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => { setShowQuickModal(false); handleLaunchDemo('sarah.jenkins@apexglobal.io'); }}
                className="btn gradient-btn-primary"
                style={{ padding: '12px', justifyContent: 'space-between', borderRadius: '12px' }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>Sarah Jenkins (Super Admin)</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Full platform access to all modules & data</div>
                </div>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                onClick={() => { setShowQuickModal(false); handleLaunchDemo('marcus.vance@sales.apex.io'); }}
                className="btn btn-secondary"
                style={{ padding: '12px', justifyContent: 'space-between', borderRadius: '12px' }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>Marcus Vance (Sales Manager)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sales pipeline, quotation engine & analytics</div>
                </div>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                onClick={() => { setShowQuickModal(false); handleLaunchDemo('alex.rivera@sales.apex.io'); }}
                className="btn btn-secondary"
                style={{ padding: '12px', justifyContent: 'space-between', borderRadius: '12px' }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>Alex Rivera (Sales Executive)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lead management, call tasks & deal creation</div>
                </div>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                onClick={() => { setShowQuickModal(false); handleLaunchDemo('a.thorne@biogenetics.org'); }}
                className="btn btn-secondary"
                style={{ padding: '12px', justifyContent: 'space-between', borderRadius: '12px' }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>Dr. Aris Thorne (Customer)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer self-service portal & ticket queue</div>
                </div>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button onClick={() => setShowQuickModal(false)} className="btn btn-secondary" style={{ padding: '8px 20px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
