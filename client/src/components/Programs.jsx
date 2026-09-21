// src/components/Programs.jsx
import React, { useEffect, useState } from 'react'
import styles from './css/CardGrid.module.css'

//Use this connection.
const Api_connection ='http://localhost:4000/api';

export default function Programs(){
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

    useEffect(() => {
      fetch( Api_connection+'/getPrograms')
        .then((response) => response.json())
        .then((data) => {
          setPrograms(data)
          setLoading(false)
        })
        .catch((fetchError) => {
          setError(fetchError.message)
          setLoading(false)
        })
    }, [])

  if(loading) return <div>Loading programs...</div>

  if(error) return <div>Error: {error}</div>

  return (
    <div className={styles.grid}>
      {programs.map(p => (
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