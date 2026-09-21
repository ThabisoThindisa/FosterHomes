import React, { useEffect, useState } from 'react'
import styles from './css/Gallery.module.css'
import GalleryHeader from './Header'

//Store the link to connect to the api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Gallery(){
  const [open,setOpen] = useState(false)
  const [idx,setIdx] = useState(0)
   
  //the gallary variables
    //My global variables 
	const [images, setImages] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

  useEffect(() => {
    fetch(API_URL + '/getGallery')
      .then(response => {
        if (!response.ok) throw new Error('Gallery is temporarily unavailable.')
        return response.json()
      })
      .then(data => {
        if (Array.isArray(data)) setImages(data)
      })
      .catch(requestError => {
        console.error('Error:', requestError)
        setError(requestError.message)
      })
      .finally(() => setLoading(false))
  }, [])

  function openAt(index) {
    setIdx(index)
    setOpen(true)
  }

  function close() {
    setOpen(false)
  }

  function next() {
    setIdx(index => (index + 1) % images.length)
  }

  function prev() {
    setIdx(index => (index - 1 + images.length) % images.length)
  }

  function imageUrl(image) {
    if (typeof image === 'string') return image
    return image.image_url || image.image || image.src || image.url
  }

  return (
    <div>
      
      {/*To avoid repeatation use the defual header than modify it*/}
      <GalleryHeader title="Our Galerry" />
      
      <div className={styles.grid}>
        {loading && <p>Loading gallery...</p>}
        {!loading && error && <p>{error}</p>}
        {images.map((image, i) => (
          <button key={i} className={styles.thumb} onClick={() => openAt(i)}>
            <img src={imageUrl(image)} alt="Gallery" />
          </button>
        ))}
      </div>

      {open && (
        <div className={styles.lightbox} onClick={close}>
          <button className={styles.prev} onClick={(e)=>{e.stopPropagation(); prev()}}>‹</button>
          <img src={imageUrl(images[idx])} alt="Full gallery" />
          <button className={styles.next} onClick={(e)=>{e.stopPropagation(); next()}}>›</button>
        </div>
      )}
    </div>
  )
}
