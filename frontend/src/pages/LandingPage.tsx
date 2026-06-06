// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Globe } from "lucide-react";

// const LandingPage: React.FC = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: "#042c53" }}>
//       {/* Nav */}
//       <nav
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 50,
//           background: "rgba(4,44,83,0.85)",
//           backdropFilter: "blur(12px)",
//           borderBottom: "1px solid rgba(91,196,160,0.12)",
//           padding: "0 24px",
//           height: 56,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <div className="flex items-center gap-2" style={{ color: "#5bc4a0", fontWeight: 700, fontSize: 18 }}>
//           <Globe size={18} />
//           AtlasPlanner
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate("/signin")}
//             style={{
//               background: "transparent",
//               border: "1.5px solid rgba(91,196,160,0.4)",
//               borderRadius: 8,
//               color: "#5bc4a0",
//               padding: "6px 18px",
//               fontSize: 14,
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             Sign in
//           </button>
//           <button
//             onClick={() => navigate("/signup")}
//             style={{
//               background: "#5bc4a0",
//               border: "none",
//               borderRadius: 8,
//               color: "#042c53",
//               padding: "6px 18px",
//               fontSize: 14,
//               fontWeight: 700,
//               cursor: "pointer",
//             }}
//           >
//             Get started
//           </button>
//         </div>
//       </nav>

//       {/* Hero */}
//       <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6 text-center">
//         <motion.div
//           initial={{ scale: 0.85, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.55 }}
//         >
//           <div className="text-7xl mb-5 select-none">🌍</div>
//           <h1
//             className="text-white mb-3"
//             style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}
//           >
//             AtlasPlanner
//           </h1>
//           <p className="mb-3" style={{ color: "#5bc4a0", fontSize: 20, fontWeight: 300 }}>
//             Your AI travel companion
//           </p>
//           <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 400, lineHeight: 1.6 }}>
//             Answer a few questions and get perfectly matched destinations with a
//             personalised day-by-day itinerary.
//           </p>
//         </motion.div>

//         <motion.button
//           initial={{ opacity: 0, y: 18 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.38 }}
//           onClick={() => navigate("/quiz")}
//           style={{
//             padding: "16px 40px",
//             background: "#5bc4a0",
//             color: "#042c53",
//             fontWeight: 700,
//             fontSize: 17,
//             borderRadius: 16,
//             border: "none",
//             cursor: "pointer",
//             boxShadow: "0 8px 32px rgba(91,196,160,0.25)",
//           }}
//         >
//           Start planning →
//         </motion.button>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;
import { useEffect, useState } from 'react'

interface LandingPageProps {
  onStart: () => void
  isLoggedIn?: boolean
  onSignIn?: () => void
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
  { icon: '🎭', title: 'Local events', desc: 'What\'s happening while you\'re there' },
  { icon: '✏️', title: 'Customizable', desc: 'Tweak the plan until it\'s perfect' },
]

export function LandingPage({ onStart, isLoggedIn, onSignIn }: LandingPageProps) {
  const [visible, setVisible] = useState(false)
  const [activeCard, setActiveCard] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    const interval = setInterval(() => setActiveCard(p => (p + 1) % DESTINATIONS.length), 2500)
    return () => { clearTimeout(t); clearInterval(interval) }
  }, [])

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px', textAlign: 'center', position: 'relative',
      }}>

        {/* Floating destination pills */}
        <div style={{
          display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: '48px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
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
          {isLoggedIn ? 'Plan a new trip ✈️' : 'Get started — it\'s free'}
        </button>
      </section>
    </div>
  )
} 
