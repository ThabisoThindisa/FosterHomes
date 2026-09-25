import { useState, useEffect } from 'react'
import styles from './css/Testimonials.module.css'
import Header from './SemanticElements/Header'
import NavigationBar from './SemanticElements/NavBar';
import Footer from './SemanticElements/Footer'

const Api_connection ='http://localhost:4000/api';

export default function Testimonials(){

  //Store and set the variavles 
   const [Stories, setStories] = useState([])

     const [myTitle, setTitle] = useState("");
     const [myContent, setContent] = useState("");

     //Function to handle creation messages from the users.
function creatMessages(e) {
  const { name, value } = e.target;

  if (name === 'title') {
    setTitle(value);
  } else if (name === 'content') {
    setContent(value);
  }
}
  const handleSendMessage = async () => {

    //Use # to seperate the message charecters later
    UserStory = myTitle+'#'+myContent;

    if (!UserStory.trim()) return; //Remove all empty charecters before the string of after

    await fetch('/api/Stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: UserStory }),
    });

    setText(''); // Clear the input field after sending
  };

     //Retrieve available programs
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
          value={myTitle}
          onChange={creatMessages}
        />
      </label>

       <label className={styles.StaticLabel}>Write the story:
        <textarea
         className={styles.storyInput}
          name="content"
          value={myContent}
          onChange={creatMessages}
        />
      </label>
      <button className={styles.sendButton} onClick={handleSendMessage}>Send Message</button>
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
