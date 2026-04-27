import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight, FaBoxOpen, FaCheckCircle, FaClipboardCheck,
  FaClipboardList, FaFilePrescription, FaGift, FaMapMarkerAlt,
  FaSearch, FaShoppingBag, FaUserShield,
} from "react-icons/fa";
import donationGuideHopeImg from "../assets/donation-guide-hope.jpg";
import donationGuideNeedImg from "../assets/donation-guide-need.jpg";
import donationGuideVolunteersImg from "../assets/donation-guide-volunteers.jpg";
import { ROUTES } from "../routes/path";

/* ── Data ─────────────────────────────────────────────── */
const phases = [
  {
    num: 1,
    label: "Choose",
    desc: "Browse cases and understand the exact need before you commit.",
    accent: "#5E548E",
    light: "#EDE9F8",
    dark: "#4A4272",
    sub: "Browsing & selection",
  },
  {
    num: 2,
    label: "Approve",
    desc: "The platform reviews and issues a reference code for traceability.",
    accent: "#E5989B",
    light: "#FDF5F7",
    dark: "#B5838D",
    sub: "Approval process",
  },
  {
    num: 3,
    label: "Deliver",
    desc: "Purchase, hand over, verify, and track until fully complete.",
    accent: "#B5838D",
    light: "#FEF0F3",
    dark: "#8a5d65",
    sub: "Delivery & completion",
  },
];

const steps = [
  {
    code: "01", phase: 1,
    title: "Browse & select case",
    desc: "Find a verified patient case and choose the one you want to support.",
    icon: FaSearch,
    highlight: false,
  },
  {
    code: "02", phase: 1,
    title: "View required items",
    desc: "Open the case to see the exact medicines and care essentials requested.",
    icon: FaClipboardList,
    highlight: false,
  },
  {
    code: "03", phase: 1,
    title: "Submit donation request",
    desc: "Send your intent to donate so the team can reserve the request properly.",
    icon: FaGift,
    highlight: true,
  },
  {
    code: "04", phase: 2,
    title: "Admin review",
    desc: "The team verifies availability and patient needs before moving forward.",
    icon: FaUserShield,
    highlight: false,
  },
  {
    code: "05", phase: 2,
    title: "Approval & reference code",
    desc: "You receive confirmation and a unique reference code for tracking.",
    icon: FaCheckCircle,
    highlight: true,
  },
  {
    code: "06", phase: 2,
    title: "Download prescription PDF",
    desc: "Get the approved document so you purchase only exactly what is needed.",
    icon: FaFilePrescription,
    highlight: false,
  },
  {
    code: "07", phase: 3,
    title: "Purchase items",
    desc: "Buy the listed items. We accept additional items as well",
    icon: FaShoppingBag,
    highlight: false,
  },
  {
    code: "08", phase: 3,
    title: "Deliver to collection point",
    desc: "Bring purchased items and your reference code to the designated drop-off.",
    icon: FaMapMarkerAlt,
    highlight: true,
  },
  {
    code: "09", phase: 3,
    title: "Item verification",
    desc: "The team checks each item against the approved request before accepting.",
    icon: FaClipboardCheck,
    highlight: false,
  },
  {
    code: "10", phase: 3,
    title: "Track the donations",
    desc: "Get an insight how your donation was allocated",
    icon: FaBoxOpen,
    highlight: false,
  },
];

const reminders = [
  "Verified patient need",
  "Reference-based tracking",
  "Safer item handover",
];

const heroStats = [
  { value: "10", label: "clear steps" },
  { value: "3", label: "guided phases" },
  { value: "100%", label: "traceable support" },
];

/* ── Sub-components ───────────────────────────────────── */

