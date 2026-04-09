import { useState } from 'react';
import { Sparkles, ArrowRight, Lock } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    // Simulate a secure API login delay
    setTimeout(() => {
      setLoading(false);
      onLogin(); // Accept any email/password
    }, 1200);
  };

   return (
    <div style={{minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
      
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px', 
        background: 'radial-gradient(circle, rgba(111,66,193,0.15) 0%, rgba(0,0,0,0) 70%)',
        top: '-10%', left: '-10%', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', width: '600px', height: '600px', 
        background: 'radial-gradient(circle, rgba(75,159,255,0.15) 0%, rgba(0,0,0,0) 70%)',
        bottom: '-10%', right: '-10%', zIndex: 0
      }} />

      <div className="glass-panel fade-in" style={{width: '100%', maxWidth: '520px', padding: '4rem', position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'}}>
        
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <div style={{display: 'inline-flex', background: 'rgba(75,159,255,0.1)', padding: '1.2rem', borderRadius: '24px', color: 'var(--primary)', marginBottom: '1.5rem'}}>
            <Sparkles size={40} />
          </div>
          <h1 style={{fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.8rem'}}>Welcome Back</h1>
          <p style={{color: 'var(--text-muted)', fontSize: '1.1rem'}}>Sign in to your AI Marketing Workspace</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{marginBottom: '1.8rem'}}>
            <label style={{fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem'}}>Work Email</label>
            <input 
              type="email" 
              required
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.2rem', fontSize: '1.1rem'}}
            />
          </div>

          <div className="form-group" style={{marginBottom: '2.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
              <label style={{fontSize: '1rem', color: 'rgba(255,255,255,0.7)'}}>Password</label>
              <span style={{fontSize: '0.9rem', color: 'var(--primary)', cursor: 'pointer'}}>Forgot?</span>
            </div>
            <div style={{position: 'relative'}}>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.2rem', paddingRight: '40px', fontSize: '1.1rem'}}
              />
              <Lock size={20} style={{position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)'}} />
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{width: '100%', padding: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem'}}>
            {loading ? <><span className="loader" style={{width: '20px', height: '20px'}}></span> Authenticating...</> : <>Sign In <ArrowRight size={20} /></>}
          </button>
        </form>

        <div style={{textAlign: 'center', marginTop: '2.5rem', fontSize: '1rem', color: 'var(--text-muted)'}}>
          Don't have an enterprise account? <span style={{color: 'var(--primary)', fontWeight: 600, cursor: 'pointer'}}>Contact Sales</span>
        </div>
      </div>
    </div>
  );
}
