import React, { useState, useEffect } from 'react'
import styles from './css/NavBar.module.css'
import { Link } from 'react-router-dom'

//<Link to="/" className={styles.backLink}>Back to portal</Link>

//The navigation link
const LINKS = [
  { label: 'Home', to: '/home' },
  { label: 'Programs', to: '/programs' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', href: '#contact' },
  { label: 'Logout', to: '/' }

]

export default function NavBar({ onLogout }){
  const [open,setOpen] = useState(false)

  useEffect(()=>{
    const onResize = ()=> setOpen(false)
    window.addEventListener('resize', onResize)
    return ()=> window.removeEventListener('resize', onResize)
  },[])

  return (
     <header className={styles.header}>
      <div className={styles.brand}>Thindisa FosterHome</div>
      <nav className={styles.nav + ' ' + (open ? styles.open : '')}>
        {LINKS.map(l => l.to ? (
          <Link
            key={l.to}
            to={l.to}
            onClick={(event) => {
              setOpen(false)
              if (l.label === 'Logout') {
                event.preventDefault()
                onLogout()
              }
            }}
          >
            {l.label}
          </Link>
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
