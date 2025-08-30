import React from 'react';

function TopBanner() {
  return (
    <div className="bg-white py-5 px-8 flex items-center justify-between shadow-md">
      {/* Left Section: Institute Logo */}
      <div className="flex items-center space-x-4">
        <img src="/image.png" alt="Institute Logo" className="h-16" />
        <img src="/naac-logo.png" alt="NAAC Logo" className="h-16" />
      </div>

      {/* Center Section: SRI SHAKTHI text and address */}
      <div className="flex-grow text-center">
        <h1 className="text-green-800 text-5xl font-extrabold tracking-tight">SRI SHAKTHI</h1>
        <p className="text-gray-700 text-base mt-1">INSTITUTE OF ENGINEERING AND TECHNOLOGY</p>
        <p className="text-gray-600 text-sm mt-0.5">Approved by AICTE, New Delhi ■ Accredited by NBA ■ Affiliated to ANNA UNIVERSITY, Chennai</p>
      </div>

      {/* Right Section: NBA logo and Counseling Code */}
      <div className="flex items-center space-x-4">
        <img src="/nba-logo.png" alt="NBA Logo" className="h-14" />
        <div className="text-right">
          <p className="text-gray-700 text-base">Counseling Code</p>
          <p className="text-green-800 text-5xl font-extrabold tracking-tight">2727</p>
        </div>
      </div>
    </div>
  );
}

export default TopBanner;
