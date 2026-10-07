
import { useEffect,useState } from 'react';
import styles from  '../css/Booking.module.css'

import stylesM from  '../css/HomePage.module.css'
import stylesBoxM from '../css/Home.module.css'


import Header from '../SemanticElements/Header'   //'./SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar';
import Footer from '../SemanticElements/Footer' //'./SemanticElements/Footer'
import {HandleGetList} from '../Helpers/HandleRequests' 

export default function ManageAdoptions(){
const [showWorkers, setShowWorkers] = useState([]); 
const [selectedWorker, setSelectedWorker] = useState('');

//-------Retrieve available users registred.---------------
useEffect(() => {
  const getAllSocialWorkers = async () => {
    try {
      
      const Workers_List = await HandleGetList('/getWorkers');
      setShowWorkers(Workers_List);
    } catch (fetchError) {
      console.error(fetchError.message);
    }
  };

  getAllSocialWorkers();
}, []);

  return (
    <>
      <NavigationBar />
      <main className="dashboard">
      <Header
        eyebrow="Our Foster Homes"
        title="Adoption Options."
        description="Our foster homes provide a safe, loving, and supportive environment for children who need temporary care and protection."
      />
  
       <section>

       </section>
              <form>
      <label className={styles.DisplayLabel}>Book adoption. </label>
    </form>
       <section className={styles.forms}>
       <section className={styles.fosterHomesContainer}>

  <div className={styles.fosterHomeCard}>
    <h2>Social Worker</h2>
    <p>
   Select a social worker who is available to assist
    you with your adoption journey and appointment.
    </p>
<select
  value={selectedWorker}
  onChange={(e) => setSelectedWorker(e.target.value)}
  style={{
 width: '200px',padding: '19px',borderRadius: '11px',
    border: '1px solid #ccc', cursor: 'pointer'
  }}
>
    <option value="">
    Select Social Worker
  </option>
  {showWorkers.map((worker) => (
    <option key={worker.social_worker_id || worker.s_registration_number} value={worker.s_organisation_name}>
      {worker.worker_name + ' ('+worker.s_specialisation +').'}
    </option>
  ))}
</select>
  </div>

  <div className={styles.fosterHomeCard}>
    <h2>Appointment Type</h2>
    <p>
    Appointments can be scheduled for adoption consultations, 
     application discussions, foster-to-adopt consultations,
      assessments, and follow-up meetings.
    </p>
<select
  value={selectedWorker}
  onChange={(e) => setSelectedWorker(e.target.value)}
  style={{
    width: '200px',padding: '19px',borderRadius: '11px',
    border: '1px solid #ccc', cursor: 'pointer'
  }}
>
    <option value="">
    Select Appointment.
  </option>
  {showWorkers.map((worker) => (
    <option key={worker.social_worker_id || worker.s_registration_number} value={worker.s_organisation_name}>
      {worker.worker_name + ' ('+worker.s_specialisation +').'}
    </option>
  ))}
</select>
  </div>

  <div className={styles.fosterHomeCard}>
    <h2>Date</h2>
    <p>
      Select a convenient date for your appointment with our 
      social worker.
    </p>
          <div>
               <label htmlFor="ChildDOB"></label>
               <input
                 type="date"
                 id="ChildDOB"
                style={{width: '200px',padding: '19px',borderRadius: '11px',
                border: '1px solid #ccc'}}
                 
               />
             </div>
  </div>

   <div className={styles.fosterHomeCard}>
    <h2>Time </h2>
    <p>
      Select a convenient date for your appointment with our
       social worker.
    </p>

<input
  type="time"
  id="appointmentTime"
  name="appointmentTime"
  min="08:00"
  max="16:00"
  style={{width: '200px',padding: '19px',borderRadius: '11px',
          border: '1px solid #ccc'}}
  required
/>
  </div>

</section>

              
             </section>
           <section>
    
      <div className={stylesBoxM.sectionHeader}>
        <h1></h1>
         <h1>Meet Our Social Workers</h1>
      <p >
        Our social workers play an important role in supporting children and prospective
         adoptive parents. They help applicants understand the adoption
          process, conduct assessments, provide guidance, and support 
          families through important decisions.

       If you have questions about adoption or would like assistance with your application,
        you can arrange an appointment with one of our social workers.
      </p>
    </div>

       </section>
      
      </main>
      <Footer />
    </>
  )
}
