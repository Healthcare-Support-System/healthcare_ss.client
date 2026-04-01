import React from "react";

const Footer = () => {
  return (
    <footer className="bg-purple-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-purple-800">
        <p className="font-semibold">HopeCare Donation Platform</p>
        <p className="text-sm mt-2">
          Supporting cancer patients at Apeksha Hospital, Sri Lanka
        </p>
        <p className="text-xs mt-3">
          © {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
