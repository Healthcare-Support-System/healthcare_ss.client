import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight, FaBoxOpen, FaCheckCircle, FaClipboardCheck,
  FaClipboardList, FaFilePrescription, FaGift, FaMapMarkerAlt,
  FaSearch, FaShoppingBag, FaUserShield,
} from "react-icons/fa";
import { ROUTES } from "../routes/path";

const steps = [
  { code: "D1", title: "Browse & select case",       desc: "Find a verified patient case and choose the one you want to support.",               icon: FaSearch,          phase: 1, accent: "#4A3F7A", bg: "#EDE9F8", textCol: "#2e2840" },
  { code: "D2", title: "View required items",         desc: "Open the case to see the exact medicines and care essentials requested.",            icon: FaClipboardList,   phase: 1, accent: "#4A3F7A", bg: "#EDE9F8", textCol: "#2e2840" },
  { code: "D3", title: "Submit donation request",     desc: "Send your intent to donate so the team can reserve the request properly.",          icon: FaGift,            phase: 1, accent: "#fff",    bg: "#4A3F7A", textCol: "#fff",    dark: true },
  { code: "D4", title: "Admin review",                desc: "The team verifies availability and patient needs before moving forward.",           icon: FaUserShield,      phase: 2, accent: "#C9686B", bg: "#FDF0F4", textCol: "#2e2840" },
  { code: "D5", title: "Approval & reference code",   desc: "You receive confirmation and a unique reference code for tracking.",                icon: FaCheckCircle,     phase: 2, accent: "#fff",    bg: "#C9686B", textCol: "#fff",    dark: true },
  { code: "D6", title: "Download prescription PDF",   desc: "Get the approved document so you purchase only exactly what is needed.",           icon: FaFilePrescription, phase: 2, accent: "#C9686B", bg: "#FDF0F4", textCol: "#2e2840" },
  { code: "D7", title: "Purchase items",              desc: "Buy only the listed items from the prescription — no substitutions.",               icon: FaShoppingBag,     phase: 3, accent: "#2D7A5A", bg: "#E8F5EF", textCol: "#2e2840" },
  { code: "D8", title: "Deliver to collection point", desc: "Bring purchased items and your reference code to the designated drop-off.",        icon: FaMapMarkerAlt,    phase: 3, accent: "#fff",    bg: "#2D7A5A", textCol: "#fff",    dark: true },
  { code: "D9", title: "Item verification",           desc: "The team checks each item against the approved request before accepting.",         icon: FaClipboardCheck,  phase: 3, accent: "#2D7A5A", bg: "#E8F5EF", textCol: "#2e2840" },
  { code: "D10", title: "Track donation status",      desc: "Follow your donation in the system from received to verified to completed.",       icon: FaBoxOpen,         phase: 3, accent: "#2D7A5A", bg: "#E8F5EF", textCol: "#2e2840" },
];

const phases = [
  { num: "01", label: "Choose",  desc: "Browse cases and understand the exact need before you commit.", tagBg: "#EDE9F8", tagText: "#4A3F7A" },
  { num: "02", label: "Approve", desc: "The platform reviews and issues a reference code for traceability.", tagBg: "#FDF0F4", tagText: "#C9686B" },
  { num: "03", label: "Deliver", desc: "Purchase, hand over, verify, and track until fully complete.", tagBg: "#E8F5EF", tagText: "#2D7A5A" },
];

const phaseMeta = {
  1: { banner: "Phase 1 — Browsing & selection", bannerBg: "rgba(74,63,122,0.12)", bannerText: "#EDE9F8" },
  2: { banner: "Phase 2 — Approval process",     bannerBg: "rgba(201,104,107,0.14)", bannerText: "#FDF0F4" },
  3: { banner: "Phase 3 — Delivery & completion", bannerBg: "rgba(45,122,90,0.14)",  bannerText: "#E8F5EF" },
};

