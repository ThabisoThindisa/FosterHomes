import React, { useState, useEffect } from 'react'
import styles from './css/src/components/css/BackToTop.module.css'

//import styles from './BackToTop.module.css'

export default function BackToTop(){
  const [show,setShow] = useState(false)
  useEffect(()=>{
    const onScroll = ()=> setShow(window.scrollY>300)
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  if(!show) return null
  return (
    <button className={styles.btn} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top">↑</button>
  )
}
