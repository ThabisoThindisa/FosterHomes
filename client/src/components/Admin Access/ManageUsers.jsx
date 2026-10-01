
import {useEffect,useState} from 'react'
//import styles from './css/Admin.module.css'
import styles from '../css/Admin.module.css'

import Header from '../SemanticElements/Header'   //'./SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar';
import Footer from '../SemanticElements/Footer' //'./SemanticElements/Footer'
import {delete_Users, getAllUsers, AddChildren,AddSocialWorker} from '../Helpers/HandleRequests'  //'./Helpers/HandleRequests'

export default function ManageUsers(){

     const [Allusers, setAllUsers] = useState([])
     const [child, setChild] = useState({
          C_fullName: '',
         c_reference_code: '',
         c_date_of_birth: '',
         c_gender: '',
         status: '',
         special_needs: ''})
   
         //Social worker
    const [worker, setWorker] = useState({
         s_fullName: '',
         s_registration_number: '',
         s_organisation_name: '',
         s_office_location: '',
         s_specialisation: ''
         })

     //-------Retrieve available users registred.---------------
  useEffect(() => {
      const fetchUsers = async () => {
          try {
              const User_List = await getAllUsers();
              setAllUsers(User_List);
          } catch (fetchError) {
              setError(fetchError.message);
          } finally {
              setLoading(false);
          }
      };
      fetchUsers(); //deploy and us the function.
  
  }, []);

      async function Add_Children(event) {
      event.preventDefault()
  
        try {
          const savedChild = await AddChildren(child);
          setAllUsers((currentChild) => [...currentChild, savedChild])
          setChild({  C_fullName: '', c_reference_code: '', c_date_of_birth: '', c_gender: '', status: '', special_needs: ''})
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
        title="Remove and add users."
        description=""
      />

          <form>
      <label className={styles.DisplayLabel}>Registered Users. </label>
    </form>
       
              <section className={styles.list}>
                <h2>Users</h2>{Allusers.map((item) => <article key={item.user_id}>
                  <span><strong>{'Full name: '+item.u_full_name}</strong>
                  <small>{'ID: '+item.u_BirthID}</small>
                  <small>{'Email: '+item.u_email}</small>
                  <small>{'Contact No :'+item.u_phone}</small>
                  <small>{'Role: '+item.u_role}</small>
                  </span>
                  <button >Delete</button>
                  </article>)}
            </section>
            <section>
                     <form>
      <label className={styles.DisplayLabel}>Add Children to the Platform. </label>
    </form>
          <form onSubmit={AddChildren} className={styles.form}>
                   <h2>Children information.</h2>
                   {/*          setChild({ c_reference_code: '', c_date_of_birth: '', c_gender: '', status: '', special_needs: ''})  */}
                   <input required placeholder="Child Name" value={child.C_fullName} onChange={(event) => setChild({ ...child, C_fullName: event.target.value })} />
                   <input required placeholder="Reference code" value={child.c_reference_code} onChange={(event) => setChild({ ...child, c_reference_code: event.target.value })} />
                   <input required placeholder="Date of birth" value={child.c_date_of_birth} onChange={(event) => setChild({ ...child, c_date_of_birth: event.target.value })} />
                   <input required placeholder="Gender" value={child.c_gender} onChange={(event) => setChild({ ...child, c_gender: event.target.value })} />
                   <input required placeholder="Status" value={child.status} onChange={(event) => setChild({ ...child, status: event.target.value })} />
                   <input placeholder="Special needs" value={child.special_needs} onChange={(event) => setChild({ ...child, special_needs: event.target.value })} />
                   <button type="submit" className={styles.submitButton}>Add Child.</button>
                 </form>

            </section>
              

      
      </main>
      <Footer />
    </>
  )
}
