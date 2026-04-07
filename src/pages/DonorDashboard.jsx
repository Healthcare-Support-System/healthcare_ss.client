import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { privateApiClient } from "../api/apiClient";
import { END_POINTS } from "../api/endPoints";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../routes/path";
import jsPDF from "jspdf";

/* ─── Static Data ────────────────────────────────────────── */
const emptyForm = {
  email: "",
  first_name: "",
  last_name: "",
  nic: "",
  phone: "",
  address: "",
};

const emptyDonationForm = {
  phone: "",
  message: "",
};

const statusStyles = {
  pending:  { bg: "rgba(229,152,155,0.12)", color: "#7a4050", dot: "#E5989B" },
  approved: { bg: "rgba(94,84,142,0.10)",  color: "#4A4272", dot: "#7B6DB0" },
  rejected: { bg: "rgba(181,131,141,0.12)", color: "#7a4050", dot: "#B5838D" },
};

/* ─── Helpers ────────────────────────────────────────────── */
function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" });
}

function formatValue(value, fallback = "Not available") {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
}

function buildFormFromProfile(profile) {
  return {
    email:      profile?.email      || "",
    first_name: profile?.first_name || "",
    last_name:  profile?.last_name  || "",
    nic:        profile?.nic        || "",
    phone:      profile?.phone      || "",
    address:    profile?.address    || "",
  };
}

function getDisplayStatus(status) {
  if (status === "accepted") return "approved";
  return status || "pending";
}

function getInitials(profile) {
  const first = profile?.first_name?.[0] || "";
  const last  = profile?.last_name?.[0]  || "";
  return (first + last).toUpperCase() || "D";
}

function getDonationEntryId(entry) {
  return entry?._id || entry?.id || entry?.donation_request_id || null;
}

function generateDonationSummary(entry, profile) {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = [94, 84, 142]; // Plum color
  const secondaryColor = [229, 152, 155]; // Rose color
  const textColor = [26, 22, 37]; // Dark ink
  const lightGray = [248, 244, 246]; // Light background
  
  // Add subtle watermark
  doc.setTextColor(240, 240, 240);
  doc.setFontSize(60);
  doc.setFont("helvetica", "bold");
  doc.text("Suwa Saviya", 105, 150, { angle: 45, align: "center" });
  
  // Header
  doc.setTextColor(...primaryColor);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("SUWA SAVIYA FOUNDATION", 105, 25, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);
  doc.text("Together, We Care, Together, We Cure", 105, 35, { align: "center" });
  
  doc.setFontSize(10);
  doc.text("Mahela Jayawardena Mawatha, Maharagama 10280", 105, 42, { align: "center" });
  doc.text("Phone: +94 11 123 4567 | Email: info@suwaviya.org", 105, 48, { align: "center" });
  
  // Pdf title
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 55, 190, 55);
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("DONATION ITEMS SUMMARY", 105, 72, { align: "center" });
  
  // PDF details
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);
  doc.text(`Reference No: ${entry?.reference_code || 'N/A'}`, 20, 80);
  doc.text(`Date: ${formatDate(entry?.created_at)}`, 20, 87);
  doc.text(`Approved Date: ${entry?.accepted_at ? formatDate(entry.accepted_at) : 'N/A'}`, 20, 94);
  
  // Donor information box
  doc.setFillColor(...lightGray);
  doc.rect(20, 105, 170, 25, 'F');
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.2);
  doc.rect(20, 105, 170, 25);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("DONOR INFORMATION", 25, 113);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);
  doc.text(`Name: ${profile?.first_name || ''} ${profile?.last_name || ''}`, 25, 120);
  doc.text(`Email: ${profile?.email || ''}`, 25, 126);
  doc.text(`Phone: ${entry?.phone || ''}`, 120, 126);
  
  // Support request details
  const supportRequest = entry?.request_id && typeof entry.request_id === "object" ? entry.request_id : null;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("SUPPORT REQUEST DETAILS", 20, 140);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);
  let y = 148;
  doc.text(`Request Type: ${supportRequest?.request_type || supportRequest?.title || 'Support request'}`, 20, y);
  y += 6;
  doc.text(`Description: ${supportRequest?.description || 'No description'}`, 20, y);
  
  // Items table
  const requestItems = Array.isArray(supportRequest?.items) ? supportRequest.items : [];
  if (requestItems.length > 0) {
    y += 15;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("ITEMS SUMMARY", 20, y);
    
    // Table header
    y += 8;
    doc.setFillColor(...primaryColor);
    doc.rect(20, y-3, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Item Description", 25, y+2);
    doc.text("Quantity", 120, y+2);
    doc.text("Est. Value (Rs.)", 150, y+2);
    
    // Table rows
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");
    y += 8;
    
    requestItems.forEach((item, idx) => {
      const fillColor = idx % 2 === 0 ? lightGray : [255, 255, 255];
      doc.setFillColor(...fillColor);
      doc.rect(20, y-3, 170, 8, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.rect(20, y-3, 170, 8);
      
      doc.text(item?.item_name || 'Unnamed item', 25, y+2);
      doc.text(`${item?.quantity || 'N/A'} ${item?.unit || ''}`, 120, y+2);
      doc.text(`${item?.estimated_value || 'N/A'}`, 150, y+2);
      y += 8;
    });
  }
  
  // Verification section
  y += 10;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  
  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("DONATION SUMMARY", 105, y, { align: "center" });
  
  y += 8;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);
  doc.text("This document provides a summary of your donation.", 105, y, { align: "center" });
  y += 5;
  doc.text("All donations are used for healthcare support and medical assistance programs.", 105, y, { align: "center" });
  
  // Footer
  y = 270;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...secondaryColor);
  doc.text("Thank you for your generous support in making a difference in healthcare!", 105, y, { align: "center" });
  
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Suwa Saviya Foundation - Registered Charity Organization", 105, y, { align: "center" });
  doc.text("www.suwaviya.org | contact@suwaviya.org", 105, y+5, { align: "center" });
  
  // Save the PDF
  doc.save(`donation_summary_${entry?.reference_code || 'ref'}.pdf`);
}

