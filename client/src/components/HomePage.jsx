import { Link } from 'react-router-dom'
import styles from './css/HomePage.module.css'
import stylesBox from './css/Home.module.css'
import NavigationBar from './SemanticElements/NavBar';
import Footer from './SemanticElements/Footer'
import { useState,useEffect } from 'react';

export default function HomePage() {
   
  
//Use this connection.
const Api_connection ='http://localhost:4000/api';

 const [programs, setPrograms] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)
 
    //------------------Retrieve available programs---------------
   useEffect(() => {
     fetch(Api_connection +'/getPrograms')
       .then((response) => {
         if (!response.ok) {
           throw new Error('Failed to fetch programs')
         }
         return response.json()
       })
      .then((data) => {
       const programsList = data.data ?? data
 
   setPrograms(programsList)
 })
       .catch((fetchError) => {
         setError(fetchError.message)
       })
       .finally(() => {
         setLoading(false)
       })
   }, [])


  return (
    <>
      <NavigationBar />

      {/* Hero Section */}
      <section id="HomePage" className={styles.HomePage}>
        <div className={styles.overlay} />

        <div className={styles.content}>
          <h1>Thindisa FosterHome</h1>

          <p className={styles.tag}>
            Building Brighter Futures, One Child at a Time
          </p>

          <div className={styles.ctas}>
            <Link to="/Testimonial" className={styles.primary}>
              Community Testimonials
            </Link>

            <Link to="/contacts" className={styles.secondary}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Flexbox Grid */}
      <section className={stylesBox.flexContainer}>
        <div className={stylesBox.sectionHeader}>
          <h2>Our Programs.</h2>
          <p>
         Thindisa FosterHome focuses on providing a safe and 
         supportive environment for children. Our programs include
          foster care, adoption support, education, child development,
           and family services, aiming to improve the lives of 
           vulnerable children and foster their potential for a brighter future.
          </p>
        </div>
       
       {/*program_id ad_name ad_description ad_eligibility_requirements ad_is_active ad_created_at */}
        <div className={stylesBox.grid}>
          {programs.map((program, index) => (
            <div className={stylesBox.card} key={index}>
              <h3>{(index+1) +'. Name: '+ program.ad_name + "\n"}</h3>
              <p>{"Discription: "+program.ad_description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}