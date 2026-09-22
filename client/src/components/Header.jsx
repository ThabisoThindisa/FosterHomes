export default function Header({ eyebrow, title, description }) {
  return (
    <section className="welcome">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}
