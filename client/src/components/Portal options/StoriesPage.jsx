import { useState, useEffect } from 'react'
import styles from '../css/Testimonials.module.css'
import Header from '../SemanticElements/Header'
import NavigationBar from '../SemanticElements/NavBar';
import Footer from '../SemanticElements/Footer'
import {HandleGetList,addEntryRequest} from '../Helpers/HandleRequests'


export default function StoriesPage(){

  //Store and set the variavles 
   const [Stories, setStories] = useState([]) //All stored OurStories /Stories

     const [message, setMessage] = useState('')

     //Store the story as (Story_id, title, content, author_id, published_at, is_published)
     //Stores the current story/ OurStories data
     const [myStory, setStory] = useState({ title: '',
       content: '',
       author_id: '',
       published_at: '',
      is_published: '1', })  

     //-----------------Add single OurStories from the current user---------------
   async function Add_OurStories(event) {
    event.preventDefault();
    try {

        const saved_Story = await addEntryRequest(myStory,'/AddStory');

        setStories((current_Story) => [
            ...current_Story,
            saved_Story
        ]);

        setStory({
            title: '',
            content: '',
            author_id: '4',
            published_at: '',
            is_published: '1'
        });
        setMessage('Story added successfully.');
    } catch (error) {
        setMessage(error.message);

    }
}

     //-------------------Retrieve available Stories/ OurStoriess---------------------
useEffect(() => {

    const fetchStories = async () => {
        try {
            const storiesList = await HandleGetList('/getStories');
            setStories(storiesList);
        } catch (fetchError) {
            setMessage(fetchError.message);
        }
    };

    fetchStories();

}, []);
  

  return (
    <>
      <NavigationBar />
      <main className="dashboard">
      <Header
        eyebrow="Stories from our community"
        title="Community Stories"
        description="Hear how our support has helped families move forward."
      />

          <form onSubmit={Add_OurStories}>
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
      <button type="submit" className={styles.sendButton}> Send Message </button>
      <label className={styles.DisplayLabel}>Our Stories from our community.</label>
    </form>

      <section className={styles.flexContainer}>
        {Stories.map((story,index =1) => (
          <article key={story.Story_id} className={`${styles.card} ${styles.flexItem}`}>
            <div className={styles.body}>
              <h3>{(index+1)+'. ' + story.title}</h3>
              <p>{story.content}</p>

              {story.published_at && (
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
