import { useState, useEffect } from 'react'

import styles from  '../css/Testimonials.module.css'
import Header from '../SemanticElements/Header'   //'./SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar';
import Footer from '../SemanticElements/Footer' //'./SemanticElements/Footer'
import {HandleGetList,addEntryRequest} from '../Helpers/HandleRequests'  //'./Helpers/HandleRequests'

export default function DisplayHomes(){

  //Store and set the variavles 
   const [Applications, setApplications] = useState([]) //All stored OurStories /Stories

useEffect(() => {

    const getFosterHomes = async () => {
        try {
          
            const Parent_Application = await HandleGetList('/getAdoptionApplications');
            setApplications(Parent_Application);
        } catch (fetchError) {
            setError(fetchError.message);
        } finally {
            setLoading(false);
        }
    };

    getFosterHomes();

}, []);
  

  return (
    <>
      <NavigationBar />
      <main className="dashboard">
      <Header
        eyebrow="Our Foster Homes"
        title="Viewe Applications"
        description="Our foster homes provide a safe, loving, and supportive environment for children who need temporary care and protection."
      />

          <form>
      <label className={styles.DisplayLabel}>All the registered fosterhomes</label>
    </form>

      <section className={styles.flexContainer}>
        {Applications.map((Applications,index =1) => (
          <article key={Applications.application_id } className={`${styles.card} ${styles.flexItem}`}>
            <div className={styles.body}>
              <h3>{(index+1)+'. ' + Applications.application_id }</h3>
              <p>{'Name: '+Applications.social_worker_name }</p>
              <p>{'Surname: '+Applications.program_name   }</p>
              <p>{'Contact details: '+Applications.application_date  }</p>
              <p>{'Available Space: '+Applications.status}</p>
            
              {Applications.notes && (
                <small>
                  Published at: {Applications.fh_created_at.slice(0, 10)}
                </small>
                
              )}
            </div>
          </article>
        ))}
      </section>
      </main>
      <Footer />
    </>
  )
}
