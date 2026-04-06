import React, { useEffect, useRef } from "react";
import supportImg from "../assets/support.jpg";

// Animated counter hook
const useCountUp = (target, duration = 2000) => {
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      if (ref.current) ref.current.textContent = Math.floor(start).toLocaleString();
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return ref;
};

const StatCard = ({ value, suffix, label, delay }) => {
  const ref = useCountUp(value);
  return (
    <div
      className="stat-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-number">
        <span ref={ref}>0</span>
        <span>{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const About = () => {
  return (
    <div className="about-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --plum:       #3D2B5E;
          --plum-mid:   #5E458A;
          --plum-light: #9880C0;
          --rose:       #C96B8A;
          --rose-light: #F2A8BE;
          --cream:      #FAF7F4;
          --warm-white: #FFFFFF;
          --text-dark:  #1E1528;
          --text-mid:   #4A4060;
          --text-soft:  #7B6E8C;
          --border:     rgba(94,68,138,0.12);
        }

        .about-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--text-dark);
          overflow-x: hidden;
        }

        /* ─── HERO ─── */
        .hero {
          position: relative;
          min-height: 92vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 0;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .hero { grid-template-columns: 1fr; min-height: auto; }
          .hero-image-col { order: -1; height: 50vw; }
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--plum) 0%, #2A1A4A 60%, #1A0F2E 100%);
          z-index: 0;
        }
        .hero-bg-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 36px 36px;
          z-index: 1;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
        }
        .orb-1 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(201,107,138,0.35) 0%, transparent 70%);
          top: -100px; right: 120px;
        }
        .orb-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(152,128,192,0.3) 0%, transparent 70%);
          bottom: -60px; left: 60px;
        }

        .hero-content-col {
          position: relative;
          z-index: 2;
          padding: 80px 64px 80px 80px;
        }
        @media (max-width: 768px) {
          .hero-content-col { padding: 48px 24px; }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: var(--rose-light);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 28px;
        }
        .hero-badge::before {
          content: '';
          width: 6px; height: 6px;
          background: var(--rose-light);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 5vw, 68px);
          font-weight: 700;
          line-height: 1.1;
          color: #fff;
          margin-bottom: 24px;
        }
        .hero-title em {
          font-style: italic;
          color: var(--rose-light);
        }

        .hero-desc {
          font-size: 17px;
          line-height: 1.75;
          color: rgba(255,255,255,0.7);
          margin-bottom: 44px;
          max-width: 440px;
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .btn-primary {
          padding: 14px 32px;
          background: linear-gradient(135deg, var(--rose) 0%, #A84E6C 100%);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 100px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(201,107,138,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(201,107,138,0.5);
        }
        .btn-ghost {
          padding: 14px 32px;
          background: transparent;
          color: rgba(255,255,255,0.85);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.4);
        }

        .hero-image-col {
          position: relative;
          z-index: 2;
          height: 100%;
          min-height: 500px;
        }
        .hero-image-col img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .hero-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, var(--plum) 0%, transparent 40%),
                      linear-gradient(to top, rgba(30,15,50,0.6) 0%, transparent 50%);
        }

        /* ─── STATS STRIP ─── */
        .stats-strip {
          background: var(--warm-white);
          border-bottom: 1px solid var(--border);
          padding: 0;
        }
        .stats-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          divide-x: 1px solid var(--border);
        }
        @media (max-width: 640px) {
          .stats-inner { grid-template-columns: 1fr 1fr; }
        }
        .stat-card {
          padding: 36px 32px;
          text-align: center;
          border-right: 1px solid var(--border);
          animation: fadeUp 0.6s ease both;
        }
        .stat-card:last-child { border-right: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          font-weight: 700;
          color: var(--plum);
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-soft);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* ─── SECTION COMMONS ─── */
        .section { max-width: 1100px; margin: 0 auto; padding: 96px 24px; }
        .section-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--plum-light);
          margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 700;
          color: var(--plum);
          line-height: 1.15;
          margin-bottom: 20px;
        }
        .section-body {
          font-size: 16px;
          line-height: 1.8;
          color: var(--text-mid);
        }

        /* ─── MISSION / VISION ─── */
        .mv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 768px) { .mv-grid { grid-template-columns: 1fr; } }
        .mv-card {
          border-radius: 24px;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .mv-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(61,43,94,0.12);
        }
        .mv-card.mission {
          background: var(--plum);
          color: #fff;
        }
        .mv-card.vision {
          background: var(--warm-white);
          border: 1px solid var(--border);
          color: var(--text-dark);
        }
        .mv-card-icon {
          width: 56px; height: 56px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          margin-bottom: 28px;
        }
        .mission .mv-card-icon { background: rgba(255,255,255,0.12); }
        .vision .mv-card-icon  { background: #F5EFFF; }
        .mv-card h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .mission h2 { color: #fff; }
        .vision h2  { color: var(--plum); }
        .mv-card p  { font-size: 15px; line-height: 1.8; }
        .mission p  { color: rgba(255,255,255,0.78); }
        .vision p   { color: var(--text-mid); }

        /* ─── QUOTE ─── */
        .quote-section {
          background: linear-gradient(135deg, var(--plum) 0%, #2A1A4A 100%);
          padding: 80px 24px;
          position: relative;
          overflow: hidden;
        }
        .quote-section::before {
          content: '\u201C';
          position: absolute;
          top: -40px; left: 40px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 320px;
          color: rgba(255,255,255,0.04);
          line-height: 1;
          pointer-events: none;
        }
        .quote-inner {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .quote-inner p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3vw, 36px);
          font-style: italic;
          font-weight: 400;
          color: #fff;
          line-height: 1.55;
          margin-bottom: 24px;
        }
        .quote-inner cite {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rose-light);
          font-style: normal;
        }

        /* ─── VALUES ─── */
        .values-bg {
          background: var(--warm-white);
          padding: 96px 0;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 64px;
        }
        @media (max-width: 768px) { .values-grid { grid-template-columns: 1fr; } }
        .value-card {
          background: var(--cream);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 40px 32px;
          transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
          position: relative;
          overflow: hidden;
        }
        .value-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--plum-mid), var(--rose));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .value-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(61,43,94,0.1);
          background: #fff;
        }
        .value-card:hover::after { transform: scaleX(1); }
        .value-icon {
          font-size: 36px;
          margin-bottom: 20px;
          display: block;
        }
        .value-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--plum);
          margin-bottom: 12px;
        }
        .value-card p {
          font-size: 14px;
          line-height: 1.75;
          color: var(--text-soft);
        }

        /* ─── WHY WE EXIST ─── */
        .why-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        @media (max-width: 768px) { .why-grid { grid-template-columns: 1fr; gap: 40px; } }

        .why-list {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
          background: var(--warm-white);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
        }
        .why-list li {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 28px;
          font-size: 15px;
          color: var(--text-mid);
          font-weight: 500;
          border-bottom: 1px solid var(--border);
          transition: background 0.2s;
        }
        .why-list li:last-child { border-bottom: none; }
        .why-list li:hover { background: #F9F5FF; }
        .why-list li::before {
          content: '';
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--plum-mid), var(--rose));
          flex-shrink: 0;
        }

        /* ─── CTA FOOTER ─── */
        .cta-section {
          padding: 96px 24px;
          text-align: center;
        }
        .cta-card {
          max-width: 700px;
          margin: 0 auto;
          background: linear-gradient(135deg, var(--plum) 0%, #1E0F38 100%);
          border-radius: 32px;
          padding: 72px 48px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(61,43,94,0.3);
        }
        .cta-card::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,107,138,0.3) 0%, transparent 70%);
        }
        .cta-card h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .cta-card p {
          font-size: 16px;
          color: rgba(255,255,255,0.68);
          line-height: 1.7;
          margin-bottom: 36px;
          position: relative;
          z-index: 1;
        }
        .cta-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-bg-dots" />
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />

        <div className="hero-content-col">
          <div className="hero-badge">About Our Foundation</div>
          <h1 className="hero-title">
            Bringing <em>Hope</em> &amp; Support<br />to Cancer Patients
          </h1>
          <p className="hero-desc">
            We connect compassionate donors with low-income cancer patients who
            need urgent financial and emotional support during treatment at
            Apeksha Hospital, Sri Lanka.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Start Donating</button>
            <button className="btn-ghost">Learn More</button>
          </div>
        </div>

        <div className="hero-image-col">
          <img src={supportImg} alt="Support community" />
          <div className="hero-image-overlay" />
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <div className="stats-strip">
        <div className="stats-inner">
          <StatCard value={1200} suffix="+" label="Patients Supported" delay={0} />
          <StatCard value={850}  suffix="+"  label="Generous Donors"    delay={100} />
          <StatCard value={96}   suffix="%"  label="Fund Transparency"  delay={200} />
          <StatCard value={7}    suffix=" yrs" label="Years of Impact"  delay={300} />
        </div>
      </div>

      {/* ─── MISSION & VISION ─── */}
      <div className="section" style={{ paddingBottom: 0 }}>
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
          <div className="section-label">Our Purpose</div>
          <h2 className="section-title">What Drives Us Every Day</h2>
        </div>
        <div className="mv-grid">
          <div className="mv-card mission">
            <div className="mv-card-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>
              To provide financial assistance, emotional encouragement, and community
              support to cancer patients at Apeksha Hospital — reducing the burden of
              medical expenses so patients can continue treatment with dignity and hope.
            </p>
          </div>
          <div className="mv-card vision">
            <div className="mv-card-icon">🌍</div>
            <h2>Our Vision</h2>
            <p>
              A society where no cancer patient is left without support due to financial
              hardship. We aim to build a trusted, compassionate platform where generosity
              creates real impact and renews strength for families facing the hardest battles.
            </p>
          </div>
        </div>
      </div>

      {/* ─── QUOTE ─── */}
      <div className="quote-section" style={{ marginTop: 96 }}>
        <div className="quote-inner">
          <p>
            "Every donation is more than money — it is hope, strength, and a
            chance to keep fighting."
          </p>
          <cite>— The Foundation Team</cite>
        </div>
      </div>

      {/* ─── VALUES ─── */}
      <div className="values-bg">
        <div className="section" style={{ padding: "0 24px" }}>
          <div style={{ maxWidth: 520 }}>
            <div className="section-label">What We Stand For</div>
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-body">
              Guided by compassion, honesty, and commitment — these principles shape
              every decision we make on behalf of those we serve.
            </p>
          </div>
          <div className="values-grid">
            {[
              { icon: "💜", title: "Compassion", desc: "We care deeply for every patient and family navigating one of life's most difficult journeys." },
              { icon: "🔍", title: "Transparency", desc: "Every donation is managed responsibly. We report openly so donors can trust their generosity is well placed." },
              { icon: "✨", title: "Impact", desc: "We focus on meaningful, measurable outcomes — real support that visibly improves patients' lives." },
            ].map((v) => (
              <div className="value-card" key={v.title}>
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── WHY WE EXIST ─── */}
      <div className="section">
        <div className="why-grid">
          <div>
            <div className="section-label">Our Story</div>
            <h2 className="section-title">Why We Exist</h2>
            <p className="section-body" style={{ marginBottom: 20 }}>
              Cancer treatment places an immense financial burden on families who are
              already carrying so much. Our platform was born from a simple belief —
              that no one should fight this battle alone.
            </p>
            <p className="section-body">
              We bridge the gap between caring donors and patients in urgent need,
              turning small acts of kindness into life-changing moments of relief.
            </p>
          </div>
          <div>
            <ul className="why-list">
              <li>Support patients with urgent treatment needs</li>
              <li>Reduce the crushing burden of medical expenses</li>
              <li>Build lasting trust between donors and beneficiaries</li>
              <li>Spread hope, care, and compassion across communities</li>
              <li>Ensure no family faces financial ruin for seeking treatment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="cta-section">
        <div className="cta-card">
          <h2>Ready to Make a Difference?</h2>
          <p>
            Your support directly funds treatment, travel, and daily needs for
            cancer patients who cannot afford it on their own.
          </p>
          <div className="cta-actions">
            <button className="btn-primary">Donate Now</button>
            {/* <button className="btn-ghost">Meet the Patients</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;