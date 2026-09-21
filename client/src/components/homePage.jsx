import { useEffect, useState } from 'react';
import styles from './css/Hero.module.css'
import NavigationBar from './NavBar'
import { Link } from 'react-router-dom'

//Store the link to connect to the api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Hero(){

  return (
    <section id="Home page" className={styles.hero}>

      {/* Display the nav bar */}
      <NavigationBar />
      
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1>Thindisa FosterHome</h1>
        <p className={styles.tag}>Building Brighter Futures, One Child at a Time</p>
        <div className={styles.ctas}>
          <a href="#programs" className={styles.primary}>Explore Programs</a>
          <a href="#contact" className={styles.secondary}>Visit Us</a>
        </div>
      </div>
    </section>
  )
}
