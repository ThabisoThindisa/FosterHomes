import { useEffect, useState } from 'react'
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './css/Programs.module.css'

//Store the link to connect to the api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Programs() {
	const [programs, setPrograms] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

    //Return programs, 
      useEffect(() => {
      fetch(API_URL+'/getPrograms')
				.then(response => {
					if (!response.ok) throw new Error('Programs are temporarily unavailable.')
					return response.json()
				})
        .then(data => {
					if (Array.isArray(data)) setPrograms(data)
        })
        .catch(error => {
					console.error('Error:', error)
					setError(error.message)
				})
				.finally(() => setLoading(false))
    }, []);

	return (
		<main className={styles.page}>
			<section className={styles.hero}>
				<div className={styles.heroContent}>
					<Link to="/" className={styles.backLink}>Back to portal</Link>
					<p className={styles.eyebrow}><Sparkles size={14} /> Our programs</p>
					<h1>Hope, Love, and a Place to Belong</h1>
					<p className={styles.lede}>
						Thoughtful support for children, young people, and families as they find stability,
						connection, and a place to belong.
					</p>
				</div>
				<div className={styles.heroNote}>
					<HeartHandshake size={24} />
					<span>Every plan begins with listening.</span>
				</div>
			</section>

			<section className={styles.programSection} aria-labelledby="programs-heading">
				<div className={styles.sectionIntro}>
					<p className={styles.eyebrow}>Ways we help</p>
					<h2 id="programs-heading">Support for the whole journey.</h2>
					{loading && <p className={styles.status}>Loading the latest programs...</p>}
					{!loading && error && <p className={styles.status}>{error} Showing our core services.</p>}
				</div>

   {/*Retrive all the programs in the database */}
				<div className={styles.grid}>
					{programs.map((program, index) => (
						<article key={program.program_id || program.ad_name} className={styles.card}>
							<div className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</div>
							<h3>{program.ad_name}</h3>
							<p>{program.ad_description}</p>
							<div className={styles.eligibility}>
								<ShieldCheck size={17} />
								<span>{program.ad_eligibility_requirements}</span>
							</div>
							<Link to="/" className={styles.cardLink}>Talk to our team <ArrowRight size={16} /></Link>
						</article>
					))}
				</div>
			</section>
		</main>
	)
}