function StepCard({ step, phase }) {
  const Icon = step.icon;
  const isHighlight = step.highlight;

  const cardBg     = isHighlight ? phase.accent : phase.light;
  const cardBorder = isHighlight ? "none" : `0.5px solid ${phase.accent}30`;
  const numColor   = isHighlight ? "rgba(255,255,255,0.5)" : phase.accent;
  const titleColor = isHighlight ? "#fff" : "#1a1724";
  const descColor  = isHighlight ? "rgba(255,255,255,0.68)" : "#B5838D";
  const iconBg     = isHighlight ? "rgba(255,255,255,0.18)" : `${phase.accent}22`;
  const iconColor  = isHighlight ? "#fff" : phase.accent;
  const codeBg     = isHighlight ? "rgba(0,0,0,0.15)" : `${phase.accent}12`;

  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: cardBg,
        border: cardBorder,
        borderRadius: 14,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "64px 1fr",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px ${phase.accent}22` : "none",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Step number column */}
      <div style={{
        background: codeBg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 6px",
        gap: 6,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={13} color={iconColor} />
        </div>
        <span style={{
          fontSize: 11, fontWeight: 500, letterSpacing: "0.06em",
          color: numColor, fontFamily: "'DM Sans', sans-serif",
        }}>
          {step.code}
        </span>
      </div>

      {/* Content column */}
      <div style={{ padding: "13px 14px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          marginBottom: 5, flexWrap: "wrap",
        }}>
          <div style={{
            fontSize: 13, fontWeight: 500,
            color: titleColor, lineHeight: 1.25,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {step.title}
          </div>
          {isHighlight && (
            <span style={{
              fontSize: 10, fontWeight: 500,
              padding: "2px 8px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: 20,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.05em",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Key step
            </span>
          )}
        </div>
        <div style={{
          fontSize: 11.5, color: descColor,
          lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif",
        }}>
          {step.desc}
        </div>
      </div>
    </div>
  );
}

function Divider({ phase, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 0" }}>
      <div style={{ flex: 1, height: "0.5px", background: `${phase.accent}25` }} />
      <span style={{
        fontSize: 11, color: phase.accent, fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "0.5px", background: `${phase.accent}25` }} />
    </div>
  );
}

function PhasePanel({ phaseNum }) {
  const phase = phases[phaseNum - 1];
  const phaseSteps = steps.filter(s => s.phase === phaseNum);
  const isPhase1 = phaseNum === 1;
  const isPhase2 = phaseNum === 2;

  return (
    <div style={{ animation: "dgFadeIn 0.22s ease" }}>
      {/* Phase header strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ background: phase.light, borderRadius: 20, padding: "4px 14px" }}>
          <span style={{
            fontSize: 10, fontWeight: 500,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: phase.dark, fontFamily: "'DM Sans', sans-serif",
          }}>
            Phase {phaseNum} — {phase.sub}
          </span>
        </div>
        <div style={{ flex: 1, height: "0.5px", background: `${phase.accent}22` }} />
      </div>

      {/* Step grid */}
      {isPhase1 && (
        <div className="dg-phase-grid dg-phase-grid-3">
          {phaseSteps.map(s => <StepCard key={s.code} step={s} phase={phase} />)}
        </div>
      )}

      {isPhase2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="dg-phase-grid dg-phase-grid-2">
            {phaseSteps.slice(0, 2).map(s => <StepCard key={s.code} step={s} phase={phase} />)}
          </div>
          <Divider phase={phase} label="document ready" />
          <StepCard step={phaseSteps[2]} phase={phase} />
        </div>
      )}

      {!isPhase1 && !isPhase2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="dg-phase-grid dg-phase-grid-2">
            {phaseSteps.slice(0, 2).map(s => <StepCard key={s.code} step={s} phase={phase} />)}
          </div>
          <Divider phase={phase} label="verification" />
          <div className="dg-phase-grid dg-phase-grid-2">
            {phaseSteps.slice(2).map(s => <StepCard key={s.code} step={s} phase={phase} />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ───────────────────────────────────── */
const DonationGuide = () => {
  const [activePhase, setActivePhase] = useState(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @keyframes dgFadeIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        .dg-cta:hover { opacity: 0.9; transform: translateY(-1px); }
        .dg-cta:active { transform: scale(0.97); }
        .dg-pill { transition: all 0.18s ease; }
        .dg-shell {
          background:
            radial-gradient(circle at top left, rgba(94,84,142,0.12), transparent 26%),
            radial-gradient(circle at top right, rgba(229,152,155,0.14), transparent 24%),
            linear-gradient(180deg, #FFF9F5 0%, #faf8ff 38%, #FFF9F5 100%);
          min-height: 100vh;
        }
        .dg-hero {
          max-width: 1120px;
          margin: 0 auto;
          padding: 42px 28px 18px;
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
          gap: 28px;
          align-items: center;
        }
        .dg-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.76);
          border: 1px solid rgba(94,84,142,0.12);
          color: #7a4474;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          box-shadow: 0 12px 30px rgba(94,84,142,0.08);
        }
        .dg-kicker::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E5989B 0%, #B5838D 100%);
        }
        .dg-title {
          margin: 18px 0 12px;
          font-size: clamp(2.3rem, 5vw, 4.5rem);
          line-height: 0.96;
          letter-spacing: -0.05em;
          color: #1e1735;
          max-width: 9.5ch;
        }
        .dg-title span { color: #5E548E; }
        .dg-lead {
          max-width: 560px;
          margin: 0 0 24px;
          color: #B5838D;
          font-size: 15px;
          line-height: 1.8;
        }
        .dg-hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .dg-primary-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .dg-primary-link {
          background: linear-gradient(135deg, #4A4272 0%, #5E548E 100%);
          color: #fff;
          box-shadow: 0 18px 34px rgba(94,84,142,0.24);
        }
        .dg-primary-link:hover { transform: translateY(-2px); }
        .dg-stat-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .dg-stat-card {
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(94,84,142,0.1);
          border-radius: 18px;
          padding: 16px 16px 14px;
          box-shadow: 0 18px 38px rgba(94,84,142,0.07);
        }
        .dg-stat-card strong {
          display: block;
          margin-bottom: 4px;
          color: #5E548E;
          font-size: 22px;
          line-height: 1;
        }
        .dg-stat-card span {
          color: #B5838D;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .dg-hero-collage {
          position: relative;
          min-height: 560px;
        }
        .dg-photo-card {
          position: absolute;
          overflow: hidden;
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 24px 60px rgba(94,84,142,0.16);
        }
        .dg-photo-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .dg-photo-main {
          top: 0;
          right: 0;
          width: 62%;
          height: 100%;
        }
        .dg-photo-side {
          left: 0;
          width: 42%;
          border: 10px solid rgba(255,255,255,0.92);
        }
        .dg-photo-side-top {
          top: 38px;
          height: 248px;
          transform: rotate(-4deg);
        }
        .dg-photo-side-bottom {
          bottom: 18px;
          height: 228px;
          transform: rotate(3deg);
        }
        .dg-floating-note {
          position: absolute;
          right: 28px;
          bottom: 26px;
          max-width: 220px;
          padding: 16px 18px;
          border-radius: 20px;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(94,84,142,0.12);
          box-shadow: 0 22px 44px rgba(94,84,142,0.12);
        }
        .dg-floating-note strong {
          display: block;
          margin-bottom: 6px;
          color: #1e1735;
          font-size: 13px;
        }
        .dg-floating-note p {
          margin: 0;
          color: #B5838D;
          font-size: 11.5px;
          line-height: 1.6;
        }
        .dg-impact-panel {
          margin-top: 26px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 16px;
        }
        .dg-impact-copy {
          position: relative;
          min-height: 280px;
          border-radius: 24px;
          overflow: hidden;
          background: linear-gradient(135deg, #4A4272 0%, #5E548E 55%, #7a6a9e 100%);
          padding: 28px;
        }
        .dg-impact-copy::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(229,152,155,0.22), transparent 32%),
            radial-gradient(circle at bottom left, rgba(181,131,141,0.22), transparent 28%);
        }
        .dg-impact-copy > * { position: relative; z-index: 1; }
        .dg-impact-copy span {
          display: inline-block;
          margin-bottom: 10px;
          color: rgba(255,255,255,0.56);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .dg-impact-copy h3 {
          margin: 0 0 10px;
          color: #fff;
          font-size: 28px;
          line-height: 1.1;
          max-width: 10ch;
        }
        .dg-impact-copy p {
          margin: 0 0 18px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          line-height: 1.8;
          max-width: 44ch;
        }
        .dg-impact-list {
          display: grid;
          gap: 8px;
        }
        .dg-impact-list div {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
        }
        .dg-impact-list div::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E5989B 0%, #B5838D 100%);
          flex-shrink: 0;
        }
        .dg-impact-image {
          border-radius: 24px;
          overflow: hidden;
          min-height: 280px;
          box-shadow: 0 20px 50px rgba(94,84,142,0.12);
        }
        .dg-impact-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .dg-phase-grid {
          display: grid;
          gap: 10px;
        }
        .dg-phase-grid-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .dg-phase-grid-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .dg-footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 18px;
        }
        @media (max-width: 980px) {
          .dg-hero,
          .dg-impact-panel,
          .dg-footer-grid { grid-template-columns: 1fr; }
          .dg-hero-collage { min-height: 520px; }
        }
        @media (max-width: 768px) {
          .dg-title { max-width: none; }
          .dg-stat-row,
          .dg-phase-grid-2,
          .dg-phase-grid-3 { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .dg-hero {
            padding: 30px 18px 16px;
            gap: 18px;
          }
          .dg-hero-collage {
            min-height: auto;
            display: grid;
            gap: 14px;
          }
          .dg-photo-card,
          .dg-photo-main,
          .dg-photo-side,
          .dg-photo-side-top,
          .dg-photo-side-bottom,
          .dg-floating-note {
            position: static;
            width: 100%;
            height: auto;
            transform: none;
          }
          .dg-photo-main { aspect-ratio: 4 / 5; }
          .dg-photo-side { border-width: 6px; }
          .dg-photo-side-top,
          .dg-photo-side-bottom { aspect-ratio: 5 / 4; }
        }
      `}</style>

      <div className="dg-shell" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── INTERACTIVE JOURNEY ── */}
        <section className="dg-hero">
          <div>
            <div className="dg-kicker">Donation guide</div>
            <h1 className="dg-title">
              Give with <span>clarity</span>, care, and confidence.
            </h1>
            <p className="dg-lead">
              This page walks you through the full donor journey, from choosing a verified patient
              request to handing over approved items safely and transparently.
            </p>

            <div className="dg-hero-actions">
              <Link to={ROUTES.SUPPORT_REQUEST} className="dg-primary-link">
                Browse support requests <FaArrowRight size={11} />
              </Link>
            </div>

            <div className="dg-stat-row">
              {heroStats.map((stat) => (
                <div key={stat.label} className="dg-stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dg-hero-collage">
            <div className="dg-photo-card dg-photo-main">
              <img src={donationGuideVolunteersImg} alt="Volunteers organizing donation support" />
            </div>
            <div className="dg-photo-card dg-photo-side dg-photo-side-top">
              <img src={donationGuideHopeImg} alt="Awareness display reminding patients they are not alone" />
            </div>
            <div className="dg-photo-card dg-photo-side dg-photo-side-bottom">
              <img src={donationGuideNeedImg} alt="Cancer patients need your help" />
            </div>
            <div className="dg-floating-note">
              <strong>Support that feels human</strong>
              <p>
                Each step is designed to protect donors, patients, and the integrity of the items
                being delivered.
              </p>
            </div>
          </div>
        </section>

        <div style={{ maxWidth: 920, margin: "0 auto", padding: "40px 28px 0" }}>

          {/* Section heading */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 24, height: 2.5, background: "#E5989B", borderRadius: 2 }} />
            <span style={{
              fontSize: 11, fontWeight: 500,
              letterSpacing: "0.16em", textTransform: "uppercase", color: "#E5989B",
            }}>
              10 steps · donor flow
            </span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1724", margin: "0 0 4px" }}>
            How your donation moves through the system
          </h2>
          <p style={{ fontSize: 13, color: "#B5838D", marginBottom: 20 }}>
            Select a phase to explore each step in detail.
          </p>

          {/* Phase tab switcher */}
          <div style={{
            display: "flex", alignItems: "center", gap: 0,
            marginBottom: 20, background: "#fff",
            border: "0.5px solid #F0E5E8", borderRadius: 12,
            padding: 4, width: "fit-content",
          }}>
            {phases.map((p, i) => {
              const active = activePhase === p.num;
              return (
                <React.Fragment key={p.num}>
                  <button
                    className="dg-pill"
                    onClick={() => setActivePhase(p.num)}
                    style={{
                      padding: "7px 18px", fontSize: 13, fontWeight: 500,
                      borderRadius: 9, border: "none", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      background: active ? p.accent : "transparent",
                      color: active
                        ? (p.num === 1 ? "#EDE9F8" : p.num === 2 ? "#FDF5F7" : "#FEF0F3")
                        : "#B5838D",
                      transition: "all 0.18s ease",
                    }}
                  >
                    Phase {p.num} · {p.label}
                  </button>
                  {i < phases.length - 1 && (
                    <div style={{ width: 1, height: 18, background: "#F0E5E8", margin: "0 2px" }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Active phase panel */}
          <PhasePanel phaseNum={activePhase} />

          {/* Navigation */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 20, paddingTop: 16, borderTop: "0.5px solid #F0E5E8",
          }}>
            <button
              onClick={() => setActivePhase(p => Math.max(1, p - 1))}
              disabled={activePhase === 1}
              style={{
                padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                border: "0.5px solid #F0E5E8", background: "#fff",
                color: activePhase === 1 ? "#D1BCC1" : "#1a1724",
                cursor: activePhase === 1 ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.18s ease",
              }}
            >
              ← Back
            </button>

            {/* Step dots */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {phases.map(p => (
                <div
                  key={p.num}
                  onClick={() => setActivePhase(p.num)}
                  style={{
                    width: activePhase === p.num ? 20 : 7,
                    height: 7, borderRadius: 4,
                    background: activePhase === p.num ? p.accent : "#F0E5E8",
                    cursor: "pointer", transition: "all 0.25s ease",
                  }}
                />
              ))}
            </div>

            {activePhase < 3 ? (
              <button
                onClick={() => setActivePhase(p => Math.min(3, p + 1))}
                style={{
                  padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                  border: "none", cursor: "pointer",
                  background: phases[activePhase - 1].accent,
                  color: activePhase === 1 ? "#EDE9F8" : activePhase === 2 ? "#FDF5F7" : "#FEF0F3",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.18s ease",
                }}
              >
                Next: {phases[activePhase].label} →
              </button>
            ) : (
              <Link
                to={ROUTES.SUPPORT_REQUEST}
                style={{
                  padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: "#5E548E", color: "#EDE9F8",
                  textDecoration: "none", transition: "all 0.18s ease",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
              >
                Start my journey <FaArrowRight size={11} />
              </Link>
            )}
          </div>
        </div>

        {/* ── FOOTER CALLOUT ── */}
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 28px 56px" }}>
          <div className="dg-impact-panel">
            <div className="dg-impact-copy">
              <span>Why the process matters</span>
              <h3>Every careful step protects real people.</h3>
              <p>
                Clear approvals, exact prescriptions, and documented handovers help your donation
                reach the right patient with less confusion and more trust.
              </p>
              <div className="dg-impact-list">
                <div>Patients receive the exact items they asked for</div>
                <div>Donors know when and where to act</div>
                <div>The foundation can verify every handover properly</div>
              </div>
            </div>

            <div className="dg-impact-image">
              <img src={donationGuideNeedImg} alt="Cancer patients need your help" />
            </div>
          </div>

          <div className="dg-footer-grid">

            {/* Reminder card */}
            <div style={{
              background: "#fff",
              border: "0.5px solid #F0E5E8",
              borderRadius: 16, padding: "22px 20px",
            }}>
              <div style={{
                fontSize: 10, fontWeight: 500,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#B5838D", marginBottom: 10,
              }}>
                Important reminder
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1724", margin: "0 0 8px", lineHeight: 1.35 }}>
                Only purchase after you receive approval.
              </h3>
              <p style={{ fontSize: 12, color: "#B5838D", lineHeight: 1.65, margin: "0 0 14px" }}>
                The reference code keeps your donation traceable from purchase to patient handover.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {reminders.map(r => (
                  <div key={r} style={{
                    display: "flex", alignItems: "center", gap: 9,
                    fontSize: 12, fontWeight: 500, color: "#5E548E",
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: "#EDE9F8",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#5E548E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    {r}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div style={{ background: "#5E548E", borderRadius: 16, padding: "22px 20px" }}>
              <div style={{
                fontSize: 10, fontWeight: 500,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)", marginBottom: 10,
              }}>
                Ready to help?
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 8px", lineHeight: 1.35 }}>
                Make your donation smooth, trusted, and meaningful.
              </h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: "0 0 16px" }}>
                Browse a support request and follow the guided process with full confidence.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link
                  to={ROUTES.SUPPORT_REQUEST}
                  className="dg-cta"
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    fontSize: 12, fontWeight: 600, color: "#5E548E",
                    background: "rgba(255,255,255,0.92)",
                    borderRadius: 9, padding: "9px 12px",
                    textDecoration: "none", transition: "all 0.18s ease",
                  }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#E5989B", flexShrink: 0 }} />
                  Browse support requests
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default DonationGuide;