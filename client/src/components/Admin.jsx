import { useState,useEffect } from 'react'
import styles from './css/Admin.module.css'
import Header from './Header'
import NavigationBar from './NavBar'

const INITIAL_STORIES = [
  { news_id: 1, title: 'A welcoming community', content: 'Every child deserves a safe and supportive home.' },
  { news_id: 2, title: 'Growing together', content: 'Our families build lasting connections through care and understanding.' }
]

const INITIAL_GALLERY = [
  { gallery_id: 1, image_url: 'https://picsum.photos/800/600?random=201', alt_text: 'Community gathering' },
  { gallery_id: 2, image_url: 'https://picsum.photos/800/600?random=202', alt_text: 'Family activity' }
]

export default function Admin(){


    //My basic api connection running on port 4000
    const Api_connection = 'http://localhost:4000/api'

  //Store and set the variavles 
  
  const [program, setProgram] = useState({ ad_name: '', ad_description: '', ad_eligibility_requirements: '' })
  const [galleryForm, setGalleryForm] = useState({ image_url: '', alt_text: '' })
  const [message, setMessage] = useState('')
  const [Display_allPrograms , setAllPrograms] = useState([])

  //Static values to display when
  const [stories, setStories] = useState(INITIAL_STORIES)
  const [del_Program, seDelProgram] = useState([])
  const [Add_programs, setPrograms] = useState([])
  const [gallery, setGallery] = useState(INITIAL_GALLERY)

    //The addmin has access to add the programs
    async function Add_Programs(event) {
    event.preventDefault()

      try {
        const response = await fetch(Api_connection + '/api/AddPrograms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(program)
        })

        if (!response.ok) throw new Error('Unable to add program.')

        const savedProgram = await response.json()
        setPrograms((currentPrograms) => [...currentPrograms, savedProgram])
        setProgram({ ad_name: '', ad_description: '', ad_eligibility_requirements: '' })
        setMessage('Program added successfully.')
      } catch (error) {
        setMessage(error.message)
      }
  }

  //Diplay programs.
 useEffect(() => {
    fetch(Api_connection +'/getPrograms')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch programs')
        }
        return response.json()
      })
     .then((data) => {
      const programsList = data.data ?? data

  setAllPrograms(programsList)
})
      .catch((fetchError) => {
        setError(fetchError.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])


   
 //handle file upload
   const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };


  //Upload gallery images
  async function add_Gallery(event) {
     event.preventDefault()

      try {
        const response = await fetch(Api_connection + '/api/AddPictures', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(galleryForm)
        })

        if (!response.ok) throw new Error('Unable to add gallery image.')

        const savedGallery = await response.json()
        setGallery((currentGallery) => [...currentGallery, savedGallery])
        setGalleryForm({ image_url: '', alt_text: '' })
        setMessage('Gallery image added successfully.')
      } catch (error) {
        setMessage(error.message)
      }
  }

  const delete_Program = async (ProgramID) => {
  try {
    const response = await fetch(Api_connection +'/deleteUser/'+ ProgramID, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data.message);

      // Remove the deleted user from the React state
      seDelProgram(del_Program.filter(user =>
             del_Program.ProgramID !== ProgramID));
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

  function remove(id, type, label) {
    if (!window.confirm('Delete this '+ label)) return
    if (type === 'program') setAllPrograms((items) => items.filter((item) => item.program_id !== id))
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
        <form onSubmit={Add_Programs} className={styles.form}>
          <h2>Add program</h2>
          <input required placeholder="Program name" value={Add_programs.ad_name} onChange={(event) => setProgram({ ...Add_programs, ad_name: event.target.value })} />
          <textarea required placeholder="Description" value={Add_programs.ad_description} onChange={(event) => setProgram({ ...Add_programs, ad_description: event.target.value })} />
          <input placeholder="Eligibility requirements" value={Add_programs.ad_eligibility_requirements} onChange={(event) => setProgram({ ...Add_programs, ad_eligibility_requirements: event.target.value })} />
          <button type="submit" className={styles.submitButton}>Add program</button>
        </form>
        <form onSubmit={add_Gallery} className={styles.form}>
          <h2>Add gallery picture</h2>
          <input required type="url" placeholder="Image URL" value={galleryForm.image_url.trim()} onChange={(event) => setGalleryForm({ ...galleryForm, image_url: event.target.value })} />
          <input placeholder="Alt text" value={galleryForm.alt_text.trim()} onChange={(event) => setGalleryForm({ ...galleryForm, alt_text: event.target.value })} />
          {/* onChange={(event) => setProgram({ ...program, ad_name: event.target.value })} />*/}
          <button type="submit" onChange={(event) => handleFileUpload }>Add picture</button>
        </form>
      </section>
      <section className={styles.list}>
        <h2>Programs</h2>{Display_allPrograms.map((item) => <article key={item.program_id}>
          <span><strong>{item.ad_name}</strong>
          <small>{item.ad_description}</small>
          </span><button onClick={() => {delete_Program(item.program_id)
                                         remove(item.program_id, 'program', 'program')}}>Delete
</button></article>)}</section>
      <section className={styles.list}><h2>Stories</h2>{stories.map((story) => <article key={story.news_id}><span>
        <strong>{story.title}</strong><small>{story.content}</small>
        </span><button onClick={() => remove(story.news_id, 'story', 'story')}>Delete</button></article>)}</section>
      <section className={styles.list}><h2>Gallery</h2>{gallery.map((image) => <article key={image.gallery_id || image.image_id}><span><strong>{image.alt_text || 'Gallery picture'}</strong><small>{image.image_url || image.url}</small></span><button onClick={() => remove(image.gallery_id || image.image_id, 'picture', 'picture')}>Delete</button></article>)}</section>
      </main>
    </>
  )
}
