import { useState, useEffect } from 'react'

import styles from '../css/Testimonials.module.css'
import Header from '../SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar'
import Footer from '../SemanticElements/Footer'
import { HandleGetList, updateEntryRequest } from '../Helpers/HandleRequests'
import { useNavigate } from "react-router-dom";

export default function ApplicationPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState({})
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const navigate = useNavigate();

 const ReviewStatus = [
  'submitted',
  'under_review',
  'assessment',
  'approved',
  'matched',
  'completed',
  'rejected',
  'withdrawn'
];

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

  const handleStatusChange = async (applicationId, newStatus) => {
    if (!newStatus) {
      setStatusMessage('Select a status before updating.')
      return
    }

    setUpdatingApplicationId(applicationId)
    setStatusMessage('')
    try {
      await updateEntryRequest(
        { status: newStatus },
        `/updateApplicationStatus/${applicationId}`
      )
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.application_id === applicationId
            ? { ...application, status: newStatus }
            : application
        )
      )
      setStatusMessage(`Application #${applicationId} status updated.`)
    } catch (updateError) {
      setStatusMessage(updateError.message)
    } finally {
      setUpdatingApplicationId(null)
    }
  }


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
          {statusMessage && <p role="status">{statusMessage}</p>}
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
                  <th style={tableCellStyle}>Review</th>
                  <th style={tableCellStyle}></th>
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
                    <td style={tableCellStyle}>
                   <select
                    value={selectedStatus[application.application_id] ?? application.status ?? ''}
                    onChange={(e) => setSelectedStatus((currentStatus) => ({
                      ...currentStatus,
                      [application.application_id]: e.target.value
                    }))}
                    style={{padding: '8px',borderRadius: '5px',border: '1px solid #ccc', width: '100%'}}
  >
                   <option value="">Select Status</option>

    {ReviewStatus.map((name, index) => (
      <option key={index} value={name}>
        {name}</option>))} 
        </select></td> 
        <th ><button type="button"
    disabled={updatingApplicationId === application.application_id}
    onClick={() =>
      handleStatusChange(
        application.application_id,
        selectedStatus[application.application_id] ?? application.status
      )
    }
        >{updatingApplicationId === application.application_id ? 'Updating...' : 'Update Status'}</button></th>
        </tr>))}
              </tbody>
            </table>
          )}
        </section>

        <section>
               <button 
      
    style={{
    backgroundColor: '#4175af',color: 'white',border: 'none',padding: '22px 24px',borderRadius: '8px',fontSize: '16px',
    fontWeight: '600',marginTop: '10px',marginRight: '10px',cursor: 'pointer'
  }}
      
      onClick={() => navigate("/Admin")}>Return to Admin access.
      </button>

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


const Presbutton ={
    backgroundColor: '#4175af',
    color: 'white',
    border: 'none',
    padding: '2px 4px',
    borderRadius: '8px',
     fontSize: '15px',
  }
