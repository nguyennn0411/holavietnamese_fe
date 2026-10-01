import { Link } from 'react-router-dom'
export function HomePage() {
  return (
    <section className="home">
      <div className="hero"><div><p className="eyebrow">A new language. A closer connection.</p><h1>Make Vietnamese<br /><em>part of your world.</em></h1>
      <p className="lead">From your first “xin chào” to everyday conversations. Learn at your pace, one lesson at a time.</p>
      <div className="actions"><Link className="button" to="/courses">Explore Courses →</Link><Link className="button secondary" to="/my-courses">My Courses</Link></div></div>
      <div className="greeting-card"><span className="badge">Your first Vietnamese greeting</span><p lang="vi">Xin chào<span>!</span></p><span className="pronunciation">sin chow</span><h2>Hello. A good place to begin.</h2><div className="greeting-rule" /><span>A little practice opens a whole new conversation.</span></div></div>
      <div className="feature-grid"><article><span className="step">01</span><h2>Find your starting point</h2><p>Choose a course that fits your level and learn at a comfortable pace.</p></article><article><span className="step">02</span><h2>Build a learning habit</h2><p>Follow each lesson and see your progress grow as you complete it.</p></article><article><span className="step">03</span><h2>Keep the words you love</h2><p>Save useful vocabulary and return to it whenever you need a refresher.</p></article></div>
    </section>
  )
}
