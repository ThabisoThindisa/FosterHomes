import { useEffect, useState } from 'react'
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './css/Programs.module.css'
import NavigationBar from './NavBar'

//Store the link to connect to the api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Header() {
	return (
		<main className={styles.page}>
            <NavigationBar />
			<section className={styles.hero}>
				<div className={styles.heroContent}>
	
					<p className={styles.eyebrow}><Sparkles size={14} /> Our Goal</p>
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
