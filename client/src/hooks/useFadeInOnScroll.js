import { useEffect } from 'react'

export default function useFadeInOnScroll(selector = '.fade-in'){
  useEffect(()=>{
    const items = document.querySelectorAll(selector)
    if(!items.length) return
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting) e.target.classList.add('visible')
      })
    },{threshold:0.12})
    items.forEach(i=>obs.observe(i))
    return ()=> obs.disconnect()
  },[selector])
}
