import { useEffect, useState } from 'react';
import styles from './css/Hero.module.css'


//Retrieve programs stored in the database.
function getPrograms() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/getPrograms')
      .then(response => response.json())
      .then(data => {
        setPrograms(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);
}

export default function Hero(){

  useEffect
  return (
    <section id="Home page" className={styles.hero}>
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
