import { useState, useEffect } from 'react'
import styles from './css/Testimonials.module.css'
import Header from './SemanticElements/Header'
import NavigationBar from './SemanticElements/NavBar';
import Footer from './SemanticElements/Footer'

const Api_connection ='http://localhost:4000/api';

export default function Testimonials(){

  //Store and set the variavles 
   const [Stories, setStories] = useState([]) //All stored testimonial /Stories

     const [message, setMessage] = useState('')

     //Store the story as (news_id, title, content, author_id, published_at, is_published)
     //Stores the current story/ Testimonial data
     const [myStory, setStory] = useState({ title: '',
       content: '',
       author_id: '',
       published_at: '',
      is_published: '1', })  

     //-----------------Add single testimonial from the current user---------------
    async function Add_Testimonial(event) {
    event.preventDefault()

      try {
        const response = await fetch(Api_connection + '/AddStory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(myStory)
        })

        if (!response.ok) throw new Error('Unable to add story.')

        const saved_Story = await response.json()
        setStories((current_Story) => [...current_Story, saved_Story])
        //news_id title content author_id published_at is_published

        
        const timestamp = new Date().toISOString() //Generate current time stamp
        setStory({ title: '', content: '',author_id: '4', published_at: '' })
        setMessage('Story added successfully.')
        
      } catch (error) {
        setMessage(error.message)
      }
  }

     //-------------------Retrieve available Stories/ Testimonials---------------------
    useEffect(() => {
      fetch(Api_connection +'/getStories')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch stories')
          }
          return response.json()
        })
       .then((data) => {
        setStories(data.data ?? data)
  })
        .catch((fetchError) => {
          setError(fetchError.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }, [])
  

  return (
    <>
      <NavigationBar />
      <main className="dashboard">
      <Header
        eyebrow="Stories from our community"
        title="Testimonials"
        description="Hear how our support has helped families move forward."
      />

          <form>
      <label className={styles.WriteLabel}>Write your story</label>
      <label className={styles.StaticLabel}>Write the title of your story:
     <textarea
          className={styles.titleInput}
            name="title"
            value={myStory.title}
          onChange={(event) =>
         setStory({
            ...myStory,
             title: event.target.value
    })
  }
/>
      </label>

       <label className={styles.StaticLabel}>Write the story:
      <textarea className={styles.storyInput}
                name="content"
                value={myStory.content}
               onChange={(event) =>
         setStory({...myStory,
                 content: event.target.value
    })
  }
/>
      </label>
      <button type="submit" className={styles.sendButton} > Send Message </button>
      <label className={styles.DisplayLabel}>Our Testemonial from our community.</label>
    </form>

    {/*news_id	title,content,author_id,published_at,is_published */}

      <section className={styles.flexContainer}>
        {Stories.map((story) => (
          <article key={story.news_id} className={`${styles.card} ${styles.flexItem}`}>
            <div className={styles.body}>
              <h3>{story.title}</h3>
              <p>{story.content}</p>

              {story.content && (
                <small>
                  Published at: {story.published_at.slice(0, 10) +' Time: '+story.published_at.slice(12, 16)}
                </small>
              )}
            </div>
          </article>
        ))}
      </section>
      </main>
      <Footer />
    </>
  )
}
