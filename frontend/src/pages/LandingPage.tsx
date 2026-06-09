import { useEffect, useState } from 'react'

interface LandingPageProps {
  onStart: () => void
  isLoggedIn?: boolean
  onSignIn?: () => void
}

interface UnsplashPhoto {
  id: string
  urls: { regular: string; small: string }
  alt_description: string | null
  location?: { name?: string | null }
  user: { name: string }
}

const DESTINATIONS = [
  { emoji: '🇯🇵', name: 'Kyoto', desc: 'Ancient temples' },
  { emoji: '🇲🇦', name: 'Marrakech', desc: 'Vibrant souks' },
  { emoji: '🇮🇸', name: 'Reykjavik', desc: 'Northern lights' },
  { emoji: '🇵🇹', name: 'Lisbon', desc: 'Golden trams' },
  { emoji: '🇨🇴', name: 'Cartagena', desc: 'Colonial charm' },
  { emoji: '🇬🇷', name: 'Santorini', desc: 'Sunset views' },
]

const FEATURES = [
  { icon: '🧬', title: 'Personality-matched', desc: 'AI learns your travel DNA from 10 questions' },
  { icon: '🗺️', title: 'Smart destinations', desc: 'Top 3 countries matched by season, visa & budget' },
  { icon: '📅', title: 'Day-by-day plan', desc: 'Full itinerary with real venues, times & costs' },
  { icon: '🌤️', title: 'Live weather', desc: 'Actual forecast for your travel dates' },
  { icon: '🎭', title: 'Local events', desc: "What's happening while you're there" },
  { icon: '✏️', title: 'Customizable', desc: 'Tweak the plan until it\'s perfect' },
]

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

