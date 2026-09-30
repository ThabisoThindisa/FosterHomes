

import styles from  '../css/Booking.module.css'
import Header from '../SemanticElements/Header'   //'./SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar';
import Footer from '../SemanticElements/Footer' //'./SemanticElements/Footer'
//import {getHomes} from '../Helpers/HandleRequests'  //'./Helpers/HandleRequests'

export default function ManageAdoptions(){

  return (
    <>
      <NavigationBar />
      <main className="dashboard">
      <Header
        eyebrow="Our Foster Homes"
        title="Adoption Options."
        description="Our foster homes provide a safe, loving, and supportive environment for children who need temporary care and protection."
      />

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
    <button>Select Social Worker ▼</button>
  </div>

  <div className={styles.fosterHomeCard}>
    <h2>Appointment</h2>
    <p>
     Appointments can be scheduled for adoption consultations, 
     application discussions, foster-to-adopt consultations,
      assessments, and follow-up meetings. Our goal is to make
       every appointment informative, supportive, and focused 
       on helping families take the next step in their journey.
    </p>
    <button>Select Worker ▼</button>
  </div>

  <div className={styles.fosterHomeCard}>
    <h2>Date</h2>
    <p>
      Select a convenient date for your appointment with our 
      social worker. Please choose a date that works well for
       you so that we can provide the appropriate time and 
       support for your consultation.
    </p>
    <button>Select Date ▼</button>
  </div>

   <div className={styles.fosterHomeCard}>
    <h2>Time </h2>
    <p>
      Select a convenient date for your appointment with our
       social worker. Please choose a date that works well 
       for you so that we can provide the appropriate time
        and support for your consultation.
    </p>
    <button>Select Time ▼</button>
  </div>

</section>

              
             </section>

      
      </main>
      <Footer />
    </>
  )
}
