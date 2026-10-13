import { useEffect, useState } from 'react'
import Header from '../SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar'
import Footer from '../SemanticElements/Footer'
import { HandleGetList } from '../Helpers/HandleRequests'
import styles from '../css/UserQueries.module.css'

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

function formatStatus(status) {
  if (!status) return 'New'
  return status.replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export default function UserQueries() {
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isCurrent = true

    async function loadQueries() {
      setLoading(true)
      setError('')

      try {
        const result = await HandleGetList('/getEnquiries')
        if (isCurrent) setQueries(Array.isArray(result) ? result : [])
      } catch (loadError) {
        if (isCurrent) setError(loadError.message || 'Failed to load user queries.')
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    loadQueries()
    return () => {
      isCurrent = false
    }
  }, [reloadKey])

  return (
    <>
      <NavigationBar />
      <main className="dashboard">
        <Header
          eyebrow="User messages"
          title="USER QUERIES"
          description="Review questions and messages sent through the contact form."
        />

        <section className={styles.page} aria-label="User queries">
          {!loading && !error && (
            <p className={styles.count}>
              {queries.length} {queries.length === 1 ? 'query' : 'queries'}
            </p>
          )}

          {loading && <p className={styles.feedback} role="status">Loading user queries...</p>}

          {error && (
            <div className={`${styles.feedback} ${styles.error}`} role="alert">
              <p>{error}</p>
              <button type="button" onClick={() => setReloadKey((current) => current + 1)}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && queries.length === 0 && (
            <p className={styles.empty}>There are no user queries yet.</p>
          )}

          {!loading && !error && queries.length > 0 && (
            <div className={styles.list}>
              {queries.map((query) => (
                <article className={styles.card} key={query.enquiry_id}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h2>{query.subject || 'No subject'}</h2>
                      <p className={styles.sender}>
                        {query.full_name} <span aria-hidden="true">·</span>{' '}
                        <a href={`mailto:${query.email}`}>{query.email}</a>
                      </p>
                    </div>
                    <span className={styles.status}>{formatStatus(query.status)}</span>
                  </div>

                  <p className={styles.message}>{query.message}</p>

                  <div className={styles.details}>
                    {query.phone && <a href={`tel:${query.phone}`}>{query.phone}</a>}
                    <time dateTime={query.created_at}>{formatDate(query.created_at)}</time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
