import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './css/NavBar.module.css'

const LINKS = [
  { label: 'Home', to: '/HomePage' },
  { label: 'Programs', to: '/programs' },
  { label: 'Testimonial', to: "/Testimonial" },
  { label: 'Gallery', to: "/Gallery"},
  { label: 'Contact', href: '#contact' },
  { label: 'Signout', to: "/HomePage" }
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
        {LINKS.map(l=> (
          (l.href || l.to).startsWith("*")
            ? <Link key={l.label} to={l.href || l.to} onClick={()=>setOpen(false)}>{l.label}</Link>
            : <a key={l.label} href={l.href || l.to} onClick={()=>setOpen(false)}>{l.label}</a>
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
