
import { useEffect, useState } from 'react'
import styles from '../css/Admin.module.css'
import Header from '../SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar'
import Footer from '../SemanticElements/Footer'
import { delete_Users, HandleGetList, addEntryRequest } from '../Helpers/HandleRequests'

export default function ManageUsers() {
  const [Allusers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

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

  useEffect(() => {
     const fetchUsers = async () => {
       try {
         const User_List = await HandleGetList('/getUsers')
         setAllUsers(User_List)
       } catch (fetchError) {
         setError(fetchError.message)
       } finally {
         setLoading(false)
       }
     }

     fetchUsers()
  }, [])

  async function Add_Children(event) {
     event.preventDefault()

     try {
       const savedChild = await addEntryRequest(child, '/AddChild')
       setAllUsers((currentChild) => [savedChild, ...currentChild])
       setChild({
         C_fullName: '',
         c_reference_code: '',
         c_date_of_birth: '',
         c_gender: '',
         status: 'in_care',
         special_needs: ''
       })
       setMessage('Child added successfully.')
     } catch (error) {
       setMessage(error.message)
     }
  }

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
           title="USER MANAGEMENT."
           description=""
         />

         {loading && <p>Loading users...</p>}
         {error && <p role="alert">{error}</p>}
         {message && <p role="status">{message}</p>}

         <form>
           <label className={styles.DisplayLabel}>Registered Users.</label>
         </form>

         <section className={styles.list}>
           <h2>Users</h2>
           {Allusers.map((item) => (
             <article key={item.user_id || item.child_id}>
               <span>
                 <strong>{'Full name: ' + (item.u_full_name || item.C_fullName || item.c_Fullname || item.worker_name)}</strong>
                 <small>{'ID: ' + (item.u_BirthID || item.c_reference_code || item.s_registration_number || item.user_id)}</small>
                 <small>{'Email: ' + (item.u_email || item.c_date_of_birth || '')}</small>
                 <small>{'Contact No: ' + (item.u_phone || item.c_gender || '')}</small>
                 <small>{'Role: ' + (item.u_role || item.status || 'child')}</small>
               </span>
               <button type="button">Delete</button>
             </article>
           ))}
         </section>

         <section>
           <form>
             <label className={styles.DisplayLabel}>Add Children to the Platform.</label>
           </form>

           <form onSubmit={Add_Children} className={styles.form}>
             <h2>Children information.</h2>

             <input
               required
               placeholder="Child Name"
               value={child.C_fullName}
               onChange={(event) => setChild({ ...child, C_fullName: event.target.value })}
             />
             <input
               required
               placeholder="Reference code"
               value={child.c_reference_code}
               onChange={(event) => setChild({ ...child, c_reference_code: event.target.value })}
             />

             <div>
               <label htmlFor="ChildDOB">Date of Birth:</label>
               <input
                 type="date"
                 id="ChildDOB"
                 value={child.c_date_of_birth}
                 onChange={(event) => setChild({ ...child, c_date_of_birth: event.target.value })}
               />
             </div>

             <input
               required
               placeholder="Gender"
               value={child.c_gender}
               onChange={(event) => setChild({ ...child, c_gender: event.target.value })}
             />
             <input
               required
               placeholder="Status"
               value={child.status}
               onChange={(event) => setChild({ ...child, status: event.target.value })}
             />
             <input
               placeholder="Special needs"
               value={child.special_needs}
               onChange={(event) => setChild({ ...child, special_needs: event.target.value })}
             />
             <button type="submit" className={styles.submitButton}>Add Child.</button>
           </form>

           <label className={styles.DisplayLabel}></label>

           <label className={styles.DisplayLabel}>Add Social Worker</label>
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
         </section>
       </main>
       <Footer />
     </>
  )
}
