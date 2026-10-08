
import { useEffect,useState } from 'react';
import styles from  '../css/Booking.module.css'

import '../Admin Access/display.css'
import stylesBoxM from '../css/Home.module.css'


import Header from '../SemanticElements/Header'   //'./SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar';
import Footer from '../SemanticElements/Footer' //'./SemanticElements/Footer'
import {HandleGetList} from '../Helpers/HandleRequests' 

export default function ManageAdoptions(){
const [showWorkers, setShowWorkers] = useState([]); 
const [newAppointment, setnewAppointment] = useState({
    applicant_id : '',
    social_worker_id: '',  ///d
    appointment_date: '', //d
    appointment_type: '',//d
    appointment_status: '', 
    notes: ''//d

});

const Listdoption_types = [
  {
    id: 1,
    name: "Initial Adoption Consultation",
    description: "First meeting to discuss the adoption process and requirements."
  },
  {
    id: 2,
    name: "Adoption Application Review",
},
  {
    id: 3,
    name: "Social Worker Assessment",
   
  },
  {
    id: 4,
    name: "Home Assessment",
}
];
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
  value={newAppointment.social_worker_id}
  onChange={(e) => setnewAppointment((current) => ({ ...current, social_worker_id: e.target.value }))}
  style={{
 width: '200px',padding: '19px',borderRadius: '11px',
    border: '1px solid #ccc', cursor: 'pointer'
  }}
>
    <option value="">
    Select Social Worker
  </option>
  {showWorkers.map((worker) => (
    <option key={worker.social_worker_id || worker.s_registration_number} value={worker.social_worker_id || worker.s_registration_number}>
      {worker.worker_name + ' (' + worker.s_specialisation + ').'}
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
     value={newAppointment.appointment_type}
     onChange={(e) => setnewAppointment((current) => ({ ...current, appointment_type: e.target.value }))}
  style={{
    width: '200px',padding: '19px',borderRadius: '11px',
    border: '1px solid #ccc', cursor: 'pointer'
  }}
>
    <option value="">
    Select type.
  </option>
  {Listdoption_types.map((appointmentType) => (
    <option key={appointmentType.id} value={appointmentType.name}>
      {appointmentType.name}
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
                value={newAppointment.appointment_date}
              onChange={(e) => setnewAppointment((current) => ({ ...current, appointment_date: e.target.value }))}
                 type="date"
                 id="ChildDOB"
                style={{width: '200px',padding: '19px',borderRadius: '11px',
                border: '1px solid #ccc'}}
                 
               />
             </div>
  </div>


  <div className={styles.fosterHomeCard}>
    <h2>Adoption notes</h2>
    <p>
      Do you have any special request for the appointments.
    </p>

        <label htmlFor="appointment-notes">Additional notes</label>
        <textarea
          id="appointment-notes"
          name="notes"
          value={newAppointment.notes}
          onChange={(e) => setnewAppointment((current) => ({ ...current, notes: e.target.value }))}
          rows={4}
          style={{
            width: '100%',
            maxWidth: '420px',
            height: '170px',
            padding: '12px',
            borderRadius: '11px',
            border: '1px solid #ccc',
            resize: 'vertical'
          }}
        />
  </div>

</section>

              
             </section>

             <section>
                
    <button className="pressBtn"> Press</button>
  
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
