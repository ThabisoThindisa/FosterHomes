import React from 'react';
import { ArrowRight } from 'lucide-react';
import classroomImage from '../images/kids-futuristic-school-classroom.jpg';

export default function Register({ error, onSubmit, onLogin }) {
  return (
    <div className="register-form" style={{ backgroundImage: 'linear-gradient(rgba(252,250,245,.9), rgba(252,250,245,.9)), url(' + classroomImage + ')' }}>
      <div className="form-heading"><p className="eyebrow">Welcome</p><h2>Create your account</h2><p>Start your adoption journey with a private profile.</p></div>
      <div className="mode-switch" role="tablist"><button onClick={onLogin}>Sign in</button><button className="active">Register</button></div>
      <form onSubmit={onSubmit}>
        <label>Full name<input name="fullName" placeholder="Your full name" required /></label>
        <label>Birth ID<input name="birthId" placeholder="Your birth ID" required /></label>
        <label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
        <label>Phone number <span className="optional">optional</span><input name="phone" type="tel" placeholder="071 234 5678" /></label>
        <label>Password<input name="password" type="password" placeholder="At least 8 characters" minLength="8" required /></label>
        {error && <div className="error" role="alert">{error}</div>}
        <button className="submit-button" type="submit">Create profile <ArrowRight size={18} /></button>
      </form>
      <p className="fine-print">By continuing, you agree to keep your account information accurate and private.</p>
    </div>
  );
}
