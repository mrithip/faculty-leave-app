import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 px-6 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} Sri Shakthi Institute of Engineering and Technology. All rights reserved.</p>
      <p>Contact: info@siet.com | Phone: +91 12345 67890</p>
    </footer>
  );
}

export default Footer;