/* ─── Styles ─────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');

  :root {
    --plum:      #5E548E;
    --plum-d:    #4A4272;
    --plum-l:    #7B6DB0;
    --plum-xl:   #EEEDF8;
    --rose:      #E5989B;
    --rose-l:    #F2AABF;
    --rose-bg:   rgba(229,152,155,0.08);
    --muted:     #8A7A8E;
    --cream:     #FDFAF9;
    --cream-alt: #F8F4F6;
    --border:    rgba(94,84,142,0.1);
    --border-d:  rgba(94,84,142,0.18);
    --ink:       #1A1625;
    --ink-soft:  #4A3F5C;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dd-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', system-ui, sans-serif;
    color: var(--ink);
  }

  /* ── Top Bar ── */
  .dd-topbar {
    background: #fff;
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .dd-topbar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .dd-topbar-logomark {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--plum), var(--plum-l));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .dd-topbar-logomark svg {
    width: 16px;
    height: 16px;
    fill: #fff;
  }
  .dd-topbar-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--ink);
  }
  .dd-topbar-right {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .dd-topbar-username {
    font-size: 13px;
    color: var(--ink-soft);
  }
  .dd-topbar-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--plum);
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }

  /* ── Hero ── */
  .dd-hero {
    background: var(--plum-d);
    padding: 48px 40px 44px;
    position: relative;
    overflow: hidden;
  }
  .dd-hero-bg {
    position: absolute;
    right: -80px;
    top: -80px;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: rgba(255,255,255,0.025);
    pointer-events: none;
  }
  .dd-hero-grid {
    max-width: 1080px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 32px;
    position: relative;
    z-index: 1;
  }
  .dd-hero-copy {
    flex: 1 1 520px;
    min-width: 300px;
  }
  .dd-hero-label {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    margin-bottom: 14px;
  }
  .dd-hero-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--rose-l);
    flex-shrink: 0;
  }
  .dd-hero-heading {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.2rem, 4vw, 3.4rem);
    font-weight: 500;
    color: #fff;
    line-height: 1.08;
    letter-spacing: -0.02em;
  }
  .dd-hero-heading em {
    font-style: italic;
    color: var(--rose-l);
  }
  .dd-hero-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.55);
    margin-top: 12px;
    line-height: 1.7;
    max-width: 420px;
  }
  .dd-hero-stats {
    display: flex;
    gap: 2px;
    background: rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 4px;
    margin-left: auto;
    align-self: center;
  }
  .dd-hero-stat {
    padding: 14px 22px;
    border-radius: 11px;
    text-align: center;
    min-width: 88px;
  }
  .dd-hero-stat-num {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.6rem;
    font-weight: 500;
    color: #fff;
  }
  .dd-hero-stat-label {
    font-size: 10px;
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 3px;
  }

  /* ── Layout ── */
  .dd-layout {
    max-width: 1080px;
    margin: 0 auto;
    padding: 32px 24px 72px;
    display: flex;
    gap: 28px;
    align-items: flex-start;
  }

  /* ── Sidebar ── */
  .dd-sidebar { width: 220px; flex-shrink: 0; }
  .dd-sidebar-nav {
    background: #fff;
    border-radius: 16px;
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .dd-nav-section { padding: 8px; }
  .dd-nav-section-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 10px 12px 6px;
    display: block;
  }
  .dd-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 400;
    color: var(--ink-soft);
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .dd-nav-item:hover { background: var(--cream-alt); color: var(--plum); }
  .dd-nav-item.active { background: var(--plum-xl); color: var(--plum); font-weight: 500; }
  .dd-nav-icon {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    opacity: 0.6;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.5;
  }
  .dd-nav-item.active .dd-nav-icon { opacity: 1; }
  .dd-nav-divider { height: 1px; background: var(--border); margin: 4px 0; }
  .dd-nav-danger { color: #8f4a55 !important; }

  .dd-sidebar-info {
    background: #fff;
    border-radius: 16px;
    border: 1px solid var(--border);
    padding: 18px 16px;
    margin-top: 12px;
  }
  .dd-sidebar-info-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .dd-sidebar-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--rose-bg);
    border: 1px solid rgba(229,152,155,0.2);
    border-radius: 8px;
    padding: 7px 11px;
    font-size: 12px;
    color: #8f4a55;
    width: 100%;
  }
  .dd-sidebar-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--rose);
    flex-shrink: 0;
  }
  .dd-sidebar-meta {
    margin-top: 14px;
    font-size: 12px;
    color: var(--muted);
    line-height: 1.6;
  }
  .dd-sidebar-meta span { color: var(--plum); font-weight: 500; }

  /* ── Main ── */
  .dd-main { flex: 1; min-width: 0; }

  /* ── Section Header ── */
  .dd-section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
  .dd-section-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.65rem;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.2;
  }
  .dd-section-sub {
    font-size: 13px;
    color: var(--muted);
    margin-top: 4px;
    line-height: 1.6;
  }

  /* ── Buttons ── */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
    border-radius: 8px;
    padding: 8px 16px;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
  .btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .btn svg { width: 13px; height: 13px; flex-shrink: 0; }

  .btn-primary { background: var(--plum); color: #fff; }
  .btn-primary:hover:not(:disabled) { background: var(--plum-d); transform: translateY(-1px); }

  .btn-secondary { background: #fff; color: var(--plum); border: 1px solid var(--border-d); }
  .btn-secondary:hover:not(:disabled) { background: var(--cream-alt); }

  .btn-danger { background: #fff; color: #8f4a55; border: 1px solid rgba(229,152,155,0.3); }
  .btn-danger:hover:not(:disabled) { background: var(--rose-bg); }

  .btn-ghost { background: #fff; color: var(--plum); border: 1px solid var(--border-d); }
  .btn-ghost:hover:not(:disabled) { background: var(--cream-alt); }

  .btn-sm { padding: 6px 12px; font-size: 11px; }

  .flex-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  /* ── Profile Banner ── */
  .dd-profile-banner {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  .dd-profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: 16px;
    flex-shrink: 0;
    background: linear-gradient(135deg, var(--plum), var(--plum-l));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.6rem;
    color: #fff;
    font-style: italic;
  }
  .dd-profile-banner-info { flex: 1; min-width: 0; }
  .dd-profile-banner-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--ink);
  }
  .dd-profile-banner-meta {
    font-size: 13px;
    color: var(--muted);
    margin-top: 5px;
    line-height: 1.6;
  }

  /* ── Field Cards ── */
  .dd-fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .dd-field-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 18px 20px;
    transition: border-color 0.15s;
  }
  .dd-field-card:hover { border-color: var(--border-d); }
  .dd-field-card-full { grid-column: 1 / -1; }
  .dd-field-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .dd-field-value {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.4;
    word-break: break-word;
  }
  .dd-field-value.empty {
    color: var(--muted);
    font-weight: 400;
    font-style: italic;
    font-size: 13px;
  }

  /* ── Edit Form ── */
  .dd-edit-form {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .dd-form-full { grid-column: 1 / -1; }
  .dd-field-label-edit {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 7px;
  }
  .dd-field-input {
    width: 100%;
    background: var(--cream-alt);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .dd-field-input::placeholder { color: #C4B8C8; }
  .dd-field-input:focus {
    border-color: var(--plum-l);
    box-shadow: 0 0 0 3px rgba(94,84,142,0.1);
  }
  textarea.dd-field-input { resize: vertical; min-height: 80px; }

  .editing-chip {
    font-size: 11px;
    font-weight: 500;
    color: var(--muted);
    background: var(--rose-bg);
    border: 1px solid rgba(229,152,155,0.2);
    padding: 6px 14px;
    border-radius: 8px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── Alerts ── */
  .dd-alert {
    border-radius: 12px;
    padding: 13px 16px;
    font-size: 13px;
    margin-bottom: 18px;
    border-left: 3px solid;
    line-height: 1.6;
  }
  .dd-alert-error   { background: #fff5f6; border-color: var(--rose); color: #7a3040; }
  .dd-alert-success { background: #f5faf6; border-color: #4caf7d; color: #2d6645; }
  .dd-alert-info    { background: var(--cream-alt); border-color: var(--plum-l); color: var(--plum); }

  /* ── Loading ── */
  .dd-loading {
    background: #fff;
    border-radius: 14px;
    border: 1px solid var(--border);
    padding: 20px 22px;
    color: var(--muted);
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .dd-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border-d);
    border-top-color: var(--plum);
    border-radius: 50%;
    animation: ddSpin 0.75s linear infinite;
    flex-shrink: 0;
  }
  @keyframes ddSpin { to { transform: rotate(360deg); } }

  /* ── History Filters ── */
  .dd-history-filters {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .dd-filter-pill {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #fff;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  .dd-filter-pill.active { background: var(--plum); color: #fff; border-color: var(--plum); }
  .dd-filter-pill:hover:not(.active) { background: var(--cream-alt); color: var(--plum); }

  /* ── Donation Card ── */
  .dd-donation-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 16px;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .dd-donation-card:hover {
    border-color: var(--border-d);
    box-shadow: 0 4px 20px rgba(94,84,142,0.07);
  }
  .dd-dc-header {
    padding: 22px 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }
  .dd-dc-left { flex: 1; min-width: 0; }
  .dd-dc-eyebrow {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .dd-dc-title {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.25;
  }
  .dd-dc-desc {
    font-size: 13px;
    color: var(--muted);
    margin-top: 5px;
    line-height: 1.65;
    max-width: 440px;
  }
  .dd-dc-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  /* Status Badge */
  .dd-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 7px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: capitalize;
  }
  .dd-status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  /* Meta Strip */
  .dd-dc-meta {
    display: flex;
    border-top: 1px solid var(--border);
  }
  .dd-dc-stat {
    flex: 1;
    padding: 14px 20px;
    border-right: 1px solid var(--border);
  }
  .dd-dc-stat:last-child { border-right: none; }
  .dd-dc-stat-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 5px;
  }
  .dd-dc-stat-value {
    font-size: 14px;
    font-weight: 500;
    color: var(--plum);
  }
  .dd-dc-stat-value.empty {
    color: var(--muted);
    font-style: italic;
    font-size: 13px;
  }

  /* Toggle Button */
  .dd-toggle-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    padding: 6px 13px;
    background: var(--cream-alt);
    border: 1px solid var(--border);
    border-radius: 7px;
    cursor: pointer;
    color: var(--plum);
    transition: all 0.15s;
    white-space: nowrap;
    letter-spacing: 0.02em;
  }
  .dd-toggle-btn:hover { background: var(--border-d); }

  /* Expanded Section */
  .dd-dc-expanded {
    border-top: 1px solid var(--border);
    background: var(--cream);
    padding: 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .dd-detail-block {
    background: #fff;
    border-radius: 14px;
    border: 1px solid var(--border);
    padding: 18px 20px;
  }
  .dd-detail-block-full { grid-column: 1 / -1; }
  .dd-detail-block-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .dd-detail-text { font-size: 13px; color: var(--ink-soft); line-height: 1.75; }

  /* Items List */
  .dd-items-list { list-style: none; }
  .dd-item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
    gap: 8px;
    flex-wrap: wrap;
  }
  .dd-item-row:last-child { border-bottom: none; }
  .dd-item-name { color: var(--ink); font-weight: 500; flex: 1; min-width: 120px; }
  .dd-item-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .dd-item-tag {
    background: var(--cream-alt);
    border-radius: 6px;
    padding: 3px 9px;
    font-size: 11px;
    color: var(--muted);
    white-space: nowrap;
  }
  .dd-item-tag span { color: var(--plum); font-weight: 500; }

  /* Detail Table */
  .dd-detail-table { width: 100%; font-size: 13px; border-collapse: collapse; }
  .dd-detail-table td { padding: 8px 0; border-bottom: 1px solid var(--border); vertical-align: top; }
  .dd-detail-table tr:last-child td { border-bottom: none; }
  .dd-detail-table .dk { color: var(--muted); width: 140px; }
  .dd-detail-table .dv { color: var(--ink); font-weight: 500; word-break: break-word; }
  .dd-detail-table .dv.empty { color: var(--muted); font-style: italic; font-weight: 400; }

  /* Entry Actions */
  .dd-entry-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding: 0 24px 20px;
    border-top: 1px solid var(--border);
    padding-top: 16px;
  }

  /* Empty State */
  .dd-empty {
    text-align: center;
    padding: 56px 24px;
    background: #fff;
    border-radius: 20px;
    border: 1px dashed var(--border-d);
  }
  .dd-empty-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: var(--rose-bg);
    margin: 0 auto 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dd-empty-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--plum);
    margin-bottom: 8px;
  }
  .dd-empty-text {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
    max-width: 320px;
    margin: 0 auto;
  }

  /* Modal */
  .dd-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,22,37,0.55);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .dd-modal {
    background: #fff;
    border-radius: 24px;
    padding: 32px;
    width: 100%;
    max-width: 460px;
    border: 1px solid var(--border);
    box-shadow: 0 24px 60px rgba(94,84,142,0.15);
  }
  .dd-modal-wide { max-width: 520px; }
  .dd-modal-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--plum);
    margin-bottom: 12px;
  }
  .dd-modal-body {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 24px;
    padding: 12px 16px;
    background: var(--cream-alt);
    border-radius: 10px;
    border-left: 3px solid var(--rose);
  }
  .dd-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }
  .dd-modal-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 22px;
  }

  /* Responsive */
  @media (max-width: 720px) {
    .dd-layout { flex-direction: column; }
    .dd-sidebar { width: 100%; }
    .dd-fields-grid { grid-template-columns: 1fr; }
    .dd-edit-form { grid-template-columns: 1fr; }
    .dd-dc-expanded { grid-template-columns: 1fr; }
    .dd-dc-meta { flex-wrap: wrap; }
    .dd-hero { padding: 36px 20px 32px; }
    .dd-hero-grid { align-items: flex-start; gap: 20px; }
    .dd-hero-copy { flex-basis: 100%; min-width: 0; }
    .dd-hero-stats { width: 100%; margin-left: 0; justify-content: space-between; }
    .dd-topbar { padding: 0 16px; }
  }
