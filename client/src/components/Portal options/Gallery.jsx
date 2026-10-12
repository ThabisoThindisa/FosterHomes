import { useEffect, useState } from 'react';
import NavigationBar from "../SemanticElements/NavBar";
import Header from "../SemanticElements/Header";
import Footer from '../SemanticElements/Footer'
import { API_URL, getGallery } from '../Helpers/HandleRequests'
import styles from '../css/Gallery.module.css'


export default function Gallery() {
  const [pictures, setPictures] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPictures() {
      try {
        setPictures(await getGallery());
      } catch (fetchError) {
        console.error('Error loading gallery:', fetchError);
        setError('Unable to load gallery images.');
      }
    }

    loadPictures();
  }, []);

  const getImageSource = (imageUrl) => {
    if (/^(https?:|data:)/i.test(imageUrl)) return imageUrl;
    if (/^\/uploads\//i.test(imageUrl) && /^https?:\/\//i.test(API_URL)) {
      return new URL(imageUrl, API_URL).toString();
    }
    return imageUrl;
  };

  return (

      <>
          <NavigationBar />
          <main className="dashboard">
            <Header
              eyebrow="A glimpse into our journey"
              title="Gallery"
              description="Explore moments of care, connection, and belonging."
            />
    <div className={styles.container}>

      {error && <p role="alert">{error}</p>}

      <div className={styles.grid}>
        {pictures.map((picture) => (
          <article className={styles.card} key={picture.gallery_id}>
            <img
              src={getImageSource(picture.image_url)}
              alt={picture.alt_text}
              className={styles.image}
            />
           
          </article>
        ))}
        {!error && pictures.length === 0 && <p>No gallery images are available yet.</p>}
      </div>

    </div>
         </main>
          <Footer />
        </>
  );
}