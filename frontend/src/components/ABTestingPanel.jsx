import { useState } from 'react';

const card = { background: 'rgba(15,20,35,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem', backdropFilter: 'blur(12px)' };
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' };
const taBase = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.85rem 1.1rem', color: '#f1f5f9', fontSize: '0.92rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s', resize: 'vertical', lineHeight: 1.7 };

export default function ABTestingPanel({ generatedVariants }) {
  const hasVariants = generatedVariants && generatedVariants.length >= 2;
  const [varA, setVarA] = useState(hasVariants ? generatedVariants[0].text : 'AI tools are transforming marketing at unprecedented speed.');
  const [varB, setVarB] = useState(hasVariants ? generatedVariants[1].text : 'Marketing teams must adopt AI now or risk falling behind.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCompare = async () => {
    setLoading(true); setResult(null);
    try {
      const res = await fetch('/api/ab-test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ variantA: varA, variantB: varB }) });
      const data = await res.json();
      setResult(data.result);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleRecord = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const score = result.winner === 'A' ? result.scoreA : result.scoreB;
      await fetch('/api/metrics/record-demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ winner: result.winner, score }) });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch { }
    finally { setSaving(false); }
  };

  const taStyle = (field) => ({ ...taBase, borderColor: focusedField === field ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.08)', boxShadow: focusedField === field ? '0 0 0 3px rgba(249,115,22,0.08)' : 'none' });

  const winnerA = result?.winner === 'A';
  const winnerB = result?.winner === 'B';

  return (
    <div style={{ width: '100%' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}} @keyframes popIn{0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '999px', padding: '0.3rem 0.9rem', marginBottom: '1rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f97316' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ML Predictor</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#f1f5f9', marginBottom: '0.5rem' }}>A/B Performance Predictor</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Use our ML model and heuristics to predict which copy will outperform the other.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
        {[{id:'A', val:varA, set:setVarA, color:'#3b82f6'},{id:'B', val:varB, set:setVarB, color:'#a855f7'}].map(({ id, val, set, color }) => (
          <div key={id} style={{ ...card, border: result ? `1px solid ${id === result.winner ? '#22c55e40' : 'rgba(255,255,255,0.07)'}` : '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden', transition: 'border-color 0.5s' }}>
            {result && id === result.winner && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,#22c55e,transparent)' }} />}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.95rem', color }}>
                  {id}
                </div>
                <label style={{ ...labelStyle, margin: 0 }}>Variant {id}</label>
              </div>
              {result && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '999px', background: id === result.winner ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.07)', border: `1px solid ${id === result.winner ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.2)'}`, animation: 'popIn 0.5s ease forwards' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: id === result.winner ? '#22c55e' : '#ef4444' }}>
                    {id === result.winner ? '🏆 Winner' : '—'} {(id === 'A' ? result.scoreA : result.scoreB)?.toFixed(3)}
                  </span>
                </div>
              )}
            </div>
            <textarea rows={6} value={val} onChange={e => set(e.target.value)}
              onFocus={() => setFocusedField(id)} onBlur={() => setFocusedField(null)}
              style={taStyle(id)} />
          </div>
        ))}
      </div>

      <button onClick={handleCompare} disabled={loading || !varA.trim() || !varB.trim()} style={{ width: '100%', padding: '1.1rem', background: loading ? 'rgba(249,115,22,0.25)' : 'linear-gradient(135deg,#f97316,#ec4899)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '1.05rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 6px 24px rgba(249,115,22,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', transition: 'all 0.3s', marginBottom: result ? '2rem' : 0 }}>
        {loading ? <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Simulating Matchup...</> : '⚔️ Simulate A/B Matchup'}
      </button>

      {result && (
        <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
          {/* Winner banner */}
          <div style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.04))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#22c55e,transparent)' }} />
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#22c55e', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Variant {result.winner} Wins!</h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>{result.explanation}</p>
          </div>

          {/* Score comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
            {[{id:'A',score:result.scoreA,color:'#3b82f6'},{id:'B',score:result.scoreB,color:'#a855f7'}].map(({ id, score, color }) => (
              <div key={id} style={{ ...card, textAlign: 'center', border: `1px solid ${id === result.winner ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.07)'}` }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>Variant {id} Score</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: id === result.winner ? '#22c55e' : '#f1f5f9', letterSpacing: '-0.03em', marginBottom: '0.8rem' }}>{score?.toFixed(3) || '—'}</div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((score || 0) * 100, 100)}%`, height: '100%', background: id === result.winner ? 'linear-gradient(90deg,#22c55e,#4ade80)' : `linear-gradient(90deg,${color}80,${color})`, borderRadius: '999px', transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleRecord} disabled={saving || saved} style={{ width: '100%', padding: '1rem', background: saved ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${saved ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '14px', color: saved ? '#22c55e' : '#94a3b8', fontSize: '0.95rem', fontWeight: 600, cursor: saving || saved ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {saving ? <><div style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#94a3b8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Saving...</> : saved ? '✓ Saved as Training Data' : '💾 Save as Synthetic Campaign Data'}
          </button>
        </div>
      )}
    </div>
  );
}
