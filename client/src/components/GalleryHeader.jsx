
import {HeartHandshake, Sparkles } from 'lucide-react'

import styles from './css/Gallery.module.css'
import NavigationBar from './NavBar'

export default function GalleryHeader() {
	return (
		<main className={styles.page}>
            <NavigationBar />
			<section className={styles.hero}>
				<div className={styles.heroContent}>
	
					<p className={styles.eyebrow}><Sparkles size={14} /> Our Gallery</p>
					<h1>Hope, Love, and a Place to Belong</h1>
		
				</div>
				<div className={styles.heroNote}>
					<HeartHandshake size={24} />
					<span>Every plan begins with listening.</span>
				</div>
			</section>

		</main>
	)
}
