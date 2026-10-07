
import styles from './css/Contact.module.css'
import Header from "./SemanticElements/Header";
import NavigationBar from "./SemanticElements/NavBar";
import Footer from './SemanticElements/Footer'
import { useState } from 'react';
import { addEntryRequest } from './Helpers/HandleRequests';

export default function Contact(){
   const [message,setMessage] = useState('')
    const [AllEnquery, setALLEnquery] = useState([]) //All stored testimonial /Stories

  const [Enquery,setEnquery] = useState({
       enq_full_name :'',
       enq_email :'',
       enq_phone :'',
       enq_subject :'',
       enq_message :'',
       enq_status :'' })

 //-----------------Add single testimonial from the current user---------------
   
 async function add_Enquery(event) {
    event.preventDefault();
    try {
      const stored_message = await addEntryRequest(myStory,'/AddEnquiry');

        setALLEnquery((current_enq) => [
            ...current_enq,
            stored_message
        ]);

      setEnquery({
       enq_full_name :'',
       enq_email :'',
       enq_phone :'',
       enq_subject :'',
       enq_message :'',
       enq_status :''
        });
        setMessage('message added successfully.');
    } catch (error) {
        setMessage(error.message);
    }form
}
  return (
      
    <div className={styles.wrap}>
  
      <div className={styles.form}>
            <NavigationBar />
            <Header
            eyebrow="Let us Start a Journey Together."
            title="Contact US"
            description="Connect With Us, Create a Brighter Future."
          />

        <label className={styles.NameInput}>Name<input placeholder="Your full name" value={Enquery.enq_full_name}
          onChange={(e) => setEnquery(e.target.value)}
          /></label>
        <label className={styles.EmailInput} >Email<input placeholder="you@example.com" value={Enquery.enq_email}
          onChange={(e) => setEnquery(e.target.value)}
        /></label>
          <label className={styles.EmailInput} >Subject<input placeholder="Title." value={Enquery.enq_subject}
          onChange={(e) => setEnquery(e.target.value)}
          /></label>
        <label className={styles.MessageInput} >Message<textarea
         value={Enquery.enq_message} onChange={(e) => setEnquery(e.target.value)} /></label>
        <button className={styles.btn} onClick={add_Enquery} >Send Message</button>
           <div className={styles.map}>
        <iframe title="map" width="100%" height="260" style={{border:0}}
          src="https://www.google.com/maps?q=-24.1832994,29.007982&z=17&output=embed"></iframe>
      </div>
      
      </div>

    <Footer />
    </div>
  )
}
