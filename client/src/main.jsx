import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import SiteLogo from './images/logo.png'


//import the pages
import Login from './components/Login';
import NavBar from './components/SemanticElements/NavBar';
import Register from './components/Register';
import Programs from './components/Programs'
import Header from './components/SemanticElements/Header'
import Gallery from './components/Gallery'
import Testimonial from './components/Testimonials'
import HomePage from './components/HomePage'
import Contact from './components/Contact'
import AdminPag from './components/Admin'
import Dashboard from './components/Dashboard'

import './styles/animations.css';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong.');
  return data;
}

function App() {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    request('/auth/me').then((data) =>
       setUser(data.user)).catch(() => {})
    .finally(() => setLoading(false));
    
  }, []);

  async function handleSubmit(event, authMode) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      const data = await request('/auth/'+authMode, 
        { method: 'POST', 
          body: JSON.stringify(body) 
        });

      setUser(data.user);
      navigate('/HomePage', { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  async function logout() {
    await request('/auth/logout', { method: 'POST' });
    setUser(null);
    setMode('login');
  }


  //Route path and links
  if (loading) return <div className="loading-screen">Loading your portal...</div>;
  if (user) return <Routes>
    <Route path="/HomePage" element={<HomePage />} />
    <Route path="/programs" element={<ProgramsPage />} />
    <Route path="/Gallery" element={<Gallery />} />
    <Route path="/logout" element={<Dashboard />} />
    <Route path="/Testimonial" element={<Testimonial />} />
    <Route path="/Admin" element={<AdminPag />} />
    <Route path="/contacts" element={<Contact />} />
    <Route path="/dashboard" element={<Dashboard user={user} onLogout={logout} />} />
    <Route path="*" element={<Navigate to="/HomePage" replace />} />
  </Routes>;

  return (

    
    <main className="shell" >
      {/* This will handle the left display of the signing and regisger pages */}
      <section className="intro-panel">
        {/*Logo*/}
        <div className="brand"><span className="brand-mark"><HeartHandshake size={20} /></span> Thindisa Foster Home</div>
        <div className="intro-copy">
          <p className="eyebrow"><Sparkles size={14} /> Your Journey Starts Here</p>
          <h1>Hope, Love, and a Place to Belong</h1>
          <p className="intro-text">A private, guided space for families and professionals moving through adoption with care.</p>
        </div>
        
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

function ProgramsPage() {
  return <><NavBar /><main className="dashboard">
    <Header
      eyebrow="Explore your options"
      title="Programs"
      description="Review the support and care pathways available to your family."
    />
      <Programs /></main></>;
}

createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </React.StrictMode>);
