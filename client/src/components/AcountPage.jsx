import { HeartHandshake, Mail, ShieldCheck, UserRound } from 'lucide-react'
import NavBar from './SemanticElements/NavBar'
import styles from './css/AcountPage.module.css'

export default function AcountPage({ user }) {
  const name = user.name.trim()
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const role = user.role.replaceAll('_', ' ')

  return (
    <>
      <NavBar />
      <main className={styles.page}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>Your private portal</p>
          <h1>My account</h1>
          <p>Review the information connected to your Thindisa FosterHome account.</p>
        </header>

        <section className={styles.profile} aria-labelledby="profile-heading">
          <div className={styles.avatar} aria-hidden="true">{initials}</div>
          <div className={styles.profileCopy}>
            <p className={styles.profileLabel}>Foster home community</p>
            <h2 id="profile-heading">{name}</h2>
            <p>{role}</p>
          </div>
          <div className={styles.protected}>
            <ShieldCheck size={18} aria-hidden="true" />
            <span>Protected account</span>
          </div>
        </section>

        <section className={styles.details} aria-labelledby="details-heading">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>
              <UserRound size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 id="details-heading">Account details</h2>
              <p>Your account information currently on file.</p>
            </div>
          </div>

          <dl className={styles.detailList}>
            <div className={styles.detailRow}>
              <dt>Name</dt>
              <dd>{name}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt><Mail size={16} aria-hidden="true" /> Email address</dt>
              <dd>{user.email}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt><HeartHandshake size={16} aria-hidden="true" /> Portal role</dt>
              <dd>{role}</dd>
            </div>
          </dl>
        </section>

        <aside className={styles.note}>
          <HeartHandshake size={21} aria-hidden="true" />
          <div>
            <h2>Your journey, all in one place</h2>
            <p>Use the portal navigation to explore our programs and community.</p>
          </div>
        </aside>
      </main>
    </>
  )
}