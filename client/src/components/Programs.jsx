// src/components/Programs.jsx
import React, {useEffect, useState} from 'react'
import styles from './CardGrid.module.css'

export default function Programs(){
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

    const [message, setMessage] = useState('')
  
    useEffect(() => {
    fetch('http://localhost:5000/api/messageTest')
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }, [])


   useEffect(() => {
          fetch('http://localhost:5000/api/messageTest')
              .then((response) => response.json())
              .then((data) => {
                  setPrograms(data);
                  setLoading(false);
              })
              .catch((error) => {
                  console.error("Error:", error);
                  setError(error.message);
                  setLoading(false);
              });
      }, []);

  if(loading) return <div>Loading programs...</div>

  if(error) return <div>Error: {error}</div>

  return (
    <div className={styles.grid}>
      {message.map(p => (
        <article key={p.program_id} className={`${styles.card} card`}>
          <div className={styles.body}>
            <h3>{p.program_name}</h3>
            <p>{p.description}</p>
            <small>{p.eligibility_requirements}</small>
          </div>
        </article>
      ))}
    </div>
  )
}