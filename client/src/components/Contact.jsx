
import styles from './css/Contact.module.css'
import Header from "./SemanticElements/Header";
import NavigationBar from "./SemanticElements/NavBar";
import Footer from './SemanticElements/Footer'
import { useState } from 'react';
import { addEntryRequest } from './Helpers/HandleRequests';

export default function Contact(){
  const [message, setMessage] = useState('')
  const [submissionError, setSubmissionError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [Enquery, setEnquery] = useState({
       enq_full_name :'',
       enq_email :'',
       enq_phone :'',
       enq_subject :'',
       enq_message :''
  })

 async function add_Enquery(event) {
    event.preventDefault();
    setMessage('')
    setSubmissionError(false)
    setIsSubmitting(true)
    try {
      await addEntryRequest(Enquery,'/AddEnquiry');

      setEnquery({
       enq_full_name :'',
       enq_email :'',
       enq_phone :'',
       enq_subject :'',
       enq_message :''
      })
      setMessage('Your enquiry was sent successfully.')
    } catch (error) {
      setMessage(error.message)
      setSubmissionError(true)
    } finally {
      setIsSubmitting(false)
    }
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

        <form onSubmit={add_Enquery}>
          <label className={styles.NameInput}>Name<input
            name="name"
            placeholder="Your full name"
            value={Enquery.enq_full_name}
            onChange={(event) => setEnquery((current) => ({ ...current, enq_full_name: event.target.value }))}
            required
          /></label>
          <label className={styles.EmailInput}>Email<input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={Enquery.enq_email}
            onChange={(event) => setEnquery((current) => ({ ...current, enq_email: event.target.value }))}
            required
          /></label>
          <label className={styles.EmailInput}>Phone<input
            name="phone"
            type="tel"
            placeholder="Your phone number (optional)"
            value={Enquery.enq_phone}
            onChange={(event) => setEnquery((current) => ({ ...current, enq_phone: event.target.value }))}
          /></label>
          <label className={styles.EmailInput}>Subject<input
            name="subject"
            placeholder="Title"
            value={Enquery.enq_subject}
            onChange={(event) => setEnquery((current) => ({ ...current, enq_subject: event.target.value }))}
          /></label>
          <label className={styles.MessageInput}
           placeholder="Your phone number (optional)"><textarea
            name="message"
            value={Enquery.enq_message}
            onChange={(event) => setEnquery((current) => ({ ...current, enq_message: event.target.value }))}
            required
          /></label>
          <button className={styles.btn} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {message && (
          <p
            className={`${styles.feedback} ${submissionError ? styles.feedbackError : ''}`}
            role={submissionError ? 'alert' : 'status'}
          >
            {message}
          </p>
        )}
           <div className={styles.map}>
        <iframe title="map" width="100%" height="260" style={{border:0}}
          src="https://www.google.com/maps?q=-24.1832994,29.007982&z=17&output=embed"></iframe>
      </div>
      
      </div>

    <Footer />
    </div>
  )
}
