import React from 'react';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#0a0b1e] via-[#162542] to-[#420515] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between mt-5 gap-x-8">
        {/* Logo & Description */}
        <div className="w-full md:basis-[22%] flex-grow md:mr-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            ✂️<span className="ml-1">tyle</span>
          </h2>
          <p className="text-sm text-gray-300">
            Subscribe Easy Tutorials YouTube channel to watch more videos on website development and press the bell icon to get immediate notification of latest videos.
          </p>
        </div>

        {/* Office Info */}
        <div className="w-full md:basis-[22%] flex-grow">
          <h4 className="text-xl font-semibold mb-4 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-12 after:h-[2px] after:bg-white">
            Office
          </h4>
          <p className="text-sm text-gray-300 leading-6">
            ITPL Road<br />
            Whitefield, Bangalore<br />
            Karnataka, PIN 560066, India
          </p>
          <p className="mt-2 text-sm text-gray-300">avinashdm@outlook.com</p>
          <p className="text-sm text-gray-300">+91 - 0123456789</p>
        </div>

        {/* Links */}
        <div className="w-full md:basis-[22%] flex-grow">
          <h4 className="text-xl font-semibold mb-4 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-12 after:h-[2px] after:bg-white">
            Links
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#">Home</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Contacts</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="w-full md:basis-[22%] ">
          <h4 className="text-xl font-semibold mb-4 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-12 after:h-[2px] after:bg-white">
            Newsletter
          </h4>
          <form className="flex border-b border-gray-500">
            <input
              type="email"
              placeholder="Enter your email id"
              className="bg-transparent text-white p-2 outline-none w-full"
            />
            <button type="submit" className="text-white text-xl">➔</button>
          </form>
          <div className="flex space-x-4 mt-4 text-xl">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaWhatsapp /></a>
            <a href="#"><FaPinterest /></a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t border-white-700 pt-4 text-center text-sm text-gray-400">
        Easy Tutorials © 2021 – All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
