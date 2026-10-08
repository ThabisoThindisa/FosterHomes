import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import SiteLogo from './images/logo.png'


//import the pages
import Login from './components/Login';
import NavBar from './components/SemanticElements/NavBar';
import Register from './components/Register';
import Programs from './components/Portal options/Programs'
import Header from './components/SemanticElements/Header'
import Gallery from './components/Portal options/Gallery'
import StoriesPage from './components/Portal options/StoriesPage'
import HomePage from './components/HomePage'
import Contact from './components/Contact'
import AdminPag from './components/Admin'
import Dashboard from './components/Dashboard'
import AcountPage from './components/AcountPage'
import AddChildPage from './components/Admin Access/AddChildren'
import AddWorkerPage from './components/Admin Access/AddSocialWorker'


import './styles/animations.css';
//Import admin pages
import FosterHomesP from './components/Admin Access/DisplayHomes';
import AdoptionPage from './components/Admin Access/ManageAdoptions';
import UserPage from './components/Admin Access/ManageUsers'
import { API_URL } from './components/Helpers/HandleRequests'


async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  let data = await response.json().catch(() => ({}));
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
    <Route path="/programs" element={<Programs />} />
    <Route path="/Gallery" element={<Gallery />} />
    <Route path="/logout" element={<Dashboard />} />
    <Route path="/OurStories" element={<StoriesPage />} />
    <Route path="/Admin" element={<AdminPag />} />
    
    {/*Admin pages */}
    <Route path="/fosterHomes" element={<FosterHomesP />} />
    <Route path="/ChildManage" element={<AddChildPage />} />
    <Route path="/SocialWorkers" element={<AddWorkerPage />} />

    <Route path="/adoption" element={<AdoptionPage />} />
    <Route path="/AllUsers" element={<UserPage />} />
    
    <Route path="/contacts" element={<Contact />} />
    <Route path="/dashboard" element={<Dashboard user={user} onLogout={logout} />} />
    <Route path="/account" element={<AcountPage user={user} />} />
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

createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </React.StrictMode>);
