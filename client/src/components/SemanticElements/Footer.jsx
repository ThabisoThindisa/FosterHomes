import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      background: '#1f2d3d',
      color: '#f3f4f6',
      padding: '2rem 1.5rem 1rem',
      marginTop: '3rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>Thindisa Foster Home</h3>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#d1d5db' }}>
            Supporting families with care, safety, and belonging.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: '0.75rem' }}>Explore</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, lineHeight: 1.8 }}>
            <li><a href="/HomePage" style={{ color: '#fff', textDecoration: 'none' }}>Home</a></li>
            <li><a href="/programs" style={{ color: '#fff', textDecoration: 'none' }}>Programs</a></li>
            <li><a href="/Testimonial"style={{ color: '#fff', textDecoration: 'none' }}>Testimonials</a></li>
            <li><a href="/Gallery" style={{ color: '#fff', textDecoration: 'none' }}>Gallery</a></li>
            <li><a href="/contacts" style={{ color: '#fff', textDecoration: 'none' }}>Contact us</a></li>
            </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '0.75rem' }}>Contact</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, lineHeight: 1.8 }}>
            <li>Email: hello@thindisa.org</li>
            <li>Phone: +27 00 000 0000</li>
            <li>Location: South Africa</li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1100px',
        margin: '1.5rem auto 0',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.15)',
        textAlign: 'center',
        color: '#cbd5e1',
        fontSize: '0.9rem'
      }}>
        © 2026 Thindisa Foster Home. All rights reserved.
      </div>
    </footer>
  )
}
