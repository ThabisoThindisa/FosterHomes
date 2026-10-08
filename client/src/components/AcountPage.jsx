import { HeartHandshake, Mail, ShieldCheck, UserRound } from 'lucide-react'
import NavBar from './SemanticElements/NavBar'
import styles from './css/AcountPage.module.css'
import { useState } from 'react';
import {addEntryRequest} from './Helpers/HandleRequests'


export default function AcountPage({ user }) {

const [applicant, setApplicant] = useState({
    user_id: user.id ,
    s_marital_status: '',
    s_occupation:  '',
    s_address:  '',
    s_adoption_preferences: ''
  })

  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)

  const name = user.name.trim()
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const role = user.role.replaceAll('_', ' ')

  async function updateAccount(event) {
    event.preventDefault()
    setMessage('')
    setHasError(false)
    setIsSaving(true)

    try {
       
      const data = await addEntryRequest(applicant, '/updateAccount')
      setApplicant({
        user_id: user.id ,
        s_marital_status: '',
        s_occupation:  '',
        s_address:  '',
        s_adoption_preferences: ''
      })

      setMessage(data.message || 'Account details updated.')
    } catch (error) {
      setHasError(true)
      setMessage(error.message)
    } finally {
      setIsSaving(false)
    }
  }


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

        <section className={styles.details} aria-labelledby="update-details-heading">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>
              <UserRound size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 id="update-details-heading">Update account details</h2>
              <p>Change the contact information saved to your account.</p>
            </div>
          </div>

          <form className={styles.accountForm} onSubmit={updateAccount}>
            <label>
              Marital status
              <input
                name="Marital"
                value={applicant.s_marital_status}
                onChange={(event) => setApplicant((current) => ({ ...current, s_marital_status: event.target.value }))}
                maxLength={150}
                required
              />
            </label>
            <label>
              Occupation
              <input
                name="occupation"
                type="occupation"
                value={applicant.s_occupation}
                onChange={(event) => setApplicant((current) => 
                    ({ ...current, s_occupation: event.target.value }))}
                maxLength={255}
                required
              />
            </label>
            <label>
              Address
              <input
                name="address"
                type="address"
                value={applicant.s_address}
                onChange={(event) => setApplicant((current) => ({ ...current, s_address: event.target.value }))}
                maxLength={20}
              />
            </label>

            <label>
              Adoption preferences
              <input
                name="preferences"
                type="preferences"     
                value={applicant.s_adoption_preferences}
                onChange={(event) => setApplicant((current) => ({ ...current, s_adoption_preferences: event.target.value }))}
                maxLength={20}
              />
            </label>

            <button className={styles.saveButton} type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
            {message && (
              <p className={hasError ? styles.formError : styles.formSuccess} role={hasError ? 'alert' : 'status'}>
                {message}
              </p>
            )}
          </form>
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