import { useState, useEffect } from 'react'
import { Link,useNavigate  } from 'react-router-dom'
import logo from '../../images/logo.png'
import styles from '../css/NavBar.module.css'

// The links to each page
const LINKS = [
  { label: 'Home', to: '/HomePage' },
  { label: 'Admin', to: '/Admin', adminOnly: true },
  { label: 'Programs', to: '/programs' },
  { label: 'Testimonial', to: '/Testimonial' },
  { label: 'Gallery', to: '/Gallery' },
  { label: 'Contact', to: '/contacts' },
  { label: 'Sign-Out', to: "/logout", action: 'logout' }
]

export default function NavBar() {

  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userState, setUserState] = useState(null)
  const [mode, setMode] = useState('login')

  // API connection
  const API_URL = 'http://localhost:4000/api'
  const navigate = useNavigate();

  const handleRefresh = () => {
    navigate(0); // Navigates to the current path, simulating a refresh
  };

  // Logout function
  async function logout() {
  try {
    const response = await fetch(API_URL + '/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    if (response.ok) {
      setUserState(null)
      setIsAdmin(false)
      setMode('login')
      setOpen(false)
    }
  } catch (error) {
    console.error('Logout error:', error)
  }
}

  // Check if the user is an admin
  useEffect(() => {

    fetch(API_URL + '/auth/me', {
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return null
        }
      })
      .then((data) => {
        setUserState(data?.user || null)
        setIsAdmin(data?.user?.role === 'admin')
        
      })
      .catch(() => {
        setIsAdmin(false)
        setUserState(null)
      })

  }, [])

  return (
    <header className={styles.header} >
   
      <div className={styles.brand}>
        <img
      src={logo}
      alt="Thindisa FosterHome logo"
      className={styles.logo}
      onClick={() => navigate("/HomePage")}
    />


        <span>Thindisa FosterHome</span>
      </div>

      <nav className={`${styles.nav} ${open ? styles.open : ''}`}>

        {LINKS
          .filter((link) => !link.adminOnly || isAdmin)
          .map((Nav_item) => (

                Nav_item.action === 'logout' ? (
           <a
           key={Nav_item.label}
          to="/dashboard"
           onClick={(event) => {
            event.preventDefault()
            logout()
            handleRefresh()
        }}
         >
        {Nav_item.label}
    </a>
            ): (

              // NORMAL NAVIGATION LINKS
              <Link
                key={Nav_item.label}
                to={Nav_item.to}
                onClick={() => setOpen(false)}
              >
                {Nav_item.label}
              </Link>

            )

          ))}

      </nav>

      <button
        className={styles.hamburger}
        aria-label="Menu"
        onClick={() => setOpen(v => !v)}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

    </header>
  )
}