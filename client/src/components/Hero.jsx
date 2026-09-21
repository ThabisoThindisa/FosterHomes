import React from 'react'
import styles from './css/Hero.module.css'

export default function Hero(){
  return (
    <section id="hero" className={styles.hero}>
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
