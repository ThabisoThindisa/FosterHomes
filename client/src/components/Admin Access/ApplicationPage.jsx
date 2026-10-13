import { useState, useEffect } from 'react'

import styles from '../css/Testimonials.module.css'
import Header from '../SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar'
import Footer from '../SemanticElements/Footer'
import { HandleGetList } from '../Helpers/HandleRequests'

export default function ApplicationPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getApplications = async () => {
      try {
        const applicationList = await HandleGetList('/getAdoptionApplications')
        setApplications(applicationList)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    getApplications()
  }, [])

  const formatDate = (value) => {
    if (!value) return 'N/A'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <NavigationBar />
      <main className="dashboard">
        <Header
          eyebrow="Adoption"
          title="View Applications"
          description="Review all adoption applications submitted by social workers and assigned programs."
        />

        <section style={{ padding: '1.5rem 0' }}>
          <label className={styles.DisplayLabel}>All adoption applications</label>
        </section>

        <section style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          {loading ? (
            <p>Loading applications...</p>
          ) : error ? (
            <p style={{ color: 'crimson' }}>Error: {error}</p>
          ) : applications.length === 0 ? (
            <p>No adoption applications found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#eef3f8' }}>
                  <th style={tableCellStyle}>Application ID</th>
                  <th style={tableCellStyle}>Social Worker</th>
                  <th style={tableCellStyle}>Program</th>
                  <th style={tableCellStyle}>Date</th>
                  <th style={tableCellStyle}>Status</th>
                  <th style={tableCellStyle}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.application_id}>
                    <td style={tableCellStyle}>{application.application_id}</td>
                    <td style={tableCellStyle}>{application.social_worker_name || 'Unknown worker'}</td>
                    <td style={tableCellStyle}>{application.program_name || 'Unassigned'}</td>
                    <td style={tableCellStyle}>{formatDate(application.application_date)}</td>
                    <td style={tableCellStyle}>{application.status || 'Pending'}</td>
                    <td style={tableCellStyle}>{application.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

const tableCellStyle = {
  border: '1px solid #d5dfe8',
  padding: '0.75rem 1rem',
  textAlign: 'left',
  verticalAlign: 'top'
}
