import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logo.png'
import styles from './css/NavBar.module.css'

//The links to each page
const LINKS = [
  { label: 'Home', to: '/HomePage' },
  { label: 'Admin', to: "/Admin", adminOnly: true },
  { label: 'Programs', to: '/programs' },
  { label: 'Testimonial', to: "/Testimonial" },
  { label: 'Gallery', to: "/Gallery"},
  { label: 'Contact', to: "/contacts" },
  { label: 'Signout', to: "/dashboard" }
]

export default function NavBar(){
  const [open,setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const API_URL = 'http://localhost:4000/api'

    fetch(API_URL+ '/auth/me', { credentials: 'include' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setIsAdmin(data?.user?.role === 'admin'))
      .catch(() => setIsAdmin(false))
  }, [])

  useEffect(()=>{
    const onResize = ()=> setOpen(false)
    window.addEventListener('resize', onResize)
    return ()=> window.removeEventListener('resize', onResize)
  },[])

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img src={logo} alt="Thindisa FosterHome logo" className={styles.logo} />
        <span>Thindisa FosterHome</span>
      </div>
      <nav className={`${styles.nav} ${open?styles.open:''}`}>
        {LINKS.filter((link) => !link.adminOnly || isAdmin).map(l=> (
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
