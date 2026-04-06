import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import togetherImg from "../assets/Apeksha-web-bannerN.jpg";
import hopeImg from "../assets/Children.jpeg";
import patientImg from "../assets/LoveLives.jpeg";
import donationBoxesImg from "../assets/DonateN.jpg";
import { FaHeart, FaHandsHelping, FaCapsules, FaUserInjured, FaHospital, FaStar ,FaExclamationCircle} from "react-icons/fa";


/* ─── tiny hook: trigger class when element enters viewport ─── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("revealed"); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

const Stat = ({ value, label }) => (
  <div className="text-center">
    <p className="text-4xl md:text-5xl font-black text-white tracking-tight">{value}</p>
    <p className="mt-1 text-sm font-medium text-purple-200 uppercase tracking-widest">{label}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const whyRef   = useReveal();
  const cardsRef = useReveal();
  const storyRef = useReveal();
  const commRef  = useReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --plum:   #5E548E;
          --plum-d: #3D3468;
          --plum-l: #9B8EC4;
          --rose:   #E07EA0;
          --rose-l: #F2AABF;
          --cream:  #FAF8FF;
          --ink:    #1C1733;
        }

        .reveal { opacity: 0; transform: translateY(36px); transition: opacity .75s ease, transform .75s ease; }
        .reveal.revealed { opacity: 1; transform: none; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-line { animation: fadeUp .9s ease both; }
        .hero-line:nth-child(1) { animation-delay: .2s; }
        .hero-line:nth-child(2) { animation-delay: .45s; }
        .hero-line:nth-child(3) { animation-delay: .65s; }
        .hero-line:nth-child(4) { animation-delay: .85s; }

        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(94,84,142,.5); }
          70%  { box-shadow: 0 0 0 16px rgba(94,84,142,0); }
          100% { box-shadow: 0 0 0 0 rgba(94,84,142,0); }
        }
        .btn-pulse { animation: pulseRing 2.5s ease-out infinite; }

        .card-shine { position: relative; overflow: hidden; }
        .card-shine::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,.18) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform .55s ease;
        }
        .card-shine:hover::before { transform: translateX(100%); }

        .img-zoom { transition: transform 6s ease; }
        .img-zoom:hover { transform: scale(1.04); }

        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px; border-radius: 999px;
          background: rgba(94,84,142,.1); border: 1px solid rgba(94,84,142,.2);
          color: var(--plum); font-size: .75rem; font-weight: 600;
          letter-spacing: .1em; text-transform: uppercase;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--rose); flex-shrink: 0; }

        .card-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 5rem; font-weight: 700; line-height: 1;
          color: rgba(94,84,142,.08); position: absolute;
          top: 12px; right: 20px; pointer-events: none; user-select: none;
        }

        .stat-bar { background: linear-gradient(135deg, var(--plum-d) 0%, var(--plum) 50%, #7B6DB0 100%); }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', background: '#fff' }}>

        {/* ── HERO ── */}
        <section className="relative min-h-[92vh] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            <img 
  src={togetherImg} 
  alt="hero" 
  className="w-full h-full object-cover object-center md:object-[center_top] scale-100" 
