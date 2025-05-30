import React from 'react';
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaHeadset } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className='border-t'>
      <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between items-center gap-2'>
        <p>© Veerbhadra Pandey • All Rights Reserved 2024.</p>

        <div className='flex items-center gap-4 justify-center text-2xl'>
          <a 
            href='https://github.com/Veerbhadra2006' 
            aria-label='GitHub Profile' 
            target='_blank' 
            rel='noopener noreferrer' 
            className='hover:text-primary-100'
          >
            <FaGithub/>
          </a>
          <a 
            href='https://www.instagram.com/veerbhadra2006/?hl=en' 
            aria-label='Instagram Profile' 
            target='_blank' 
            rel='noopener noreferrer' 
            className='hover:text-primary-100'
          >
            <FaInstagram/>
          </a>
          <a 
            href='https://www.linkedin.com/in/veerbhadrapandey' 
            aria-label='LinkedIn Profile' 
            target='_blank' 
            rel='noopener noreferrer' 
            className='hover:text-primary-100'
          >
            <FaLinkedin/>
          </a>

          {/* Customer Support Link */}
          <a 
            href='/support' 
            aria-label='Customer Support' 
            className='flex items-center gap-1 hover:text-primary-100 text-lg'
          >
            <FaHeadset /> <span className='hidden sm:inline'>Support</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