const DonationGuide = () => {
  let lastPhase = 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .dg, .dg * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .dg-step-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .dg-step-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(74,63,122,0.18); }
        .dg-cta-btn { transition: all 0.18s ease; }
        .dg-cta-btn:hover { transform: translateY(-1px); }
        .dg-cta-btn:active { transform: scale(0.97); }
        @keyframes dg-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .dg-float { animation: dg-float 4s ease-in-out infinite; }
      `}</style>

      <div className="dg" style={{ background: "#FFF9F5", minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <div style={{ background: "#4A3F7A", padding: "0 0 0 0", position: "relative", overflow: "hidden" }}>
          {/* Decorative blobs */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(94,84,142,0.5)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -30, left: "30%", width: 160, height: 160, borderRadius: "50%", background: "rgba(201,104,107,0.15)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 28px 40px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Cancer Support Fund · HOPE</span>
            </div>

            <h1 style={{ fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 0 14px", maxWidth: 560 }}>
              Your donation journey, step by step.
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 500 }}>
              Every donation follows a guided 10-step process — so donors give with confidence, and patients receive exactly what they need.
            </p>

            {/* Phase pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
              {phases.map((p) => (
                <div key={p.label} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 18px", minWidth: 170 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 3 }}>Phase {p.num}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to={ROUTES.SUPPORT_REQUEST} className="dg-cta-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "#fff", color: "#4A3F7A", borderRadius: 30, fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                Browse patient cases <FaArrowRight size={11} />
              </Link>
              <Link to={ROUTES.DONATE} className="dg-cta-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: 30, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                Start donating
              </Link>
            </div>
          </div>

          {/* Bottom wave */}
          <svg viewBox="0 0 680 36" width="100%" style={{ display: "block", marginBottom: -1 }} preserveAspectRatio="none">
            <path d="M0 36 Q170 0 340 20 Q510 36 680 8 L680 36 Z" fill="#FFF9F5"/>
          </svg>
        </div>

        {/* ── STEP MAP ── */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 28px 60px" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 2, background: "#C9686B", borderRadius: 2 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9686B" }}>10 steps · donor flow</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2e2840", margin: "0 0 28px" }}>How your donation moves through the system</h2>

          <div style={{ position: "relative" }}>
            {/* Spine */}
            <div style={{ position: "absolute", left: 21, top: 24, bottom: 24, width: 2, background: "linear-gradient(180deg,#4A3F7A 0%,#C9686B 50%,#2D7A5A 100%)", borderRadius: 2, zIndex: 0 }} />

            {steps.map((step, i) => {
              const Icon = step.icon;
              const showBanner = step.phase !== lastPhase;
              lastPhase = step.phase;
              const pm = phaseMeta[step.phase];

              return (
                <div key={step.code}>
                  {showBanner && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 12px 56px" }}>
                      <div style={{ background: pm.bannerBg, borderRadius: 20, padding: "4px 14px" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: pm.bannerText }}>{pm.banner}</span>
                      </div>
                      <div style={{ flex: 1, height: 1, borderTop: "1.5px dashed rgba(255,255,255,0.1)", background: "none" }} />
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 12, alignItems: "flex-start", marginBottom: 10, position: "relative", zIndex: 1 }}>
                    {/* Icon bubble */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div className="dg-float" style={{ width: 44, height: 44, borderRadius: 14, background: step.bg, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FFF9F5", animationDelay: `${i * 0.3}s` }}>
                        <Icon size={17} color={step.dark ? "rgba(255,255,255,0.85)" : step.accent} />
                      </div>
                    </div>

                    {/* Card */}
                    <div className="dg-step-card" style={{ background: step.bg, borderRadius: 16, overflow: "hidden", border: step.dark ? "none" : "1px solid rgba(0,0,0,0.06)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr" }}>
                        {/* Code column */}
                        <div style={{ background: step.dark ? "rgba(0,0,0,0.20)" : "rgba(0,0,0,0.06)", padding: "14px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: step.dark ? "rgba(255,255,255,0.5)" : step.accent, marginBottom: 2 }}>Step</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: step.dark ? "#fff" : step.accent, lineHeight: 1 }}>{step.code}</div>
                        </div>
                        {/* Content */}
                        <div style={{ padding: "13px 16px" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: step.textCol, marginBottom: 5, lineHeight: 1.2 }}>{step.title}</div>
                          <div style={{ fontSize: 12, color: step.dark ? "rgba(255,255,255,0.65)" : "#9A90A8", lineHeight: 1.6 }}>{step.desc}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER CALLOUT ── */}
        <div style={{ maxWidth: 900, margin: "0 auto 0", padding: "0 28px 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* Reminder */}
            <div style={{ background: "#fff", border: "1px solid #E2CDD3", borderRadius: 20, padding: "24px 24px" }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9686B", marginBottom: 10 }}>Important reminder</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2e2840", margin: "0 0 10px", lineHeight: 1.3 }}>Only purchase after you receive approval.</h3>
              <p style={{ fontSize: 12.5, color: "#9A90A8", lineHeight: 1.65, margin: 0 }}>The reference code keeps your donation traceable from purchase to patient handover to completion.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
                {["Verified patient need", "Reference-based tracking", "Safer item handover"].map(c => (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "#4A3F7A" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#EDE9F8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#4A3F7A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: "#4A3F7A", borderRadius: 20, padding: "24px 24px" }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Ready to help?</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 10px", lineHeight: 1.3 }}>Make your donation smooth, trusted, and meaningful.</h3>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: "0 0 18px" }}>Browse a support request and follow the guided process with full confidence.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link to={ROUTES.SUPPORT_REQUEST} className="dg-cta-btn"
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: "#4A3F7A", background: "rgba(255,255,255,0.92)", borderRadius: 10, padding: "9px 14px", textDecoration: "none" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9686B", flexShrink: 0 }} />
                  Browse support requests
                </Link>
                <Link to={ROUTES.DONATE} className="dg-cta-btn"
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "9px 14px", textDecoration: "none" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2D7A5A", flexShrink: 0 }} />
                  Go to donate page
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