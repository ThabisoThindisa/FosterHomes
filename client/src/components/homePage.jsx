import { useEffect, useState } from 'react';
import styles from './css/Hero.module.css'
import NavigationBar from './NavBar'
import { Link } from 'react-router-dom'

//Store the link to connect to the api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

  const cards = [
    { id: 1, title: 'Our Programs', text: 'A safe, nurturing home with consistent support.', size: 'feature' },
    { id: 2, title: 'Testimonials', text: 'Guidance that helps families stay connected.', size: 'side' },
    { id: 3, title: 'Gallery', text: 'Practical preparation for growing independence.', size: 'standard' },

  ];

  // Grid wrapper styling
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
    gap: '16px',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };


export default function Hero(){

  return (
    <><section id="Home page" className={styles.hero}>

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
    
    <section className={styles.gridSection} aria-label="Our areas of support">
        <div className={styles.grid} style={gridStyle}>
          {cards.map((card) => (
            <article key={card.id} className={`${styles.gridCard} ${styles[card.size]}`}>
              <span className={styles.cardNumber}>0{card.id}</span>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
              <Link to="/programs">Learn more</Link>
            </article>
          ))}
        </div>
      </section></>
  )
}
