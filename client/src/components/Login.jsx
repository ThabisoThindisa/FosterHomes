import { ArrowRight } from 'lucide-react';

export default function Login({ error, onSubmit, onRegister }) {
  return (
    <>
      <div className="form-heading"><p className="eyebrow">Welcome</p>
      <h2>Sign in to your portal</h2>
      <p>Continue where you left off.</p></div>

      <div className="mode-switch" role="tablist">
        <button className="active">Sign in</button>
        <button onClick={onRegister}>Register</button>
      </div>
      
      <form onSubmit={onSubmit}>
        <label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
        <label>Password<input name="password" type="password" placeholder="At least 8 characters" minLength="8" required /></label>
        {error && <div className="error" role="alert">{error}</div>}
        <button className="submit-button" type="submit">Enter portal <ArrowRight size={18} /></button>
      </form>
      <p className="fine-print">By continuing, you agree to keep your account information accurate and private.</p>
    </>
  );
}
