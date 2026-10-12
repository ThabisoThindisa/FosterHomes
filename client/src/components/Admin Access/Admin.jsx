import { useState,useEffect } from 'react'
import styles from './css/Admin.module.css'
import Header from './SemanticElements/Header'
import NavigationBar from './SemanticElements/NavBar'
import Footer from './SemanticElements/Footer'
import {HandleGetList,addEntryRequest,handleDeleteRequest} from './Helpers/HandleRequests'
import { useNavigate } from 'react-router-dom'

export default function Admin(){

  const navigate = useNavigate();

  const handleRefresh = () => {
    navigate(0); // Navigates to the current path, simulating a refresh
  };

  //Store and set the variavles 
  const [galleryForm, setGalleryForm] = useState(
    { image_url: '', alt_text: '' })
    
  const [message, setMessage] = useState('')

  //Static values to display when

  //1. Add single program 
  const [program, setProgram] = useState(
    { ad_name: '', ad_description: '',
     ad_eligibility_requirements: '' })

  const [Display_allPrograms, setAllPrograms] = useState([]) //Display all programs
  const [Display_Allstories, setAllStories] = useState([])
  const [gallery, setGallery] = useState([])
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
              console.error(fetchError.message);
          }
      };
      fetchPrograms();
  
  }, []);

//---------------------------Get stories/ OurStoriess---------------
useEffect(() => {

    const fetchStories = async () => {
        try {
            const storiesList = await HandleGetList('/getStories');
            setAllStories(storiesList);
        } catch (fetchError) {
            console.error(fetchError.message);
        }
    };

    fetchStories();

}, []);

//---------------------------Delete a program---------------;

const handleDeleteProgram = async (id) => {
    if (!id && id !== 0) return;

    try {
        const deletedProgram = await handleDeleteRequest('/deleteProgram', 'program', id);

        if (deletedProgram) {
            setAllPrograms((prevPrograms) =>
                prevPrograms.filter((program) => program.program_id !== id)
            );
            setMessage('Program deleted successfully.');
        }
    } catch (error) {
        console.error('Delete program error:', error);
        setMessage(error.message || 'Failed to delete program.');
    }
};

//---------------------------Delete a story---------------;

const handleDeleteStory = async (id) => {
    if (!id && id !== 0) return;

    try {
        const selectedStory = await handleDeleteRequest('/DeleteStory', 'story', id);

        if (selectedStory) {
            setAllStories((prevStories) =>
                prevStories.filter((story) => story.Story_id !== id)
            );
            setMessage('Story deleted successfully.');
        }
    } catch (error) {
        console.error('Delete story error:', error);
        setMessage(error.message || 'Failed to delete story.');
    }
};

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


  function remove(id, type, label) {
    if (!window.confirm('Delete this '+ label)) return
    if (type === 'program')
       setAllPrograms((items) => items.filter((item) =>
       item.program_id !== id))

    if (type === 'story') setAllStories((items) => 
      items.filter((item) => 
        item.Story_id !== id))

    if (type === 'picture')
       setGallery((items) =>
       items.filter((item) => 
        (item.gallery_id || item.image_id) !== id))

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
         <button
            type="button"
            onClick={() => handleDeleteProgram(item.program_id)}
        > Delete
        </button>
          </article>)}</section>

      <section className={styles.list}><h2>Stories</h2>{Display_Allstories.map((story) => <article key={story.Story_id}><span>
        <strong>{story.title}</strong><small>{story.content}</small>
        </span>
            <button
            type="button"
            onClick={() => handleDeleteStory(story.Story_id)}
        > Delete
        </button>

        </article>)}</section>
      <section className={styles.list}><h2>Gallery</h2>{gallery.map((image) => <article key={image.gallery_id || image.image_id}><span><strong>{image.alt_text || 'Gallery picture'}</strong><small>{image.image_url || image.url}</small></span><button onClick={() => remove(image.gallery_id || image.image_id, 'picture', 'picture')}>Delete</button></article>)}</section>
      </main>
     <Footer />
    </>
  )
}
