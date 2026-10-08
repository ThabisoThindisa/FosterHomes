
import { useState } from 'react'
import styles from '../css/Admin.module.css'
import Header from '../SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar'
import Footer from '../SemanticElements/Footer'
import { delete_Users, HandleGetList, addEntryRequest } from '../Helpers/HandleRequests'
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const [AllChildren, setAllChildren] = useState([])
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

  async function Add_Children(event) {
     event.preventDefault()

     try {
       const savedChild = await addEntryRequest(child, '/AddChild')
       setAllChildren((currentChild) => [savedChild, ...currentChild])
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

  return (
     <>
       <NavigationBar />
       <main className="dashboard">
         <Header
           eyebrow="User management"
           title="ADD CHILDREN."
           description=""
         />

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

           <button 
           
             style={{
    backgroundColor: '#4175af',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
    cursor: 'pointer'
  }}
           
           onClick={() => navigate("/AllUsers")}>
            Back.
           </button>

         </section>
       </main>
       <Footer />
     </>
  )
}
