
import { useEffect,useState } from 'react';
import styles from  '../css/Booking.module.css'

import '../Admin Access/display.css'
import stylesBoxM from '../css/Home.module.css'

import Header from '../SemanticElements/Header'  
import NavigationBar from '../SemanticElements/NavBar';
import Footer from '../SemanticElements/Footer'
import {HandleGetList,addEntryRequest} from '../Helpers/HandleRequests' 

export default function ManageAdoptions(){
const [showWorkers, setShowWorkers] = useState([]); 
const [applicantId, setApplicantId] = useState(null)
const [message, setMessage] = useState('');
const [Display_allPrograms, setAllPrograms] = useState([])
  
//Create a application
const [Application, setApplication] = useState({
  social_worker_id: '', //d
  program_id : '', //d
  application_date: '', //d
  status: '',
  notes: '' //d

});

const Listdoption_types = [
  {
    id: 1,
    name: "Initial Adoption Consultation",
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
     //------------------Retrieve available programs---------------
  useEffect(() => {
      const fetchPrograms = async () => {
          try {
              const programsList = await HandleGetList('/getPrograms');
              setAllPrograms(programsList);
          } catch (fetchError) {
              setMessage(fetchError.message);
          }
      };
      fetchPrograms();
  
  }, []);

     //------------------Retrieve current applicant---------------
  useEffect(() => {
      const getApplicant = async () => {
          try {
              const applicant = await HandleGetList('/getApplicant');
              setApplicantId(applicant.applicant_id);
          } catch (fetchError) {
              setMessage(fetchError.message);
          }
      };
      getApplicant();
  }, []);


 async function MakeApplication(event) {
     event.preventDefault()
     setMessage('')

     if (!applicantId) {
       setMessage('Applicant details could not be found. Please update your account and try again.')
       return
     }

     try {
       await addEntryRequest(Application,'/makeAplication')
       
       setApplication({
       social_worker_id: '',
       program_id: '',
       application_date: '',
       status: '',
       notes: ''
       })
       setMessage('Application made successfully.')
     } catch (error) {
       setMessage(error.message)
     }
  }

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
 {/*-----------------------make appointments--------------  */}
       <form onSubmit={MakeApplication} className={styles.fosterHomesContainer}>

  <div className={styles.fosterHomeCard}>
    <h2>Social Worker</h2>
    <p>
   Select a social worker who is available to assist
    you with your adoption journey and appointment.
    </p>
<select
  value={Application.social_worker_id}
  onChange={(e) => setApplication((current) => ({ ...current, social_worker_id: e.target.value }))}
  style={{width: '200px',padding: '19px',borderRadius: '11px',border: '1px solid #ccc', cursor: 'pointer'}}
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
    <h2>Program</h2>
    <p>
      Our programs are designed to provide children and families with
       the support, care, and guidance they need throughout the 
       adoption and foster care journey.
    </p>
<select
  value={Application.program_id}
  onChange={(e) => setApplication((current) => ({ ...current, program_id: e.target.value }))}
  style={{width: '200px',padding: '19px',borderRadius: '11px',border: '1px solid #ccc', cursor: 'pointer'}}
>
    <option value="">
    Select Program.
  </option>
  {Display_allPrograms.map((worker) => (
    <option key={worker.program_id} value={worker.program_id}>
      {worker.ad_name}
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
                value={Application.application_date}
              onChange={(e) => setApplication((current) => ({ ...current, application_date: e.target.value }))}
                 type="date"
                 id="ChildDOB"
                style={{width: '200px',padding: '19px',borderRadius: '11px',border: '1px solid #ccc'}} 
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
          id="application-notes"
          name="notes"
          value={Application.notes}
          onChange={(e) => setApplication((current) => ({ ...current, notes: e.target.value }))}
          rows={4}
          style={{width: '100%',maxWidth: '420px', height: '170px', padding: '12px', borderRadius: '11px', border: '1px solid #ccc', resize: 'vertical'}}
        />
  </div>
  <button type="submit" className="pressBtn">Enter</button>
  {message && <p role="status">{message}</p>}
</form>   
 {/*------------------end appointments-----------------  */}           
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
