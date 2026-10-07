import { CheckCircle2, HeartHandshake, ShieldCheck } from 'lucide-react'
import Header from "./SemanticElements/Header";
import NavBar from "./SemanticElements/NavBar";
import LogoImage from '../images/logo.png';

export default function Dashboard({ user, onLogout }) {
  return <><NavBar />
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="brand">
          <img
            src={LogoImage}
            alt="Thindisa FosterHome logo"
            className="dashboard-logo"
          />
          Thindisa Foster Home
        </div>
        <button className="logout" onClick={onLogout}>Sign out</button>
      </header>
      <Header
        eyebrow="Your private portal"
        title={`Welcome, ${user.name.split(' ')[0]}.`}
        description="We will keep your next steps clear, considered, and in one place."
      />
      <section className="status-grid">
        <article>
          <CheckCircle2 size={22} />
          <span>
            <strong>Profile created</strong>
            <small>Your account is ready for the next step.</small>
          </span>
        </article>
        <article>
          <HeartHandshake size={22} />
          <span>
            <strong>Adoption pathway</strong>
            <small>Your role: {user.role.replace('_', ' ')}</small>
          </span>
        </article>
        <article>
          <ShieldCheck size={22} />
          <span>
            <strong>Account protected</strong>
            <small>{user.email}</small>
          </span>
        </article>
      </section>
    </main>
  </>
}
