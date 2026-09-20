import React, { useState, useEffect } from 'react'
import styles from './css/NavBar.module.css'
import { Link } from 'react-router-dom'


//The navigation link
const LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Programs', to: '/programs' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', href: '#contact' }
]

export default function NavBar(){
  const [open,setOpen] = useState(false)

  useEffect(()=>{
    const onResize = ()=> setOpen(false)
    window.addEventListener('resize', onResize)
    return ()=> window.removeEventListener('resize', onResize)
  },[])

  return (
     <header className={styles.header}>
      <div className={styles.brand}>Thindisa FosterHome</div>
      <nav className={`${styles.nav} ${open?styles.open:''}`}>
        {LINKS.map(l => l.to ? (
          <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>
        ) : (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
      </nav>
      <button className={styles.hamburger} aria-label="Menu" onClick={()=>setOpen(v=>!v)}>
        <span className={styles.bar}/>
        <span className={styles.bar}/>
        <span className={styles.bar}/>
      </button>
    </header>
  )
}
