import { useEffect, useState } from 'react';
import NavigationBar from "./SemanticElements/NavBar";
import Header from "./SemanticElements/Header";
import Footer from './SemanticElements/Footer'


export default function Gallery() {
  const [pictures, setPictures] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function getPictures() {
      try {
        const response = await fetch(
          'http://localhost:4000/api/getPictures'
        );

        if (!response.ok) {
          throw new Error('Failed to load pictures');
        }

        const data = await response.json();

        setPictures(data);

      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }

    getPictures();
  }, []);

  return (

      <>
          <NavigationBar />
          <main className="dashboard">
            <Header
              eyebrow="A glimpse into our journey"
              title="Gallery"
              description="Explore moments of care, connection, and belonging."
            />
    <div className="galleryContainer">

      {error && <p>{error}</p>}

      <div className="galleryGrid">

        {pictures.map((picture) => (
          <div className="galleryCard" key={picture.gallery_id}>

            <img
              src={`http://localhost:4000/api/getPictures/${picture.gallery_id}`}
              alt={picture.alt_text}
            />

            <p>{picture.alt_text}</p>

          </div>
        ))}

      </div>

    </div>
         </main>
          <Footer />
        </>
  );
}