/>
          </div>
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(28,23,51,.85) 0%, rgba(28,23,51,.5) 55%, transparent 100%)'
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
            background: 'linear-gradient(to bottom, transparent, #fff)'
          }} />
          {/* vertical accent line */}
          <div className="absolute left-12 top-0 bottom-0 w-px hidden lg:block"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,.3), transparent)' }} />

          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pb-28 pt-40 w-full">
            <div className="max-w-xl">
              <p className="hero-line badge" style={{ color: '#e8d5f5', background: 'rgba(255,255,255,.12)', borderColor: 'rgba(255,255,255,.25)' }}>
                <span className="badge-dot" style={{ background: '#F2AABF' }} />
               Apeksha Hospital · Bringing Hope to Cancer Patients
              </p>

              <h1 className="hero-line mt-6 font-black leading-none text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
                Give Hope.<br />
                <span style={{ color: '#F2AABF' }}>Save Lives.</span>
              </h1>

              <p className="hero-line mt-6 text-base md:text-lg leading-relaxed"
                style={{ color: 'rgba(255,255,255,.75)', maxWidth: '38ch' }}>
                Your donation provides real relief — medicine, nutrition, and care — for cancer patients facing financial hardship during treatment.
              </p>

              <div className="hero-line mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/donate")}
                  className="btn-pulse px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #F2AABF 0%, #7B6DB0 100%)', fontSize: '1rem' }}
                >
                  Donate Now →
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                  style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.35)', color: '#fff', backdropFilter: 'blur(8px)', fontSize: '1rem' }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="stat-bar py-14">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
            <Stat value="2,400+" label="Patients Helped" />
            <Stat value="LKR 18M+" label="Aid Distributed" />
            <Stat value="96%" label="Relief Reaching Patients" />
            <Stat value="12+" label="Years of Service" />
          </div>
        </section>

        {/* ── WHY YOUR HELP MATTERS ── */}
        <section className="max-w-6xl mx-auto px-6 lg:px-12 py-24">
          <div ref={whyRef} className="grid lg:grid-cols-2 gap-16 items-center reveal">
            {/* image */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 rounded-[40px] opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, #9B8EC4, transparent)' }} />
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl h-[460px]">
                <img src={hopeImg} alt="Hope support" className="w-full h-full object-cover img-zoom" />
              </div>
              {/* floating chip */}
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3">
                <FaHeart className="text-3xl text-purple-600" />
                <div>
                  <p className="font-bold text-sm" style={{ color: '#5E548E' }}>Every rupee matters</p>
                  <p className="text-xs text-gray-500">Directly to patients in need</p>
                </div>
              </div>
            </div>

            {/* text */}
            <div className="order-1 lg:order-2">
              <span className="badge"><span className="badge-dot" />Why Your Help Matters</span>
              <h2 className="mt-5 font-bold leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1C1733' }}>
                Every contribution brings comfort, care, and hope.
              </h2>
              <p className="mt-5 text-gray-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
                Many cancer patients and their families face serious financial hardship during treatment. Your support provides essential medicine, nutrition, and urgent medical assistance when it's needed most.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {[
                  { icon: <FaHeart />, title: 'Hope', desc: 'Emotional and financial relief for patients and families.', bg: '#f9f4ff', border: '#e5d9f5' },
                  { icon: <FaHandsHelping />, title: 'Care', desc: 'Treatment, food, transport, and daily essentials covered.', bg: '#fff4f8', border: '#f5d9e5' },
                ].map(c => (
                  <div key={c.title} className="rounded-2xl p-5" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <div className="text-2xl mb-2 text-purple-600">{c.icon}</div>
                    <h3 className="font-bold text-lg" style={{ color: '#5E548E' }}>{c.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHERE DONATION GOES ── */}
        <section style={{ background: '#FAF8FF' }} className="py-28 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #9B8EC4, transparent)' }} />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #F2AABF, transparent)' }} />

          <div ref={cardsRef} className="relative max-w-6xl mx-auto px-6 lg:px-12 reveal">
            <div className="text-center mb-16">
              <span className="badge"><span className="badge-dot" />Where Your Donation Goes</span>
              <h2 className="mt-5 font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1C1733' }}>
                Helping patients in <span style={{ color: '#5E548E' }}>meaningful ways</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-500 leading-relaxed">
                Every donation supports practical needs that improve the quality of life of cancer patients and their families.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <FaCapsules />, title: 'Medical Support', desc: 'Help patients afford chemotherapy, surgeries, medication, and all treatment-related expenses.', accent: '#5E548E' },
                { icon: <FaExclamationCircle/>, title: 'Emergency Aid', desc: 'Provide urgent financial help for critical situations, sudden medical needs, and emergency care.', accent: '#E07EA0' },
                { icon: <FaUserInjured />, title: 'Patient Care', desc: 'Support nutrition, accommodation, travel costs, and day-to-day care for vulnerable patients.', accent: '#9B8EC4' }
              ].map(card => (
                <div key={card.num}
                  className="card-shine relative bg-white rounded-[28px] p-8 cursor-default"
                  style={{
                    boxShadow: '0 4px 24px rgba(0,0,0,.06)',
                    border: '1px solid rgba(0,0,0,.05)',
                    transition: 'box-shadow .3s, transform .3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(94,84,142,.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,.06)'; }}
                >
                  <div className="absolute top-0 left-8 right-8 h-[3px] rounded-full" style={{ background: card.accent, opacity: .7 }} />
                  <span className="card-num">{card.num}</span>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                    style={{ background: `${card.accent}18` }}>
                    <span className="text-xl text-purple-600">{card.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#1C1733' }}>{card.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{card.desc}</p>
                  {/* <p className="mt-6 text-xs font-semibold tracking-wide" style={{ color: card.accent }}>Learn more →</p> */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REAL PEOPLE, REAL IMPACT ── */}
        <section className="max-w-6xl mx-auto px-6 lg:px-12 py-24">
          <div ref={storyRef} className="grid lg:grid-cols-2 gap-16 items-center reveal">
            <div>
              <span className="badge"><span className="badge-dot" />Real People, Real Impact</span>
              <h2 className="mt-5 font-bold leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1C1733' }}>
                Your kindness helps patients continue their fight.
              </h2>
              <p className="mt-5 text-gray-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
                Behind every donation is a patient battling cancer with courage. Financial support eases the burden of treatment and gives families the strength to focus on healing — not bills.
              </p>

              {/* quote */}
              <div className="mt-8 rounded-2xl p-6 border-l-4" style={{ background: '#f9f4ff', borderColor: '#5E548E' }}>
                <p className="text-gray-600 italic leading-relaxed text-sm">
                  "The support we received meant my mother could focus on getting better instead of worrying about costs. We are forever grateful."
                </p>
                <p className="mt-3 text-xs font-semibold" style={{ color: '#5E548E' }}>— Family of a patient at Apeksha Hospital</p>
              </div>

              <button
                onClick={() => navigate("/support-request")}
                className="mt-8 px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #F2AABF 0%, #7B6DB0 100%)', fontSize: '1rem' }}
              >
                Support a Patient →
              </button>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[40px] opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, #F2AABF, transparent)' }} />
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl h-[460px]">
                <img src={patientImg} alt="Patient receiving treatment" className="w-full h-full object-cover img-zoom" />
              </div>
            </div>
          </div>
        </section>

        {/* ── COMMUNITY ── */}
        <section style={{ background: '#FAF8FF' }} className="py-24">
          <div ref={commRef} className="max-w-6xl mx-auto px-6 lg:px-12 reveal">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl h-[460px]">
                  <img src={donationBoxesImg} alt="Community donations" className="w-full h-full object-cover img-zoom" />
                  <div className="absolute bottom-6 left-6 rounded-2xl px-5 py-3"
                    style={{ background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)' }}>
                    <p className="text-2xl font-black" style={{ color: '#5E548E' }}>5,000+</p>
                    <p className="text-xs text-gray-500 font-medium">generous donors</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="badge"><span className="badge-dot" />Together We Can Do More</span>
                <h2 className="mt-5 font-bold leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1C1733' }}>
                  Join a caring community of supporters
                </h2>
                <p className="mt-5 text-gray-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
                  Donations are more than money. They are acts of kindness that unite people to support patients in need — bringing hope and making recovery a little easier.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    { icon: <FaHeart />, text: 'Support low-income patients directly' },
                    { icon: <FaHospital />, text: 'Help cover treatment-related needs' },
                    { icon: <FaStar />, text: 'Make a real and visible social impact' },
                  ].map(item => (
                    <li key={item.text} className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm"
                      style={{ border: '1px solid rgba(94,84,142,.1)' }}>
                      <span className="text-xl text-purple-600">{item.icon}</span>
                      <span className="font-medium text-gray-700">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("//stories")}
                  className="mt-10 px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #5E548E 0%, #7B6DB0 100%)', fontSize: '1rem' }}
                >
                  See the Stories of Hope →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative overflow-hidden py-28 text-center"
          style={{ background: 'linear-gradient(135deg, #ada1eb 0%, #b1aad4 50%, #7B6DB0 100%)' }}>
          {[220, 380, 520].map(s => (
            <div key={s} className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
              style={{ width: s, height: s, transform: 'translate(-50%,-50%)', border: '1px solid rgba(255,255,255,.08)' }} />
          ))}

          <div className="relative z-10 max-w-2xl mx-auto px-6">
            <p className="badge mx-auto" style={{ color: 'rgba(255,255,255,.75)', background: 'rgba(255,255,255,.1)', borderColor: 'rgba(255,255,255,.2)' }}>
              <span className="badge-dot" style={{ background: '#F2AABF' }} />
              Make a Difference Today
            </p>
            <h2 className="mt-5 font-bold text-white leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
              Be the reason someone keeps fighting.
            </h2>
            <p className="mt-5 leading-relaxed" style={{ color: 'rgba(255,255,255,.7)', fontSize: '1.05rem' }}>
              Your donation brings hope, comfort, and life-saving support to cancer patients and their families.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/donate")}
                className="btn-pulse px-10 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105"
                style={{ background: 'rgba(234, 181, 215, 0.89)', color: '#5E548E' }}
              >
                Donate Today →
              </button>
              {/* <button
                onClick={() => navigate("/about")}
                className="px-10 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105"
                style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.3)', color: '#fff' }}
              >
                Our Mission
              </button> */}
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;