import React, { useState } from 'react'
import styles from './css/Gallery.module.css'
import GalleryHeader from './GalleryHeader'

const IMAGES = new Array(8).fill(0).map((_, i) => 'https://picsum.photos/800/600?random=' + (200 + i))

export default function Gallery(){
  const [open,setOpen] = useState(false)
  const [idx,setIdx] = useState(0)

  function openAt(i){ setIdx(i); setOpen(true) }
  function close(){ setOpen(false) }
  function next(){ setIdx((idx+1)%IMAGES.length) }
  function prev(){ setIdx((idx-1+IMAGES.length)%IMAGES.length) }

  return (
    <div>
      
      <GalleryHeader />
      
      <div className={styles.grid}>
        {IMAGES.map((src,i)=> (
          <button key={i} className={styles.thumb} onClick={()=>openAt(i)}>
            <img src={src} alt="gallery"/>
          </button>
        ))}
      </div>

      {open && (
        <div className={styles.lightbox} onClick={close}>
          <button className={styles.prev} onClick={(e)=>{e.stopPropagation(); prev()}}>‹</button>
          <img src={IMAGES[idx]} alt="full"/>
          <button className={styles.next} onClick={(e)=>{e.stopPropagation(); next()}}>›</button>
        </div>
      )}
    </div>
  )
}
