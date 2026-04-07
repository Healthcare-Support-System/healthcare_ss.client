import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-10">
      <div
        className="w-full backdrop-blur-md border-t"
        style={{
          background: "rgba(94, 84, 142, 0.95)",
          borderColor: "#B5838D",
        }}
      >
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-3 text-white">HopeCare</h2>
            <p className="text-sm leading-relaxed" style={{ color: "#F0E5E8" }}>
              Supporting cancer patients at Apeksha Hospital, Sri Lanka through
              a centralized donor management system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="transition duration-300 hover:translate-x-1 inline-block"
                  style={{ color: "#F0E5E8" }}
                  onMouseEnter={(e) => (e.target.style.color = "#E5989B")}
                  onMouseLeave={(e) => (e.target.style.color = "#F0E5E8")}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/donate"
                  className="transition duration-300 hover:translate-x-1 inline-block"
                  style={{ color: "#F0E5E8" }}
                  onMouseEnter={(e) => (e.target.style.color = "#E5989B")}
                  onMouseLeave={(e) => (e.target.style.color = "#F0E5E8")}
                >
                  Donations
                </Link>
              </li>
              <li>
                <Link
                  to="/awareness"
                  className="transition duration-300 hover:translate-x-1 inline-block"
                  style={{ color: "#F0E5E8" }}
                  onMouseEnter={(e) => (e.target.style.color = "#E5989B")}
                  onMouseLeave={(e) => (e.target.style.color = "#F0E5E8")}
                >
                  Patients
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="transition duration-300 hover:translate-x-1 inline-block"
                  style={{ color: "#F0E5E8" }}
                  onMouseEnter={(e) => (e.target.style.color = "#E5989B")}
                  onMouseLeave={(e) => (e.target.style.color = "#F0E5E8")}
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-white">Contact</h3>
            <div className="space-y-3 text-sm" style={{ color: "#F0E5E8" }}>
              <p className="flex items-center gap-3">
                <span
                  className="p-2 rounded-full"
                  style={{ backgroundColor: "rgba(229, 152, 155, 0.18)" }}
                >
                  <FaPhoneAlt />
                </span>
                +94 77 123 4567
              </p>
              <p className="flex items-center gap-3">
                <span
                  className="p-2 rounded-full"
                  style={{ backgroundColor: "rgba(229, 152, 155, 0.18)" }}
                >
                  <FaEnvelope />
                </span>
                support@hopecare.lk
              </p>
              <p className="flex items-center gap-3">
                <span
                  className="p-2 rounded-full"
                  style={{ backgroundColor: "rgba(229, 152, 155, 0.18)" }}
                >
                  <FaMapMarkerAlt />
                </span>
                Maharagama, Sri Lanka
              </p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-white">
              Follow Us
            </h3>
            <div className="flex gap-3 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition duration-300 hover:scale-110"
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                  color: "#F0E5E8",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E5989B";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "#F0E5E8";
                }}
              >
                <FaFacebook />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition duration-300 hover:scale-110"
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                  color: "#F0E5E8",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E5989B";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "#F0E5E8";
                }}
              >
                <FaInstagram />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition duration-300 hover:scale-110"
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                  color: "#F0E5E8",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E5989B";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "#F0E5E8";
                }}
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="w-full text-center py-4 text-xs"
          style={{
            borderTop: "1px solid rgba(240, 229, 232, 0.25)",
            color: "#F0E5E8",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          © {new Date().getFullYear()} HopeCare Donation System. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;