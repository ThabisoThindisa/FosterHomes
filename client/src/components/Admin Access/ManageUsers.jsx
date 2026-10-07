
import {useEffect,useState} from 'react'
import styles from '../css/Admin.module.css'
import Header from '../SemanticElements/Header'   
import NavigationBar from '../SemanticElements/NavBar';
import Footer from '../SemanticElements/Footer'
import {delete_Users, HandleGetList} from '../Helpers/HandleRequests'  //'./Helpers/HandleRequests'

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
         s_fullName: '', s_BirthID: '',s_email: '',s_password_hash: '', s_phone: '', s_role: ''

         })


     //-------Retrieve available users registred.---------------
  useEffect(() => {
      const fetchUsers = async () => {
          try {
              const User_List = await HandleGetList('/getUsers');
              setAllUsers(User_List);
          } catch (fetchError) {
              setError(fetchError.message);
          } finally {
              setLoading(false);
          }
      };
      fetchUsers(); //deploy and us the function.
  
  }, []);

  //--------add children-----------
  async function Add_Children(event) {
 event.preventDefault()
  
        try {
          const savedChild = await addEntryRequest(child,'/AddChild');
          setAllUsers((currentChild) => [...currentChild, savedChild])
          setChild({  C_fullName: '', c_reference_code: '', c_date_of_birth: '', c_gender: '', status: '', special_needs: ''})
          setMessage('Child added successfully.')
          
        } catch (error) {
          setMessage(error.message)
        }
    }

async function Add_Workers(event) {
 event.preventDefault()
  
    try {
     const indexSocialW = await addEntryRequest(worker,'/AddWorker');
     setAllUsers((currentW) => [...currentW, indexSocialW])
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
          <form onSubmit={Add_Children} className={styles.form}>
          <h2>Children information.</h2>
          
             <input required placeholder="Child Name" value={child.C_fullName} onChange={(event) => setChild({ ...child, C_fullName: event.target.value })} />
             <input required placeholder="Reference code" value={child.c_reference_code} onChange={(event) => setChild({ ...child, c_reference_code: event.target.value })} />
    {/*--------- Child date of birth ------------*/}
      <div>
      <label htmlFor="ChildDOB">Date of Birth:</label>

      <input
        type="date"
        id="ChildDOB"
        value={child.c_date_of_birth}
        onChange={(event) =>setChild({ ...child, c_date_of_birth: event.target.value })}
      />
    </div>
   {/*Child date of birth  */}

             <input required placeholder="Gender" value={child.c_gender} onChange={(event) => setChild({ ...child, c_gender: event.target.value })} />
             <input required placeholder="Status" value={child.status} onChange={(event) => setChild({ ...child, status: event.target.value })} />
             <input placeholder="Special needs" value={child.special_needs} onChange={(event) => setChild({ ...child, special_needs: event.target.value })} />
             <button type="submit" className={styles.submitButton}>Add Child.</button>
            </form>
       <label className={styles.DisplayLabel}></label>

       <label className={styles.DisplayLabel}>Add Social Worker </label>
       <form onSubmit={Add_Workers} className={styles.form}>
        <h2>Social Worker information.</h2>
 {/*  s_fullName: '', s_BirthID: '',s_email: '',s_password_hash: '', s_phone: '', s_role: ''*/}
          <input required placeholder="Social worker Name" value={worker.s_fullName} onChange={(event) => setWorker({ ...worker, s_fullName: event.target.value })} />
          <input required placeholder="Registration number" value={worker.s_BirthID} onChange={(event) => setWorker({ ...worker, s_registration_number: event.target.value })} />
          <input required placeholder="Organisation name" value={worker.s_email} onChange={(event) => setWorker({ ...worker, s_organisation_name: event.target.value })} />
          <input required placeholder="Office location" value={worker.s_phone} onChange={(event) => setWorker({ ...worker, s_office_location: event.target.value })} />
          <input required placeholder="Specialisation" value={worker.s_specialisation} onChange={(event) => setWorker({ ...worker, s_specialisation: event.target.value })} />
                   
         <button type="submit" className={styles.submitButton}>Add Social Worker.</button>
         </form>

      </section>
      </main>
      <Footer />
    </>
  )
}
