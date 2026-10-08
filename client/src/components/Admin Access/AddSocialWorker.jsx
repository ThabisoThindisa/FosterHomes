
import { useEffect, useState } from 'react'
import styles from '../css/Admin.module.css'
import Header from '../SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar'
import Footer from '../SemanticElements/Footer'
import { delete_Users, HandleGetList, addEntryRequest } from '../Helpers/HandleRequests'
import { useNavigate } from "react-router-dom";
import '../Admin Access/display.css'

export default function ManageUsers() {
  const [Allusers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
   const navigate = useNavigate();

  const [child, setChild] = useState({
     C_fullName: '',
     c_reference_code: '',
     c_date_of_birth: '',
     c_gender: '',
     status: 'in_care',
     special_needs: ''
  })

    const [worker, setWorker] = useState({
     s_fullName: '',
     s_registration_number: '',
     s_organisation_name: '',
     s_office_location: '',
     s_specialisation: ''
  })

  async function Add_Workers(event) {
     event.preventDefault()

     try {
       const indexSocialW = await addEntryRequest(worker, '/AddWorker')
       setAllUsers((currentW) => [...currentW, indexSocialW])
       setWorker({
         s_fullName: '',
         s_registration_number: '',
         s_organisation_name: '',
         s_office_location: '',
         s_specialisation: ''
       })
       setMessage('Social worker added successfully.')
     } catch (error) {
       setMessage(error.message)
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
                        placeholder="Social worker Name"
                        value={worker.s_fullName}
                        onChange={(event) => setWorker({ ...worker, s_fullName: event.target.value })}
                      />
                      <input
                        required
                        placeholder="Registration number"
                        value={worker.s_registration_number}
                        onChange={(event) => setWorker({ ...worker, s_registration_number: event.target.value })}
                      />
                      <input
                        required
                        placeholder="Organisation name"
                        value={worker.s_organisation_name}
                        onChange={(event) => setWorker({ ...worker, s_organisation_name: event.target.value })}
                      />
                      <input
                        required
                        placeholder="Office location"
                        value={worker.s_office_location}
                        onChange={(event) => setWorker({ ...worker, s_office_location: event.target.value })}
                      />
                      <input
                        required
                        placeholder="Specialisation"
                        value={worker.s_specialisation}
                        onChange={(event) => setWorker({ ...worker, s_specialisation: event.target.value })}
                      />
         
                      <button type="submit" className={styles.submitButton}>Add Social Worker.</button>
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
