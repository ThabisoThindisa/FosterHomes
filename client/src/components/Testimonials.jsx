import React, { useState, useEffect } from 'react'
import styles from './css/Testimonials.module.css'
import Header from './Header'
import NavigationBar from './NavBar'

const Api_connection ='http://localhost:4000/api';

export default function Testimonials(){

  //Store and set the variavles 
   const [Stories, setStories] = useState([])

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
    {/*news_id	title,content,author_id,published_at,is_published */}

      <section className={styles.flexContainer}>
        {Stories.map((story) => (
          <article key={story.news_id} className={`${styles.card} ${styles.flexItem}`}>
            <div className={styles.body}>
              <h3>{story.title}</h3>
              <p>{story.content}</p>

              {story.content && (
                <small>
                  Published at: {story.published_at.slice(0, 10) +' Time: '+story.published_at.slice(12, 20)}
                </small>
              )}
            </div>
          </article>
        ))}
      </section>
      </main>
    </>
  )
}
