import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './css/NavBar.module.css'

const LINKS = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Programs', href: '/programs' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'Gallery', href: '#gallery' },
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
        {LINKS.map(l=> (
          l.href.startsWith('/')
            ? <Link key={l.href} to={l.href} onClick={()=>setOpen(false)}>{l.label}</Link>
            : <a key={l.href} href={l.href} onClick={()=>setOpen(false)}>{l.label}</a>
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
