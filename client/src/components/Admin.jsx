import React, { useState } from 'react'
import styles from './css/Admin.module.css'
import Header from './Header'
import NavigationBar from './NavBar'

const INITIAL_PROGRAMS = [
  {
    program_id: 1,
    ad_name: 'Foster Care Support',
    ad_description: 'Guidance and support for families providing temporary care.',
    ad_eligibility_requirements: 'Approved foster families'
  },
  {
    program_id: 2,
    ad_name: 'Family Reunification',
    ad_description: 'Resources that help children and families reconnect safely.',
    ad_eligibility_requirements: 'Families working with a case manager'
  }
]

const INITIAL_STORIES = [
  { news_id: 1, title: 'A welcoming community', content: 'Every child deserves a safe and supportive home.' },
  { news_id: 2, title: 'Growing together', content: 'Our families build lasting connections through care and understanding.' }
]

const INITIAL_GALLERY = [
  { gallery_id: 1, image_url: 'https://picsum.photos/800/600?random=201', alt_text: 'Community gathering' },
  { gallery_id: 2, image_url: 'https://picsum.photos/800/600?random=202', alt_text: 'Family activity' }
]

export default function Admin(){

  //Store and set the variavles 
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS)
  const [stories, setStories] = useState(INITIAL_STORIES)
  const [gallery, setGallery] = useState(INITIAL_GALLERY)
  const [program, setProgram] = useState({ ad_name: '', ad_description: '', ad_eligibility_requirements: '' })
  const [picture, setPicture] = useState({ image_url: '', alt_text: '' })
  const [message, setMessage] = useState('')

  function addProgram(event) {
    event.preventDefault()
    setPrograms((currentPrograms) => [
      ...currentPrograms,
      { ...program, program_id: Date.now() }
    ])
    setProgram({ ad_name: '', ad_description: '', ad_eligibility_requirements: '' })
    setMessage('Program added locally.')
  }

  function addPicture(event) {
    event.preventDefault()
    setGallery((currentGallery) => [
      ...currentGallery,
      { ...picture, gallery_id: Date.now() }
    ])
    setPicture({ image_url: '', alt_text: '' })
    setMessage('Picture added to the gallery locally.')
  }

  function remove(id, type, label) {
    if (!window.confirm('Delete this '+ label)) return
    if (type === 'program') setPrograms((items) => items.filter((item) => item.program_id !== id))
    if (type === 'story') setStories((items) => items.filter((item) => item.news_id !== id))
    if (type === 'picture') setGallery((items) => items.filter((item) => (item.gallery_id || item.image_id) !== id))
    setMessage(`${label[0].toUpperCase()}${label.slice(1)} deleted locally.`)
  }

  return (
    <>
      <NavigationBar />
      <main className="dashboard">
      <Header eyebrow="Content management" 
            title="Administrative access"  
            description="Manage programs, community stories, and gallery images." />
      {message && <p className={styles.message} role="status">{message}</p>}
      <section className={styles.forms}>
        <form onSubmit={addProgram} className={styles.form}>
          <h2>Add program</h2>
          <input required placeholder="Program name" value={program.ad_name} onChange={(event) => setProgram({ ...program, ad_name: event.target.value })} />
          <textarea required placeholder="Description" value={program.ad_description} onChange={(event) => setProgram({ ...program, ad_description: event.target.value })} />
          <input placeholder="Eligibility requirements" value={program.ad_eligibility_requirements} onChange={(event) => setProgram({ ...program, ad_eligibility_requirements: event.target.value })} />
          <button type="submit" className={styles.submitButton}>Add program</button>
        </form>
        <form onSubmit={addPicture} className={styles.form}>
          <h2>Add gallery picture</h2>
          <input required type="url" placeholder="Image URL" value={picture.image_url} onChange={(event) => setPicture({ ...picture, image_url: event.target.value })} />
          <input placeholder="Alt text" value={picture.alt_text} onChange={(event) => setPicture({ ...picture, alt_text: event.target.value })} />
          <button type="submit">Add picture</button>
        </form>
      </section>
      <section className={styles.list}>
        <h2>Programs</h2>{programs.map((item) => <article key={item.program_id}>
          <span><strong>{item.ad_name}</strong>
          <small>{item.ad_description}</small>
          </span><button onClick={() => remove(item.program_id, 'program', 'program')}>Delete</button></article>)}</section>
      <section className={styles.list}><h2>Stories</h2>{stories.map((story) => <article key={story.news_id}><span>
        <strong>{story.title}</strong><small>{story.content}</small>
        </span><button onClick={() => remove(story.news_id, 'story', 'story')}>Delete</button></article>)}</section>
      <section className={styles.list}><h2>Gallery</h2>{gallery.map((image) => <article key={image.gallery_id || image.image_id}><span><strong>{image.alt_text || 'Gallery picture'}</strong><small>{image.image_url || image.url}</small></span><button onClick={() => remove(image.gallery_id || image.image_id, 'picture', 'picture')}>Delete</button></article>)}</section>
      </main>
    </>
  )
}