export function LandingPage({ onStart, isLoggedIn, onSignIn }: LandingPageProps) {
  const [visible, setVisible] = useState(false)
  const [activeCard, setActiveCard] = useState(0)
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    const interval = setInterval(() => setActiveCard(p => (p + 1) % DESTINATIONS.length), 2500)
    return () => { clearTimeout(t); clearInterval(interval) }
  }, [])

  useEffect(() => {
    if (!UNSPLASH_KEY) return
    setPhotosLoading(true)
    fetch(
      `https://api.unsplash.com/photos/random?count=6&query=travel+destination+landscape&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPhotos(data)
      })
      .catch(() => {})
      .finally(() => setPhotosLoading(false))
  }, [])

  const showPhotos = photos.length > 0
  const showPills = !showPhotos

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px', textAlign: 'center', position: 'relative',
      }}>

        {/* Photo strip (Unsplash) or destination pills (fallback) */}
        <div style={{
          marginBottom: '48px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
          width: '100%', maxWidth: 1000,
        }}>
          {photosLoading && !showPhotos && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', overflowX: 'auto' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  width: 280, height: 180, borderRadius: 16, flexShrink: 0,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }} />
              ))}
            </div>
          )}

          {showPhotos && (
            <div style={{
              display: 'flex', gap: '12px', overflowX: 'auto',
              paddingBottom: 8, scrollbarWidth: 'none',
              justifyContent: 'center', flexWrap: 'wrap',
            }}>
              {photos.map((photo, i) => {
                const label = photo.location?.name || photo.alt_description || 'Destination'
                return (
                  <div
                    key={photo.id}
                    onMouseOver={() => setHoveredPhoto(i)}
                    onMouseOut={() => setHoveredPhoto(null)}
                    style={{
                      width: 280, height: 180, borderRadius: 16, flexShrink: 0,
                      overflow: 'hidden', position: 'relative', cursor: 'default',
                      transform: hoveredPhoto === i ? 'scale(1.04)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <img
                      src={photo.urls.small}
                      alt={label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {hoveredPhoto === i && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                        display: 'flex', alignItems: 'flex-end', padding: '12px',
                      }}>
                        <span style={{
                          color: '#fff', fontSize: 13, fontWeight: 500,
                          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          maxWidth: '100%',
                        }}>
                          {label}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {showPills && !photosLoading && (
            <div style={{
              display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center',
            }}>
              {DESTINATIONS.map((d, i) => (
                <div key={d.name} style={{
                  background: activeCard === i ? 'rgba(91,196,160,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${activeCard === i ? 'rgba(91,196,160,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '20px', padding: '7px 16px',
                  fontSize: '13px', color: activeCard === i ? '#5bc4a0' : 'rgba(255,255,255,0.5)',
                  display: 'flex', alignItems: 'center', gap: '7px',
                  transition: 'all 0.4s ease', cursor: 'default',
                }}>
                  <span>{d.emoji}</span>
                  <span style={{ fontWeight: activeCard === i ? 500 : 400 }}>{d.name}</span>
                  <span style={{ opacity: 0.5 }}>· {d.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main headline */}
        <h1 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(42px, 7vw, 80px)',
          color: '#ffffff', fontWeight: 400,
          lineHeight: 1.1, marginBottom: '24px',
          maxWidth: '800px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s ease 0.1s',
        }}>
          Travel that knows
          <br />
          <em style={{ color: '#5bc4a0' }}>who you are</em>
        </h1>

        <p style={{
          fontSize: '18px', color: 'rgba(255,255,255,0.55)',
          maxWidth: '520px', lineHeight: 1.7, marginBottom: '48px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 0.2s',
        }}>
          Answer 10 questions. Get AI-powered country recommendations,
          a complete day-by-day itinerary, and a plan you can actually customize.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 0.3s',
        }}>
          <button onClick={onStart} style={{
            background: 'linear-gradient(135deg, #5bc4a0, #378add)',
            color: '#ffffff', border: 'none', borderRadius: '14px',
            padding: '16px 40px', fontSize: '17px', fontWeight: 500,
            cursor: 'pointer', letterSpacing: '0.01em',
            boxShadow: '0 0 40px rgba(91,196,160,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.04)'
              e.currentTarget.style.boxShadow = '0 0 60px rgba(91,196,160,0.4)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 0 40px rgba(91,196,160,0.3)'
            }}
          >
            {isLoggedIn ? 'Plan a new trip ✈️' : 'Start for free →'}
          </button>
          {!isLoggedIn && onSignIn && (
            <button onClick={onSignIn} style={{
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px',
              padding: '16px 32px', fontSize: '17px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            >
              Sign in
            </button>
          )}
        </div>

        <p style={{
          marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.2)',
          opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.5s',
        }}>
          Free · No credit card · Takes 2 minutes
        </p>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ color: '#5bc4a0', fontSize: '12px', letterSpacing: '0.12em', marginBottom: '12px' }}>
            THE PROCESS
          </p>
          <h2 style={{
            fontFamily: '"Playfair Display", serif', fontSize: 'clamp(28px, 4vw, 44px)',
            color: '#ffffff', fontWeight: 400,
          }}>
            From quiz to itinerary in minutes
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { step: '01', title: 'Tell us who you are', desc: 'Pace, interests, budget, companions. 10 questions that actually matter.', icon: '🧬' },
            { step: '02', title: 'AI picks your countries', desc: 'Claude matches your profile to 3 perfect destinations with visa info and weather.', icon: '🗺️' },
            { step: '03', title: 'Get your full plan', desc: 'Day-by-day itinerary with real venues, local events, and cost estimates.', icon: '📅' },
            { step: '04', title: 'Make it yours', desc: 'Add more food stops, slow the pace, request hidden gems. Regenerate instantly.', icon: '✏️' },
          ].map((item) => (
            <div key={item.step} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '20px', right: '20px',
                fontSize: '11px', color: 'rgba(91,196,160,0.4)',
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 400,
              }}>{item.step}</div>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{ color: '#ffffff', fontSize: '17px', fontWeight: 500, marginBottom: '10px' }}>
                {item.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.7 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '40px 24px 80px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'
        }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              display: 'flex', alignItems: 'flex-start', gap: '14px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', padding: '18px',
            }}>
              <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '1px' }}>{f.icon}</span>
              <div>
                <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                  {f.title}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: 1.6 }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
        background: 'linear-gradient(to bottom, transparent, rgba(24,95,165,0.15))',
      }}>
        <h2 style={{
          fontFamily: '"Playfair Display", serif', fontSize: 'clamp(28px, 4vw, 48px)',
          color: '#ffffff', fontWeight: 400, marginBottom: '16px',
        }}>
          Your next adventure is waiting
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', marginBottom: '36px' }}>
          Join travelers planning smarter trips with AI
        </p>
        <button onClick={onStart} style={{
          background: '#5bc4a0', color: '#04342c', border: 'none', borderRadius: '14px',
          padding: '16px 48px', fontSize: '17px', fontWeight: 500, cursor: 'pointer',
          transition: 'all 0.2s',
        }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          {isLoggedIn ? 'Plan a new trip ✈️' : "Get started — it's free"}
        </button>
      </section>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
