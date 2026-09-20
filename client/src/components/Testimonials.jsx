import React, { useState, useEffect } from 'react'
import styles from './css/Testimonials.module.css'

const TESTIMONIALS = [
  {name:'Lindiwe',text:'Thindisa helped my child catch up in math and feel confident again. The tutors were patient and caring.'},
  {name:'Samuel',text:'The team supported our family through a difficult time and helped us find stable housing.'},
  {name:'Ayesha',text:'My son enjoys the life skills workshops — he feels more prepared for work and daily life.'}
]

export default function Testimonials(){
  const [idx,setIdx] = useState(0)

  function next(){ setIdx((s)=>(s+1)%TESTIMONIALS.length) }
  function prev(){ setIdx((s)=>(s-1+TESTIMONIALS.length)%TESTIMONIALS.length) }

  useEffect(()=>{
    const t = setInterval(()=> next(), 5000)
    return ()=> clearInterval(t)
  },[])

  return (
    <div className={styles.wrap}>
      <button onClick={prev} className={styles.nav} aria-label="Previous">‹</button>
      <blockquote className={styles.card}>
        <p>“{TESTIMONIALS[idx].text}”</p>
        <footer>- {TESTIMONIALS[idx].name}</footer>
      </blockquote>
      <button onClick={next} className={styles.nav} aria-label="Next">›</button>
    </div>
  )
}
