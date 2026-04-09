import { useState } from 'react';
import GeneratorCard from './components/GeneratorCard';
import SentimentDashboard from './components/SentimentDashboard';
import ABTestingPanel from './components/ABTestingPanel';
import MetricsPanel from './components/MetricsPanel';
import SlackPanel from './components/SlackPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import HomeDashboard from './components/HomeDashboard';
import LoginScreen from './components/LoginScreen';
import WebScraperCard from './components/WebScraperCard';
import LinearLanding from './components/LinearLanding';
import CampaignPipeline from './components/CampaignPipeline';
import CompetitorIntelligence from './components/CompetitorIntelligence';
import { Home, LogOut, Sparkles } from 'lucide-react';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [generatedItems, setGeneratedItems] = useState([]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: 'var(--bg-color)', overflow: 'hidden'}}>
      
      {/* If Home, show the full-screen landing page independently */}
      {activeTab === 'home' ? (
        <LinearLanding onNavigate={setActiveTab} />
      ) : (
        <>
          {/* Persistent Left Sidebar for Dashboard Views */}
          <aside className="sidebar fade-in" style={{
            width: '300px', 
            flexShrink: 0, 
            borderRight: '1px solid var(--panel-border)', 
            background: 'rgba(13, 17, 23, 0.5)',
            display: 'flex', 
            flexDirection: 'column', 
            padding: '1.8rem 1.2rem',
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto'
          }}>
            
            {/* Logo */}
            <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0 0.5rem', marginBottom: '3rem'}}>
              <div style={{background: 'rgba(75, 159, 255, 0.1)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '10px', display: 'flex'}}>
                <Sparkles size={22} />
              </div>
              <h2 onClick={() => setActiveTab('home')} style={{cursor: 'pointer', fontSize: '1.35rem', fontWeight: 700, margin: 0, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                AI Optimizer
              </h2>
            </div>
    
            {/* Navigation Links */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem'}}>
              <div style={{fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '0.6rem', paddingLeft: '0.8rem'}}>Navigation</div>
              <button className={`sidebar-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><Home size={20} /> Home Dashboard</button>
              
              <div style={{fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1.5px', marginTop: '2rem', marginBottom: '0.6rem', paddingLeft: '0.8rem'}}>Marketing Tools</div>
              <button className={`sidebar-btn ${activeTab === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveTab('pipeline')}>🚀 Campaign Autopilot</button>
              <button className={`sidebar-btn ${activeTab === 'generate' ? 'active' : ''}`} onClick={() => setActiveTab('generate')}>✍️ Content Generator</button>
              <button className={`sidebar-btn ${activeTab === 'scraper' ? 'active' : ''}`} onClick={() => setActiveTab('scraper')}>🌍 Web Scraper</button>
              <button className={`sidebar-btn ${activeTab === 'sentiment' ? 'active' : ''}`} onClick={() => setActiveTab('sentiment')}>💬 Sentiment Engine</button>
              <button className={`sidebar-btn ${activeTab === 'abtest' ? 'active' : ''}`} onClick={() => setActiveTab('abtest')}>🆚 A/B Predictor</button>
              
              <div style={{fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1.5px', marginTop: '2rem', marginBottom: '0.6rem', paddingLeft: '0.8rem'}}>System & Data</div>
              <button className={`sidebar-btn ${activeTab === 'competitor' ? 'active' : ''}`} onClick={() => setActiveTab('competitor')}>🔍 Competitor Intel</button>
              <button className={`sidebar-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>🏆 Gamified Analytics</button>
              <button className={`sidebar-btn ${activeTab === 'metrics' ? 'active' : ''}`} onClick={() => setActiveTab('metrics')}>⚒️ Model Hub</button>
              <button className={`sidebar-btn ${activeTab === 'slack' ? 'active' : ''}`} onClick={() => setActiveTab('slack')}>🔔 Slack Sync</button>
            </div>
    
            {/* User Profile / Logout (Bottom of Sidebar) */}
            <div style={{marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                   <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0 0.5rem'}}>
                   <div style={{width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '1rem'}}>A</div>
                   <div style={{minWidth: 0}}>
                     <div style={{fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis'}}>Admin User</div>
                     <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis'}}>admin@company.com</div>
                   </div>
                </div>
               <button onClick={() => setIsAuthenticated(false)} className="logout-btn" style={{padding: '0.5rem', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', width: '100%', marginTop: '0.5rem'}}>
                 <LogOut size={16} /> Sign Out
               </button>
            </div>
          </aside>
    
          {/* Main Content Area */}
          <main style={{flex: 1, minWidth: 0, padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', width: '100%', overflowY: 'auto', height: '100vh', boxSizing: 'border-box'}}>
            <div className="fade-in" style={{animationDelay: '0.2s', width: '100%'}}>
              {activeTab === 'pipeline' && <CampaignPipeline />}
              {activeTab === 'generate' && <GeneratorCard onGenerated={setGeneratedItems} />}
              {activeTab === 'scraper' && <WebScraperCard onGenerated={setGeneratedItems} />}
              {activeTab === 'sentiment' && <SentimentDashboard initialVariants={generatedItems} />}
              {activeTab === 'abtest' && <ABTestingPanel generatedVariants={generatedItems} />}
              {activeTab === 'competitor' && <CompetitorIntelligence />}
              {activeTab === 'analytics' && <AnalyticsDashboard />}
              {activeTab === 'metrics' && <MetricsPanel />}
              {activeTab === 'slack' && <SlackPanel />}
            </div>
          </main>
        </>
      )}

    </div>
  );
}

export default App;
