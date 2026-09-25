
import { useEffect, useState } from 'react'
import styles from './css/CardGrid.module.css'
import Footer from './SemanticElements/Footer'
import { getPrograms } from './Helpers/HandleRequests';

export default function Programs(){
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

   //------------------Retrieve available programs---------------
useEffect(() => {

    const fetchPrograms = async () => {
        try {
            const programsList = await getPrograms();
            setPrograms(programsList);
        } catch (fetchError) {
            setError(fetchError.message);
        } finally {
            setLoading(false);
        }
    };
    fetchPrograms();

}, []);


  if(loading) return <div>Loading programs...</div>

  if(error) return <div>Error: {error}</div>

return (
  <>
  <section>
  <div className={styles.grid} >
      {programs.map((program) => (
        <article key={program.program_id} className={styles.card}>
          <div className={styles.body}>
            <h3>{program.ad_name}</h3>
            <p>{program.ad_description}</p>

            {program.ad_eligibility_requirements && (
              <small>
                Eligibility: {program.ad_eligibility_requirements}
              </small>
            )}
          </div>
        </article>
      ))}
  </div>
  </section>
  <Footer />
  </>
)
}