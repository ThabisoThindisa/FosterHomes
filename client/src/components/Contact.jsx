import React from 'react'

import styles from './css/Contact.module.css'
import Header from './Header'
import NavigationBar from './NavBar'

export default function Contact(){
  return (
      
    <div className={styles.wrap}>
  
      <div className={styles.form}>
            <NavigationBar />
            <Header
            eyebrow="Let us Start a Journey Together."
            title="Contact US"
            description="Connect With Us, Create a Brighter Future."
          />

        <label>Name<input placeholder="Your full name"/></label>
        <label>Email<input placeholder="you@example.com"/></label>
        <label>Message<textarea placeholder="I want to learn more about volunteering..."/></label>
        <button className={styles.btn}>Send Message</button>
           <div className={styles.map}>
        <iframe title="map" width="100%" height="260" style={{border:0}}
          src="https://www.google.com/maps?q=-24.1832994,29.007982&z=17&output=embed"></iframe>
      </div>
      
      </div>

    
    </div>
  )
}
