
import { useEffect, useState } from 'react'
import styles from '../css/Admin.module.css'
import Header from '../SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar'
import Footer from '../SemanticElements/Footer'
import { delete_Users, HandleGetList, addEntryRequest } from '../Helpers/HandleRequests'
import { useNavigate } from "react-router-dom";

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
      <button 
      
    style={{
    backgroundColor: '#4175af',
    color: 'white',
    border: 'none',
    padding: '22px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
    marginRight: '10px',
    cursor: 'pointer'
  }}
      
      onClick={() => navigate("/ChildManage")} >Add Children</button>
      <button 
      
          style={{
    backgroundColor: '#4175af',
    color: 'white',
    border: 'none',
    padding: '22px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
    marginRight: '10px',
    cursor: 'pointer'
  }}
      
      onClick={() => navigate("/SocialWorkers")}>Add Social Worker</button>
 
       </main>
       <Footer />
     </>
  )
}
