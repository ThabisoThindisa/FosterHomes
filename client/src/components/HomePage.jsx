import { Link } from 'react-router-dom'
import styles from './css/HomePage.module.css'
import NavigationBar from './NavBar'

export default function HomePage(){
  return (
    <>
      <NavigationBar />
      <section id="HomePage" className={styles.HomePage}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h1>Thindisa FosterHome</h1>
          <p className={styles.tag}>Building Brighter Futures, One Child at a Time</p>
          <div className={styles.ctas}>
            <Link to="/programs" className={styles.primary}>Explore Programs</Link>
            <Link to= "/contacts"  className={styles.secondary}>Visit Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}