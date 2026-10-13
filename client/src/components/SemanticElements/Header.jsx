export default function Header({
  eyebrow,
  title,
  description,
  backgroundImage,
  backgroundSize = 'cover',
  backgroundPosition = 'center',
  backgroundRepeat = 'no-repeat',
  textColor = '#173b35',
}) {
  const sectionStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(135deg, rgba(244,240,232,0.8), rgba(244,240,232,0.55)), url(${backgroundImage})`,
        backgroundSize,
        backgroundPosition,
        backgroundRepeat,
        borderRadius: '18px',
        padding: '32px 128px',
        boxShadow: '0 10px 30px rgba(23, 59, 53, 0.08)',
      }
    : undefined

  const contentStyle = textColor ? { color: textColor } : undefined

  return (
    <section className="welcome" style={sectionStyle}>
      <p className="eyebrow" style={contentStyle}>{eyebrow}</p>
      <h1 style={contentStyle}>{title}</h1>
      <p style={contentStyle}>{description}</p>
    </section>
  )
}
