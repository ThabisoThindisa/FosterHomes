// src/components/Programs.jsx
import { useEffect, useState } from 'react'
import styles from './css/CardGrid.module.css'

//Use this connection.
const Api_connection ='http://localhost:4000/api';

export default function Programs(){
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

   //Retrieve available programs
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


  if(loading) return <div>Loading programs...</div>

  if(error) return <div>Error: {error}</div>

return (
  <div className={styles.grid}>
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
)
}