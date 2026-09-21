import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

//import the pages
import Login from './components/Login';
import NavBar from './components/NavBar';
import Register from './components/Register';
import Programs from './components/Programs';
import Header from './components/Header'
import Gallery from './components/Gallery';
import HomePage from './components/homePage';
import Testimonials from './components/Testimonials'

import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './styles/animations.css';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(API_URL + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong.');
  return data;
}

function App() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    request('/auth/me').then((data) => setUser(data.user)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event, authMode) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      const data = await request('/auth/' + authMode, { method: 'POST', body: JSON.stringify(body) });
      setUser(data.user);
      if (authMode === 'login') navigate('/home');
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  async function logout() {
    await request('/auth/logout', { method: 'POST' });
    setUser(null);
    setMode('login');
  }

  if (loading) return <div className="loading-screen">Loading your portal...</div>;
  if (user) return <Dashboard user={user} onLogout={logout} />;

  return (

    
    <main className="shell" >
      {/* This will handle the left display of the signing and regisger pages */}
      <section className="intro-panel">
        <div className="brand"><span className="brand-mark"><HeartHandshake size={20} /></span> Thindisa Foster Home</div>
        <div className="intro-copy">
          <p className="eyebrow"><Sparkles size={14} /> Your Journey Starts Here</p>
          <h1>Hope, Love, and a Place to Belong</h1>
          <p className="intro-text">A private, guided space for families and professionals moving through adoption with care.</p>
        </div>
        <div className="trust-note"><ShieldCheck size={20} /><span>Your details are protected with encrypted sessions and secure account access.</span></div>
      </section>
      <section className="form-panel">
        <div className="form-wrap">
          {mode === 'login' ? (
            <Login error={error} onSubmit={(event) => handleSubmit(event, 'login')} onRegister={() => { setMode('register'); setError(''); }} />
          ) : (
            <Register error={error} onSubmit={(event) => handleSubmit(event, 'register')} onLogin={() => { setMode('login'); setError(''); }} />
          )}
        </div>
      </section>
    </main>
  );
}
{}
function Dashboard({ user, onLogout }) {
  return <><NavBar onLogout={onLogout} /><main className="dashboard">
    <header className="dashboard-header">
      <div className="brand"><span className="brand-mark"><HeartHandshake size={20} />
      </span> Thindisa Foster Home
      </div>
      <button className="logout" onClick={onLogout}>Sign out</button>
      </header><section className="welcome"><p className="eyebrow">Your private portal</p>
      <h1>Welcome, {user.name.split(' ')[0]}.</h1><p>We will keep your next steps clear, considered, and in one place.</p></section><section className="status-grid"><article><CheckCircle2 size={22} />
      <span><strong>Profile created</strong>
      <small>Your account is ready for the next step.</small>
      </span></article><article><HeartHandshake size={22} />
      <span><strong>Adoption pathway</strong><small>Your role: {user.role.replace('_', ' ')}
        </small></span></article><article><ShieldCheck size={22} /><span><strong>Account protected</strong><small>{user.email}</small></span>
      </article></section></main></>;
}

createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <BrowserRouter>
    <Routes>

      {/*Use route to direct to the navigation bar*/}
      <Route path="/" element={<App />} />
      <Route path="/header" element={<Header />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/Testimonials" element={<Testimonials />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
</React.StrictMode>);
