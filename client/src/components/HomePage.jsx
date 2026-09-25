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
          <h2>Welcome to Thindisa FosterHome</h2>
          <p>
         Our home is built around compassion, care, dignity, and hope.
          We strive to create a nurturing environment where children
          feel safe, valued, respected, and supported.Through our
           programs and services, we focus on the individual needs 
           of every child while encouraging their emotional, educational, 
           social, and personal development.S
          </p>
        </div>

        <div className={stylesBox.sectionHeader}>
          <h2>Our Programs.</h2>
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
                <div className={stylesBox.sectionHeader}>
          
          <p>
    
          </p>
        </div>

                     <div className={stylesBox.sectionHeader}>
          <h2>Why Choose Thindisa FosterHome?</h2>
   <p>
    At Thindisa FosterHome, we are committed to providing a safe and
    nurturing environment where children can feel comfortable, protected,
    and supported. We believe every child deserves to be treated with
    kindness, dignity, respect, and understanding. Our programs focus on
    the individual needs, development, and well-being of each child.
  </p>

  <p>
    Through compassionate care and continued support, we encourage education,
    personal development, family support, and positive community relationships.
    We strive to help every child build confidence, discover their potential,
    and work towards a stronger and brighter future.
  </p>

        </div>
      </section>

      <Footer />
    </>
  )
}