import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 px-8 text-center text-sm border-t border-gray-700">
      <div className="space-y-1">
        <p>&copy; {new Date().getFullYear()} Sri Shakthi Institute of Engineering and Technology. All rights reserved.</p>
        <p>Contact: <a href="mailto:info@siet.com" className="text-blue-300 hover:underline">info@siet.com</a> | Phone: +91 12345 67890</p>
      </div>
    </footer>
  );
}

export default Footer;
