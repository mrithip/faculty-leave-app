import React from 'react';

function TopBanner() {
  return (
    <div className="bg-white py-4 px-6 flex items-center justify-between">
      {/* Left Section: Institute Logo */}
      <div className="flex items-center">
        <img src="/image.png" alt="Institute Logo" className="h-16" />
        <img src="/naac-logo.png" alt="NAAC Logo" className="h-16 ml-3" />
      </div>

      {/* Center Section: SRI SHAKTHI text and address */}
      <div className="flex-grow text-center">
        <h1 className="text-green-700 text-4xl font-bold">SRI SHAKTHI</h1>
        <p className="text-gray-700 text-sm">INSTITUTE OF ENGINEERING AND TECHNOLOGY</p>
        <p className="text-gray-600 text-xs">Approved by AICTE, New Delhi ■ Accredited by NBA ■ Affiliated to ANNA UNIVERSITY, Chennai</p>
      </div>

      {/* Right Section: NAAC/NBA logos and Counseling Code */}
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <img src="/nba-logo.png" alt="NBA Logo" className="h-12" />
        </div>
        <div className="text-right">
          <p className="text-gray-700 text-sm">Counseling Code</p>
          <p className="text-green-700 text-4xl font-bold">2727</p>
        </div>
      </div>
    </div>
  );
}

export default TopBanner;
