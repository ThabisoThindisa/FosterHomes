
import { useEffect, useState } from 'react'
import styles from '../css/Admin.module.css'
import Header from '../SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar'
import Footer from '../SemanticElements/Footer'
import { addEntryRequest } from '../Helpers/HandleRequests'
import { useNavigate } from "react-router-dom";
import '../Admin Access/display.css'

export default function ManageUsers() {
  //const [Allusers, setAllUsers] = useState([])
 // const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
   const navigate = useNavigate();

    const [worker, setWorker] = useState({
     s_fullName: '',
     u_BirthID: '',
     u_email: '',
     u_phone: '',
     password: '',
     s_registration_number: '',
     s_organisation_name: '',
     s_office_location: '',
     s_specialisation: ''
  })

  async function Add_Workers(event) {
     event.preventDefault()
     setMessage('')
     setSubmitting(true)

     try {
       await addEntryRequest(worker, '/AddWorker')
       setWorker({
         s_fullName: '',
         u_BirthID: '',
         u_email: '',
         u_phone: '',
         password: '',
         s_registration_number: '',
         s_organisation_name: '',
         s_office_location: '',
         s_specialisation: ''
       })
       setMessage('Social worker added successfully.')
     } catch (error) {
       setMessage(error.message)
     } finally {
       setSubmitting(false)
     }
  }

  

  return (
     <>
       <NavigationBar />
       <main className="dashboard">
         <Header
           eyebrow="User management"
           title="ADD SOCIAL WORKERS."
           description=""
         />

         <section>
           <form>
             <label className={styles.DisplayLabel}>Add Social workers to the Platform.</label>
           </form>

          <form onSubmit={Add_Workers} className={styles.form}>
                      <h2>Social Worker information.</h2>
         
                      <input
                        required
                        maxLength={150}
                        placeholder="Full name"
                        value={worker.s_fullName}
                        onChange={(event) => setWorker({ ...worker, s_fullName: event.target.value })}
                      />
                      <input
                        required
                        placeholder="Birth ID"
                        value={worker.u_BirthID}
                        onChange={(event) => setWorker({ ...worker, u_BirthID: event.target.value })}
                      />
                      <input
                        required
                        type="email"
                        maxLength={255}
                        placeholder="Email address"
                        value={worker.u_email}
                        onChange={(event) => setWorker({ ...worker, u_email: event.target.value })}
                      />
                      <input
                        type="tel"
                        maxLength={20}
                        placeholder="Phone number (optional)"
                        value={worker.u_phone}
                        onChange={(event) => setWorker({ ...worker, u_phone: event.target.value })}
                      />
                      <input
                        required
                        type="password"
                        minLength={8}
                        placeholder="Initial password (at least 8 characters)"
                        value={worker.password}
                        onChange={(event) => setWorker({ ...worker, password: event.target.value })}
                      />
                      <input
                        required
                        maxLength={100}
                        placeholder="Registration number"
                        value={worker.s_registration_number}
                        onChange={(event) => setWorker({ ...worker, s_registration_number: event.target.value })}
                      />
                      <input
                        required
                        maxLength={200}
                        placeholder="Organisation name"
                        value={worker.s_organisation_name}
                        onChange={(event) => setWorker({ ...worker, s_organisation_name: event.target.value })}
                      />
                      <input
                        required
                        maxLength={255}
                        placeholder="Office location"
                        value={worker.s_office_location}
                        onChange={(event) => setWorker({ ...worker, s_office_location: event.target.value })}
                      />
                      <input
                        required
                        maxLength={255}
                        placeholder="Specialisation"
                        value={worker.s_specialisation}
                        onChange={(event) => setWorker({ ...worker, s_specialisation: event.target.value })}
                      />
         
                      {message && <p role="status">{message}</p>}
                      <button type="submit" className={styles.submitButton} disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add Social Worker'}
                      </button>
                    </form>
           <button className="pressBtn"
           
           onClick={() => navigate("/AllUsers")}>
            Back.
           </button>

         </section>
       </main>
       <Footer />
     </>
  )
}