`;

const StyleTag = () => <style dangerouslySetInnerHTML={{ __html: css }} />;

/* ─── Sub-components ─────────────────────────────────────── */

const StatusBadge = ({ status }) => {
  const cfg = statusStyles[status] || statusStyles.pending;
  return (
    <span className="dd-status-badge" style={{ background: cfg.bg, color: cfg.color }}>
      <span className="dd-status-dot" style={{ background: cfg.dot }} />
      {status}
    </span>
  );
};

const ConfirmModal = ({ title, message, confirmLabel, confirmDanger = false, onConfirm, onCancel, isProcessing = false }) => (
  <div className="dd-modal-overlay">
    <div className="dd-modal">
      <h3 className="dd-modal-title">{title}</h3>
      <p className="dd-modal-body">{message}</p>
      <div className="dd-modal-actions">
        <button type="button" onClick={onCancel} disabled={isProcessing} className="btn btn-secondary">
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isProcessing}
          className={confirmDanger ? "btn btn-danger" : "btn btn-primary"}
          style={confirmDanger ? { background: "var(--rose)", color: "#fff", border: "none" } : {}}
        >
          {isProcessing ? "Please wait…" : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

const DonationRequestModal = ({ formData, onChange, onClose, onSubmit, isProcessing = false }) => (
  <div className="dd-modal-overlay">
    <div className="dd-modal dd-modal-wide">
      <h3 className="dd-modal-title">Update donation request</h3>
      <p className="dd-modal-body">Only pending requests can be updated. Phone number is required before saving.</p>
      <form onSubmit={onSubmit}>
        <div className="dd-modal-form">
          <div>
            <label className="dd-field-label-edit">Phone number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={onChange} required className="dd-field-input" placeholder="07XXXXXXXX" />
          </div>
          <div>
            <label className="dd-field-label-edit">Message</label>
            <textarea name="message" value={formData.message} onChange={onChange} rows="4" className="dd-field-input" />
          </div>
        </div>
        <div className="dd-modal-actions">
          <button type="button" onClick={onClose} disabled={isProcessing} className="btn btn-secondary">Cancel</button>
          <button type="submit" disabled={isProcessing} className="btn btn-primary">
            {isProcessing ? "Saving…" : "Save request"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */
const DonorDashboard = () => {
  const navigate = useNavigate();
  const { logout, setUser, user } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [historyFilter, setHistoryFilter] = useState("all");
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [donationHistory, setDonationHistory] = useState([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDonationRequest, setSelectedDonationRequest] = useState(null);
  const [donationFormData, setDonationFormData] = useState(emptyDonationForm);
  const [showDonationEditModal, setShowDonationEditModal] = useState(false);
  const [showDonationDeleteConfirm, setShowDonationDeleteConfirm] = useState(false);
  const [isDonationSaving, setIsDonationSaving] = useState(false);
  const [isDonationDeleting, setIsDonationDeleting] = useState(false);

  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");
  const [historyErrorMessage, setHistoryErrorMessage] = useState("");
  const [historySuccessMessage, setHistorySuccessMessage] = useState("");

  /* ─ Derived stats ─ */
  const totalRequests    = donationHistory.length;
  const approvedRequests = donationHistory.filter(e => getDisplayStatus(e?.status) === "approved").length;
  const pendingRequests  = donationHistory.filter(e => getDisplayStatus(e?.status) === "pending").length;
  const rejectedRequests = donationHistory.filter(e => getDisplayStatus(e?.status) === "rejected").length;

  const filteredHistory = historyFilter === "all"
    ? donationHistory
    : donationHistory.filter(e => getDisplayStatus(e?.status) === historyFilter);

  /* ─ Data fetching ─ */
  const syncProfileState = useCallback((nextProfile) => {
    setProfile(nextProfile);
    setFormData(buildFormFromProfile(nextProfile));
    if (nextProfile?.id) localStorage.setItem("donorId", nextProfile.id);
    if (nextProfile?.full_name) localStorage.setItem("donorName", nextProfile.full_name);
  }, []);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setProfileErrorMessage("");
    try {
      const { data } = await privateApiClient.get(END_POINTS.GET_DONOR_PROFILE);
      // Fetch the donor's latest saved profile 
      syncProfileState(data);
    } catch (error) {
      setProfileErrorMessage(error?.response?.data?.message || "We could not load your donor profile right now.");
    } finally {
      setIsLoading(false);
    }
  }, [syncProfileState]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const fetchDonationHistory = useCallback(async () => {
    // Donation history
    if (!profile?.id) { setDonationHistory([]); return; }
    setIsHistoryLoading(true);
    setHistoryErrorMessage("");
    try {
      const { data } = await privateApiClient.get(`${END_POINTS.GET_DONOR_DONATION_REQUESTS}/${profile.id}`);
      setDonationHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      setHistoryErrorMessage(error?.response?.data?.message || "Unable to load your donation history right now.");
    } finally {
      setIsHistoryLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (activeTab === "history" && profile?.id) fetchDonationHistory();
  }, [activeTab, fetchDonationHistory, profile?.id]);

  /* ─ Profile handlers ─ */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((c) => ({ ...c, [name]: value }));
  };

  const handleEditStart = () => {
    setProfileSuccessMessage("");
    setProfileErrorMessage("");
    // Start each edit session from the last saved profile values.
    setFormData(buildFormFromProfile(profile));
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    // Cancel restores the form so unsaved edits never leak into the next session.
    setFormData(buildFormFromProfile(profile));
    setIsEditing(false);
    setShowUpdateConfirm(false);
  };

  const handleUpdateRequest = (event) => {
    event.preventDefault();
    setProfileSuccessMessage("");
    setProfileErrorMessage("");
    setShowUpdateConfirm(true);
  };

  const handleConfirmedUpdate = async () => {
    const trimmedEmail     = formData.email.trim();
    const trimmedFirstName = formData.first_name.trim();
    const trimmedLastName  = formData.last_name.trim();
    const trimmedNic       = formData.nic.trim();
    const trimmedPhone     = formData.phone.trim();
    const trimmedAddress   = formData.address.trim();

    setProfileErrorMessage("");
    setProfileSuccessMessage("");

    // Validate the cleaned values before sending the update request.
    // We close the confirmation modal on validation failure so the user can fix the form right away.
    if (!trimmedFirstName) { setProfileErrorMessage("First name is required."); setShowUpdateConfirm(false); return; }
    if (!trimmedLastName)  { setProfileErrorMessage("Last name is required.");  setShowUpdateConfirm(false); return; }
    if (!trimmedEmail)     { setProfileErrorMessage("Email address is required."); setShowUpdateConfirm(false); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) { setProfileErrorMessage("Enter a valid email address."); setShowUpdateConfirm(false); return; }
    if (!trimmedNic) { setProfileErrorMessage("NIC is required."); setShowUpdateConfirm(false); return; }
    if (!/^\d{9}[Vv]$|^\d{12}$/.test(trimmedNic)) { setProfileErrorMessage("Enter a valid NIC number."); setShowUpdateConfirm(false); return; }
    if (trimmedPhone && !/^07\d{8}$/.test(trimmedPhone)) { setProfileErrorMessage("Enter a valid phone number in the format 07XXXXXXXX."); setShowUpdateConfirm(false); return; }

    setIsSaving(true);
    try {
      // Build the update request body using only the donor fields that are editable from this screen.
      const payload = { email: trimmedEmail, first_name: trimmedFirstName, last_name: trimmedLastName, nic: trimmedNic, phone: trimmedPhone, address: trimmedAddress };
      const { data } = await privateApiClient.put(END_POINTS.UPDATE_DONOR_PROFILE, payload);
      const updatedProfile = data?.profile || data;
      // Refresh local profile state with the backend response so the UI shows the saved values immediately.
      syncProfileState(updatedProfile);
      setIsEditing(false);
      setShowUpdateConfirm(false);
      setProfileSuccessMessage(data?.message || "Your donor profile was updated successfully.");
      if (user) {
        // Also sync the auth/session copy because other pages read donor details from the logged-in user object.
        const nextUser = {
          ...user,
          email: updatedProfile?.email || user.email,
          first_name: updatedProfile?.first_name || user.first_name,
          last_name: updatedProfile?.last_name || user.last_name,
          full_name: updatedProfile?.full_name || user.full_name,
        };
        setUser(nextUser);
        localStorage.setItem("user", JSON.stringify(nextUser));
        localStorage.setItem("donorName", updatedProfile?.full_name || "");
      }
    } catch (error) {
      setProfileErrorMessage(error?.response?.data?.message || "We could not update your donor profile right now.");
      setShowUpdateConfirm(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmedDelete = async () => {
    setIsDeleting(true);
    setProfileErrorMessage("");
    setProfileSuccessMessage("");
    try {
      // Delete the donor profile from the backend.
      // If it succeeds, log the donor out and redirect because the current account no longer exists.
      await privateApiClient.delete(END_POINTS.DELETE_DONOR_PROFILE);
      logout();
      navigate(ROUTES.SIGNIN, { replace: true, state: { message: "Your donor profile has been deleted." } });
    } catch (error) {
      setProfileErrorMessage(error?.response?.data?.message || "We could not delete your donor profile right now.");
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  };

  /* ─ Donation handlers ─ */
  const handleDonationFormChange = (event) => {
    const { name, value } = event.target;
    setDonationFormData((c) => ({ ...c, [name]: value }));
  };

  const handleDonationEditStart = (entry) => {
    // Only pending requests remain editable once they reach the donor history screen.
    if (entry?.status !== "pending") return;
    setHistoryErrorMessage("");
    setHistorySuccessMessage("");
    setSelectedDonationRequest(entry);
    setDonationFormData({ phone: entry?.phone || "", message: entry?.message || "" });
    setShowDonationEditModal(true);
  };

  const handleDonationEditClose = () => {
    setShowDonationEditModal(false);
    setSelectedDonationRequest(null);
    setDonationFormData(emptyDonationForm);
  };

  const handleDonationUpdate = async (event) => {
    event.preventDefault();
    if (!selectedDonationRequest) return;
    // Validate the editable fields before sending the update request for this donation entry.
    const nextPhone = donationFormData.phone.trim();
    const nextMessage = donationFormData.message.trim();
    if (!nextPhone) { setHistoryErrorMessage("Phone number is required."); return; }
    if (!/^07\d{8}$/.test(nextPhone)) { setHistoryErrorMessage("Enter a valid phone number in the format 07XXXXXXXX."); return; }

    setIsDonationSaving(true);
    setHistoryErrorMessage("");
    setHistorySuccessMessage("");
    try {
      const requestId = getDonationEntryId(selectedDonationRequest);
      if (!requestId) {
        setHistoryErrorMessage("We could not identify this donation request to update.");
        return;
      }
      // Send only the fields the donor is allowed to change from the history modal.
      const payload = { phone: nextPhone, message: nextMessage };
      const { data } = await privateApiClient.put(END_POINTS.UPDATE_DONATION_REQUEST(requestId), payload);
      const updatedRequest = data?.data || {};
      // Reflect the edited values in local state immediately so the dashboard updates as soon as save succeeds.
      setDonationHistory((history) =>
        history.map((entry) => {
          if (getDonationEntryId(entry) !== requestId) return entry;
          return {
            ...entry,
            ...updatedRequest,
            phone: nextPhone,
            message: nextMessage,
          };
        })
      );
      setHistorySuccessMessage(data?.message || "The donation request was updated successfully.");
      handleDonationEditClose();
    
      fetchDonationHistory();
    } catch (error) {
      setHistoryErrorMessage(error?.response?.data?.message || "We could not update this donation request right now.");
    } finally {
      setIsDonationSaving(false);
    }
  };

  const handleDonationDeleteStart = (entry) => {
    // Deletion follows the same pending-only rule as editing.
    if (entry?.status !== "pending") return;
    setHistoryErrorMessage("");
    setHistorySuccessMessage("");
    setSelectedDonationRequest(entry);
    setShowDonationDeleteConfirm(true);
  };

  const handleDonationDeleteCancel = () => {
    setShowDonationDeleteConfirm(false);
    setSelectedDonationRequest(null);
  };

  const handleDonationDeleteConfirm = async () => {
    if (!selectedDonationRequest) return;
    setIsDonationDeleting(true);
    setHistoryErrorMessage("");
    setHistorySuccessMessage("");
    try {
      const requestId = getDonationEntryId(selectedDonationRequest);
      if (!requestId) {
        setHistoryErrorMessage("We could not identify this donation request to delete.");
        return;
      }
      // Send the delete request for the selected donation entry.
      await privateApiClient.delete(END_POINTS.DELETE_DONATION_REQUEST(requestId));
      setDonationHistory((h) => h.filter((entry) => getDonationEntryId(entry) !== requestId));
      setHistorySuccessMessage("The donation request was deleted successfully.");
      handleDonationDeleteCancel();
    } catch (error) {
      setHistoryErrorMessage(error?.response?.data?.message || "We could not delete this donation request right now.");
      setShowDonationDeleteConfirm(false);
    } finally {
      setIsDonationDeleting(false);
    }
  };

  const firstName = profile?.first_name || user?.first_name || "Donor";
  const initials  = getInitials(profile || user);

  /* ─── Render ─────────────────────────────────────────── */
  return (
    <>
      <StyleTag />

      <div className="dd-root">

        {/* Hero */}
        <div className="dd-hero">
          <div className="dd-hero-bg" />
          <div className="dd-hero-grid">
            <div className="dd-hero-copy">
              <p className="dd-hero-label"><span className="dd-hero-dot" />Donor Portal</p>
              <h1 className="dd-hero-heading">
                Welcome <em>back,</em><br />{firstName}
              </h1>
              <p className="dd-hero-sub">
                Manage your donor profile and track your contribution history from one place.
              </p>
            </div>
            <div className="dd-hero-stats">
              <div className="dd-hero-stat">
                <div className="dd-hero-stat-num">{totalRequests}</div>
                <div className="dd-hero-stat-label">Total</div>
              </div>
              <div className="dd-hero-stat">
                <div className="dd-hero-stat-num">{approvedRequests}</div>
                <div className="dd-hero-stat-label">Approved</div>
              </div>
              <div className="dd-hero-stat">
                <div className="dd-hero-stat-num">{pendingRequests}</div>
                <div className="dd-hero-stat-label">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="dd-layout">

          {/* Sidebar */}
          <aside className="dd-sidebar">
            <nav className="dd-sidebar-nav">
              <div className="dd-nav-section">
                <span className="dd-nav-section-label">Account</span>
                <button
                  type="button"
                  className={`dd-nav-item ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <svg className="dd-nav-icon" viewBox="0 0 20 20"><circle cx="10" cy="7" r="3.5" /><path d="M3.5 17c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" /></svg>
                  Profile
                </button>
                <button
                  type="button"
                  className={`dd-nav-item ${activeTab === "history" ? "active" : ""}`}
                  onClick={() => setActiveTab("history")}
                >
                  <svg className="dd-nav-icon" viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="13" rx="2" /><path d="M7 2v4M13 2v4M3 9h14" /></svg>
                  Donation History
                </button>
              </div>
              <div className="dd-nav-divider" />
              <div className="dd-nav-section">
                {/* <button
                  type="button"
                  className="dd-nav-item dd-nav-danger"
                  onClick={() => { logout(); navigate(ROUTES.SIGNIN, { replace: true }); }}
                >
                  <svg className="dd-nav-icon" viewBox="0 0 20 20"><path d="M13.5 10.5l3-3-3-3M16.5 7.5H7" /><path d="M10 3.5H4.5A1.5 1.5 0 003 5v10a1.5 1.5 0 001.5 1.5H10" /></svg>
                  Sign out
                </button> */}
              </div>
            </nav>
            <div className="dd-sidebar-info">
              <div className="dd-sidebar-info-label">Status</div>
              <div className="dd-sidebar-badge">
                <span className="dd-sidebar-badge-dot" />
                Active donor member
              </div>
              {profile?.created_at && (
                <div className="dd-sidebar-meta">
                  Member since<br />
                  <span>{formatDate(profile.created_at)}</span>
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="dd-main">

            {/* ── Profile Tab ── */}
            {activeTab === "profile" && (
              <section>
                {isLoading && (
                  <div className="dd-loading">
                    <div className="dd-spinner" />
                    Loading your donor profile…
                  </div>
                )}

                {!isLoading && profileErrorMessage && (
                  <div className="dd-alert dd-alert-error">
                    {profileErrorMessage}
                    {!profile && (
                      <button type="button" onClick={fetchProfile} className="btn btn-secondary" style={{ marginTop: 12 }}>
                        Try again
                      </button>
                    )}
                  </div>
                )}

                {!isLoading && profileSuccessMessage && (
                  <div className="dd-alert dd-alert-success">{profileSuccessMessage}</div>
                )}

                {!isLoading && profile && (
                  <>
                    {/* Profile Banner */}
                    <div className="dd-profile-banner">
                      <div className="dd-profile-avatar">{initials[0]}</div>
                      <div className="dd-profile-banner-info">
                        <div className="dd-profile-banner-name">{formatValue(profile.full_name)}</div>
                        <div className="dd-profile-banner-meta">
                          {formatValue(profile.email, null)}
                          {profile.phone ? ` · ${profile.phone}` : ""}
                          {profile.nic ? ` · NIC: ${profile.nic}` : ""}
                        </div>
                      </div>
                      {!isEditing && (
                        <div className="flex-actions">
                          <button type="button" onClick={handleEditStart} className="btn btn-primary">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11.5 2.5a2.1 2.1 0 013 3L5 15l-4 1 1-4z" /></svg>
                            Edit profile
                          </button>
                          <button
                            type="button"
                            onClick={() => { setProfileSuccessMessage(""); setProfileErrorMessage(""); setShowDeleteConfirm(true); }}
                            className="btn btn-danger"
                          >
                            Delete profile
                          </button>
                        </div>
                      )}
                    </div>

                    {/* View Mode */}
                    {!isEditing && (
                      <>
                        <div className="dd-section-header" style={{ marginBottom: 16 }}>
                          <div>
                            <h2 className="dd-section-title">Profile details</h2>
                            <p className="dd-section-sub">Your personal information on file.</p>
                          </div>
                        </div>
                        <div className="dd-fields-grid">
                          <div className="dd-field-card">
                            <div className="dd-field-label">First name</div>
                            <div className={`dd-field-value ${!profile.first_name ? "empty" : ""}`}>
                              {formatValue(profile.first_name)}
                            </div>
                          </div>
                          <div className="dd-field-card">
                            <div className="dd-field-label">Last name</div>
                            <div className={`dd-field-value ${!profile.last_name ? "empty" : ""}`}>
                              {formatValue(profile.last_name)}
                            </div>
                          </div>
                          <div className="dd-field-card">
                            <div className="dd-field-label">Email address</div>
                            <div className={`dd-field-value ${!profile.email ? "empty" : ""}`}>
                              {formatValue(profile.email)}
                            </div>
                          </div>
                          <div className="dd-field-card">
                            <div className="dd-field-label">NIC number</div>
                            <div className={`dd-field-value ${!profile.nic ? "empty" : ""}`}>
                              {formatValue(profile.nic)}
                            </div>
                          </div>
                          <div className="dd-field-card">
                            <div className="dd-field-label">Phone number</div>
                            <div className={`dd-field-value ${!profile.phone ? "empty" : ""}`}>
                              {formatValue(profile.phone)}
                            </div>
                          </div>
                          <div className="dd-field-card">
                            <div className="dd-field-label">Member since</div>
                            <div className="dd-field-value">{formatDate(profile.created_at)}</div>
                          </div>
                          <div className="dd-field-card dd-field-card-full">
                            <div className="dd-field-label">Address</div>
                            <div className={`dd-field-value ${!profile.address ? "empty" : ""}`}>
                              {formatValue(profile.address)}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Edit Mode */}
                    {isEditing && (
                      <>
                        <div className="dd-section-header" style={{ marginBottom: 16 }}>
                          <div>
                            <h2 className="dd-section-title">Edit profile</h2>
                            <p className="dd-section-sub">Update your personal details below.</p>
                          </div>
                          <div className="editing-chip">Editing</div>
                        </div>
                        <form onSubmit={handleUpdateRequest} className="dd-edit-form">
                          {[
                            { label: "First name",   name: "first_name", type: "text" },
                            { label: "Last name",    name: "last_name",  type: "text" },
                            { label: "Email address", name: "email",     type: "email" },
                            { label: "NIC number",   name: "nic",        type: "text" },
                            { label: "Phone number", name: "phone",      type: "tel", placeholder: "07XXXXXXXX" },
                          ].map((f) => (
                            <div key={f.name}>
                              <label className="dd-field-label-edit">{f.label}</label>
                              <input
                                type={f.type}
                                name={f.name}
                                value={formData[f.name]}
                                onChange={handleInputChange}
                                placeholder={f.placeholder || ""}
                                className="dd-field-input"
                              />
                            </div>
                          ))}
                          <div className="dd-form-full">
                            <label className="dd-field-label-edit">Address</label>
                            <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" className="dd-field-input" />
                          </div>
                          <div className="dd-form-full flex-actions">
                            <button type="submit" className="btn btn-primary">Save changes</button>
                            <button type="button" onClick={handleEditCancel} className="btn btn-secondary">Cancel</button>
                          </div>
                        </form>
                      </>
                    )}
                  </>
                )}
              </section>
            )}

            {/* ── History Tab ── */}
            {activeTab === "history" && (
              <section>
                <div className="dd-section-header">
                  <div>
                    <h2 className="dd-section-title">Donation history</h2>
                    <p className="dd-section-sub">All donation requests you have submitted.</p>
                  </div>
                  <button type="button" onClick={fetchDonationHistory} className="btn btn-ghost btn-sm">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 8A6 6 0 112 8" /><path d="M14 8l-2-2M14 8l2-2" /></svg>
                    Refresh
                  </button>
                </div>

                {/* Filter pills */}
                <div className="dd-history-filters">
                  {[
                    { key: "all",      label: `All (${totalRequests})` },
                    { key: "pending",  label: `Pending (${pendingRequests})` },
                    { key: "approved", label: `Approved (${approvedRequests})` },
                    { key: "rejected", label: `Rejected (${rejectedRequests})` },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      className={`dd-filter-pill ${historyFilter === key ? "active" : ""}`}
                      onClick={() => setHistoryFilter(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {isHistoryLoading && (
                  <div className="dd-loading"><div className="dd-spinner" />Loading your donation history…</div>
                )}
                {!isHistoryLoading && historyErrorMessage && (
                  <div className="dd-alert dd-alert-error">{historyErrorMessage}</div>
                )}
                {!isHistoryLoading && !historyErrorMessage && historySuccessMessage && (
                  <div className="dd-alert dd-alert-success">{historySuccessMessage}</div>
                )}
                {!isHistoryLoading && !historyErrorMessage && filteredHistory.length === 0 && (
                  <div className="dd-empty">
                    <div className="dd-empty-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E5989B" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                    </div>
                    <p className="dd-empty-title">No donations tracked yet</p>
                    <p className="dd-empty-text">
                      When you submit a donation request it will appear here with its current review status.
                    </p>
                  </div>
                )}

                {!isHistoryLoading && !historyErrorMessage && filteredHistory.length > 0 &&
                  filteredHistory.map((entry) => {
                    const displayStatus  = getDisplayStatus(entry?.status);
                    const entryId        = getDonationEntryId(entry) || `${entry?.request_id}-${entry?.created_at}`;
                    const isExpanded     = expandedHistoryId === entryId;
                    const supportRequest = entry?.request_id && typeof entry.request_id === "object" ? entry.request_id : null;
                    const requestTitle   = supportRequest?.request_type || supportRequest?.title || "Support request";
                    const requestItems   = Array.isArray(supportRequest?.items) ? supportRequest.items : [];

                    return (
                      <div key={entryId} className="dd-donation-card">

                        {/* Card Header */}
                        <div className="dd-dc-header">
                          <div className="dd-dc-left">
                            <p className="dd-dc-eyebrow">Donation request</p>
                            <h3 className="dd-dc-title">{requestTitle}</h3>
                            <p className="dd-dc-desc">{formatValue(supportRequest?.description, "No description available.")}</p>
                          </div>
                          <div className="dd-dc-right">
                            <StatusBadge status={displayStatus} />
                            <button
                              type="button"
                              className="dd-toggle-btn"
                              onClick={() => setExpandedHistoryId(isExpanded ? null : entryId)}
                            >
                              {isExpanded ? "Hide details" : "View details"}
                            </button>
                          </div>
                        </div>

                        {/* Meta Strip */}
                        <div className="dd-dc-meta">
                          <div className="dd-dc-stat">
                            <div className="dd-dc-stat-label">Submitted</div>
                            <div className="dd-dc-stat-value">{formatDate(entry?.created_at)}</div>
                          </div>
                          <div className="dd-dc-stat">
                            <div className="dd-dc-stat-label">Items</div>
                            <div className="dd-dc-stat-value">{requestItems.length} item{requestItems.length === 1 ? "" : "s"}</div>
                          </div>
                          <div className="dd-dc-stat">
                            <div className="dd-dc-stat-label">Reference</div>
                            <div className={`dd-dc-stat-value ${!entry?.reference_code ? "empty" : ""}`}>
                              {formatValue(entry?.reference_code, "Pending")}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="dd-dc-expanded">
                            {/* Items */}
                            <div className="dd-detail-block dd-detail-block-full">
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <p className="dd-detail-block-label" style={{ marginBottom: 0 }}>Requested items</p>
                                <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>
                                  {requestItems.length} item{requestItems.length === 1 ? "" : "s"}
                                </span>
                              </div>
                              {requestItems.length > 0 ? (
                                <ul className="dd-items-list">
                                  {requestItems.map((item, idx) => (
                                    <li key={`${entryId}-item-${idx}`} className="dd-item-row">
                                      <p className="dd-item-name">{formatValue(item?.item_name, "Unnamed item")}</p>
                                      <div className="dd-item-tags">
                                        <span className="dd-item-tag">Qty: <span>{formatValue(item?.quantity, "N/A")} {item?.unit || ""}</span></span>
                                        <span className="dd-item-tag">Est. <span>Rs. {formatValue(item?.estimated_value, "N/A")}</span></span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="dd-detail-text">No item list was provided for this support request.</p>
                              )}
                            </div>

                            {/* Submission details */}
                            <div className="dd-detail-block">
                              <p className="dd-detail-block-label">Submission details</p>
                              <table className="dd-detail-table">
                                <tbody>
                                  {[
                                    ["Submitted on",   formatDate(entry?.created_at)],
                                    ["Phone number",   formatValue(entry?.phone, null)],
                                    ["Reference code", formatValue(entry?.reference_code, null)],
                                    ["Reviewed at",    entry?.accepted_at ? formatDate(entry.accepted_at) : null],
                                  ].map(([k, v]) => (
                                    <tr key={k}>
                                      <td className="dk">{k}</td>
                                      <td className={`dv ${!v ? "empty" : ""}`}>{v || "Not available"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Message */}
                            <div className="dd-detail-block">
                              <p className="dd-detail-block-label">Your message</p>
                              <p className="dd-detail-text">{formatValue(entry?.message, "No message was added.")}</p>
                            </div>
                          </div>
                        )}

                        {/* Pending actions */}
                        {entry?.status === "pending" && (
                          <div className="dd-entry-actions">
                            <button type="button" onClick={() => handleDonationEditStart(entry)} className="btn btn-primary btn-sm">
                              Update request
                            </button>
                            <button type="button" onClick={() => handleDonationDeleteStart(entry)} className="btn btn-danger btn-sm">
                              Delete request
                            </button>
                          </div>
                        )}

                        {/* Approved actions */}
                        {entry?.status === "accepted" && (
                          <div className="dd-entry-actions">
                            <button type="button" onClick={() => generateDonationSummary(entry, profile)} className="btn btn-primary btn-sm">
                              Download
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                }
              </section>
            )}
          </main>
        </div>
      </div>

      {/* ── Modals ── */}
      {showUpdateConfirm && (
        <ConfirmModal
          title="Save profile changes?"
          message="Your donor profile will be updated with the values currently entered in the form."
          confirmLabel="Confirm update"
          onConfirm={handleConfirmedUpdate}
          onCancel={() => setShowUpdateConfirm(false)}
          isProcessing={isSaving}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete donor profile?"
          message="This will permanently remove your donor profile and account. You will be signed out immediately after deletion."
          confirmLabel="Delete permanently"
          confirmDanger
          onConfirm={handleConfirmedDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isProcessing={isDeleting}
        />
      )}

      {showDonationEditModal && (
        <DonationRequestModal
          formData={donationFormData}
          onChange={handleDonationFormChange}
          onClose={handleDonationEditClose}
          onSubmit={handleDonationUpdate}
          isProcessing={isDonationSaving}
        />
      )}

      {showDonationDeleteConfirm && (
        <ConfirmModal
          title="Delete this donation request?"
          message="This action is only available while the request is pending. Once deleted, it will be removed from your donation history."
          confirmLabel="Delete request"
          confirmDanger
          onConfirm={handleDonationDeleteConfirm}
          onCancel={handleDonationDeleteCancel}
          isProcessing={isDonationDeleting}
        />
      )}
    </>
  );
};

export default DonorDashboard;
