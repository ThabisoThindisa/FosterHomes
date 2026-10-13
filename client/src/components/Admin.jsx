import { useState,useEffect } from 'react'
import styles from './css/Admin.module.css'
import Header from './SemanticElements/Header'
import NavigationBar from './SemanticElements/NavBar'
import Footer from './SemanticElements/Footer'
import {HandleGetList,addEntryRequest,handleDeleteRequest} from './Helpers/HandleRequests'
import { useNavigate } from 'react-router-dom'

export default function Admin(){

  const navigate = useNavigate()
  const handleRefresh = () => {
    navigate(0); // Navigates to the current path, simulating a refresh
  };

  //Store and set the variavles 
  const [galleryForm, setGalleryForm] = useState(
    { image_url: '', alt_text: '' })
    
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  //Static values to display when

  //1. Add single program 
  const [program, setProgram] = useState(
    { ad_name: '', ad_description: '',
     ad_eligibility_requirements: '' })

  const [Display_allPrograms, setAllPrograms] = useState([]) //Display all programs
  const [Display_Allstories, setAllStories] = useState([])
  const [gallery, setGallery] = useState([])
  const [Allgallery, setAllGallery] = useState([])
  const [file, setFile] = useState(null)

    //--------The add single the program----
    async function Add_Programs(event) {
    event.preventDefault()

      try {
          const savedProgram = await addEntryRequest(program,'/AddPrograms')
        setAllPrograms((currentPrograms) => [...currentPrograms, savedProgram])
        setProgram({ ad_name: '', ad_description: '', ad_eligibility_requirements: '' })
        setMessage('Program added successfully.')
        
      } catch (error) {
        setMessage(error.message)
      }
  }

     //------------------Retrieve available programs---------------
  useEffect(() => {
      const fetchPrograms = async () => {
          try {
              const programsList = await HandleGetList('/getPrograms');
              setAllPrograms(programsList);
          } catch (fetchError) {
              setError(fetchError.message);
          }
      };
      fetchPrograms();
  
  }, []);

  //-------------Get The images saved-----------
    useEffect(() => {
      const image_List = async () => {
          try {
              const Req_list = await HandleGetList('/getAllImages');
              setAllGallery(Req_list);
          } catch (fetchError) {
              setError(fetchError.message);
          }
      };
      image_List();
  
  }, []);

//---------------------------Get stories/ OurStoriess---------------
useEffect(() => {

    const fetchStories = async () => {
        try {
            const storiesList = await HandleGetList('/getStories');
            setAllStories(storiesList);
        } catch (fetchError) {
            setError(fetchError.message);
        }
    };

    fetchStories();

}, []);

//------------------Add single image-------
const Add_Gallery_Image = async (event) => {
  event.preventDefault()
  if (!file) {
    setMessage('Please select an image.')
    return
  }
  if (!galleryForm.alt_text.trim()) {
    setMessage('Please enter alternative text for the image.')
    return
  }
  try {
    // Create FormData
    const formData = new FormData()
    formData.append('image', file)
    formData.append('alt_text', galleryForm.alt_text)
    const savedGallery =  await addEntryRequest(formData,'/AddPictures')

    // Add the returned image information to React state
    setGallery((currentGallery) => [
      ...currentGallery,
      savedGallery
    ])
    setFile(null)
    setGalleryForm({
      alt_text: ''
    })
    event.target.reset()
    setMessage('Gallery image added successfully.')
  } catch (error) {
    console.error('Gallery upload error:', error)
    setMessage(error.message)
  }
}
   
 //handle file upload
   const handleFileUpload = (event) => {
    const selectedFile = event.target.files?.[0] || null
    setFile(selectedFile)
  }

  const deleteProgram = async (programId) => {
    try {
      const deletedProgram = await handleDeleteRequest('/deleteProgram', 'program', programId)
      if (deletedProgram) {
        setAllPrograms((currentPrograms) => currentPrograms.filter((item) => item.program_id !== programId))
        setMessage('Program deleted successfully.')
      }
    } catch (error) {
      console.error('Error deleting program:', error)
      setMessage(error.message || 'Error deleting program.')
    }
  }

  // Remove the story based on its id
  const deleteStory = async (storyId) => {
    try {
      const deletedStory = await handleDeleteRequest('/DeleteStory', 'story', storyId)
      if (deletedStory) {
        setAllStories((currentStories) => currentStories.filter((story) => story.Story_id !== storyId))
        setMessage('Story deleted successfully.')
      }
    } catch (error) {
      console.error('Error deleting story:', error)
      setMessage(error.message || 'Error deleting story.')
    }
  }

  const removePicture = (pictureId) => {
    if (!window.confirm('Delete this picture from the list?')) return
    setGallery((currentGallery) =>
      currentGallery.filter((image) => (image.gallery_id || image.image_id) !== pictureId)
    )
    setMessage('Picture removed from the list.')
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
          <input required placeholder="Program name" value={program.ad_name} onChange={(event) => setProgram({ ...program, ad_name: event.target.value })} />
          <textarea required placeholder="Description" value={program.ad_description} onChange={(event) => setProgram({ ...program, ad_description: event.target.value })} />
          <input placeholder="Eligibility requirements" value={program.ad_eligibility_requirements} onChange={(event) => setProgram({ ...program, ad_eligibility_requirements: event.target.value })} />
          <button type="submit" className={styles.submitButton}>Add program</button>
        </form>
       {/*-------Upload the image/ Picture--------------  */}
         <form onSubmit={Add_Gallery_Image} className={styles.form}>
    <h2>Add gallery picture</h2>

    {/* Select an image */}
    <input
        type="file"
        accept="image/*"
        required
        onChange={handleFileUpload}
    />

    {/* Alt text */}
  <input
       type="text"
       placeholder="Image description"
       value={galleryForm.alt_text}
       onChange={(event) =>
       setGalleryForm({
       ...galleryForm,
       alt_text: event.target.value
      })
       }
  required
  />

    <button type="submit" className={styles.submitButton}>
        Upload Picture
    </button>
</form>
       {/*----------------------------  */}
      </section>
      <section className={styles.list}>
        <h2>Programs</h2>{Display_allPrograms.map((item) => <article key={item.program_id}>
          <span><strong>{item.ad_name}</strong>
          <small>{item.ad_description}</small>
          </span>
          <button type="button" onClick={() => deleteProgram(item.program_id)}>Delete
          </button>
          </article>)}</section>

      <section className={styles.list}><h2>Stories</h2>{Display_Allstories.map((story) => <article key={story.Story_id}><span>
        <strong>{story.title}</strong><small>{story.content}</small>
        </span><button type="button" onClick={() => deleteStory(story.Story_id)}>Delete</button></article>)}</section>
      <section className={styles.list}><h2>Gallery</h2>
      {Allgallery.map((image) => <article key={image.id}><span>
        <strong>{image.alt_text || 'Gallery picture'}</strong>
        <small>{'TYPE: '+image.image_type}</small></span>
        <button type="button" onClick={() => removePicture(image.id)}>Delete</button>
        </article>)}</section>
      
    <button 
      
    style={{
    backgroundColor: '#4175af',color: 'white',border: 'none',
    padding: '22px 24px',borderRadius: '8px',fontSize: '16px', fontWeight: '600',
    marginTop: '10px',marginRight: '10px',cursor: 'pointer'
  }}
      
      onClick={() => navigate("/SeeAplication")} >View Adoption applications
      </button>
      <button 
      
    style={{
    backgroundColor: '#4175af',color: 'white',border: 'none',padding: '22px 24px',borderRadius: '8px',fontSize: '16px',
    fontWeight: '600',marginTop: '10px',marginRight: '10px',cursor: 'pointer'
  }}
      
      onClick={() => navigate("/SocialWorkers")}>View Queries.
      </button>
      </main>
     <Footer />
    </>
  )
}
