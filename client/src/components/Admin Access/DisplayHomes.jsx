import { useState, useEffect } from 'react'

import styles from  '../css/Testimonials.module.css'
import Header from '../SemanticElements/Header'   //'./SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar';
import Footer from '../SemanticElements/Footer' //'./SemanticElements/Footer'
import {HandleGetList,addEntryRequest} from '../Helpers/HandleRequests'  //'./Helpers/HandleRequests'

export default function DisplayHomes(){

  //Store and set the variavles 
   const [homes, setHomes] = useState([]) //All stored OurStories /Stories
   const [Single_homes, setSingle_Homes] = useState({
            user_id : '',
            fh_name : '',
            fh_address : '',
            fh_contact_number : '',
            fh_email: '',
            fh_capacity: '',
            fh_available_spaces: '',
            fh_status:''

   })
     //------------Retrieve available Homes---------------------
useEffect(() => {

    const addHomes = async () => {
        try {
        await addEntryRequest(Single_homes,'/getFosterHomes');
        setSingle_Homes({
            user_id : '',
            fh_name : '',
            fh_address : '',
            fh_contact_number : '',
            fh_email: '',
            fh_capacity: '',
            fh_available_spaces: '',
            fh_status:''
       })
        } catch (fetchError) {
            setError(fetchError.message);
        } finally {
            setLoading(false);
        }
    };

    addHomes();

}, []);

useEffect(() => {

    const getFosterHomes = async () => {
        try {
          
            const HomeList = await HandleGetList('/getFosterHomes');
            setHomes(HomeList);
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
        title="Available Homes"
        description="Our foster homes provide a safe, loving, and supportive environment for children who need temporary care and protection."
      />

          <form>
      <label className={styles.DisplayLabel}>All the registered fosterhomes</label>
    </form>

      <section className={styles.flexContainer}>
        {homes.map((home,index =1) => (
          <article key={home.foster_home_id } className={`${styles.card} ${styles.flexItem}`}>
            <div className={styles.body}>
              <h3>{(index+1)+'. ' + home.fh_name }</h3>
              <p>{'Address: '+home.fh_address  }</p>
              <p>{'Capacity: '+home.fh_capacity  }</p>
              <p>{'Contact details: '+home.fh_contact_number  }</p>
              <p>{'Available Space: '+home.fh_available_spaces}</p>
            
              {home.content && (
                <small>
                  Published at: {home.fh_created_at.slice(0, 10) +' Time: '+home.fh_created_at.slice(12, 16)}
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
