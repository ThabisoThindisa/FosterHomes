import React from 'react'

import styles from './css/Contact.module.css'

export default function Contact(){
  return (
    <div className={styles.wrap}>
      <div className={styles.form}>
        <label>Name<input placeholder="Your full name"/></label>
        <label>Email<input placeholder="you@example.com"/></label>
        <label>Message<textarea placeholder="I want to learn more about volunteering..."/></label>
        <button className={styles.btn}>Send Message</button>
      </div>

      <div className={styles.map}>
        <iframe title="map" width="100%" height="260" style={{border:0}}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093746!2d144.9537353153163!3d-37.81627974202198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f3c8f4b7%3A0x2a0f6f0b2f8b3ceb!2sFederation%20Square!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus"></iframe>
      </div>
    </div>
  )
}
