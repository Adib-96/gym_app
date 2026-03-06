"use client"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import Image from "next/image"
import Link from "next/link"
import { FaBars, FaTimes } from 'react-icons/fa'

interface NavbarProps {
  alwaysOpaque?: boolean;
}

const Navbar = ({ alwaysOpaque = false }: NavbarProps) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if navbar should have opaque background
  const shouldBeOpaque = alwaysOpaque || isScrolled;

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className={`transition-all duration-300 ${shouldBeOpaque ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent backdrop-blur-md'} flex justify-between md:justify-evenly w-full mx-auto items-center h-20 md:h-24 px-4 md:px-6`}>
        {/* LOGO */}
        <div className='w-24 md:w-30 flex-shrink-0'>
          <Link href="/">
            <Image src="/images/lg.png" alt="logo" width={100} height={100} className="w-full h-auto" />
          </Link>
        </div>
        
        {/* Desktop Links */}
        <div className={`hidden md:flex gap-6 ${shouldBeOpaque ? 'text-gray-800' : 'text-white'}`}>
          <button onClick={() => handleNavClick('#Testimonials')} className="p-2 font-light hover:text-indigo-600 transition-colors text-sm">Testimonials</button>
          <button onClick={() => handleNavClick('#how-it-works')} className="p-2 font-light hover:text-indigo-600 transition-colors text-sm">How it work</button>
          <button onClick={() => handleNavClick('#FAQ')} className="p-2 font-light hover:text-indigo-600 transition-colors text-sm">FAQ</button>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3 p-2">
          <button
            className={`font-medium px-4 py-2 rounded-full border-2 transition-all duration-300 ease-in-out transform hover:scale-105 text-sm ${
              shouldBeOpaque
                ? 'border-indigo-500 text-indigo-600 bg-transparent hover:bg-indigo-50'
                : 'border-white text-white bg-transparent hover:bg-white hover:text-gray-800'
            }`}
            onClick={() => router.push('/auth/register')}
          >
            Register
          </button>

          <button
            className={`font-medium px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 text-sm ${
              shouldBeOpaque
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-indigo-600'
                : 'bg-white hover:bg-gray-100 text-indigo-600 border-2 border-white'
            }`}
            onClick={() => router.push('/auth/signin')}
          >
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 ${shouldBeOpaque ? 'text-gray-800' : 'text-white'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden ${shouldBeOpaque ? 'bg-white/95' : 'bg-gray-900/95'} backdrop-blur-md border-t ${shouldBeOpaque ? 'border-gray-200' : 'border-gray-700'}`}>
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => handleNavClick('#Testimonials')}
              className={`block w-full text-left p-3 rounded-lg transition-colors ${shouldBeOpaque ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}
            >
              Testimonials
            </button>
            <button
              onClick={() => handleNavClick('#how-it-works')}
              className={`block w-full text-left p-3 rounded-lg transition-colors ${shouldBeOpaque ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}
            >
              How it works
            </button>
            <button
              onClick={() => handleNavClick('#FAQ')}
              className={`block w-full text-left p-3 rounded-lg transition-colors ${shouldBeOpaque ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}
            >
              FAQ
            </button>
            <div className="border-t pt-3 space-y-2">
              <button
                className={`w-full font-medium px-4 py-2 rounded-full border-2 transition-all ${
                  shouldBeOpaque
                    ? 'border-indigo-500 text-indigo-600 bg-transparent'
                    : 'border-white text-white bg-transparent'
                }`}
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/auth/register');
                }}
              >
                Register
              </button>
              <button
                className={`w-full font-medium px-4 py-2 rounded-full transition-all ${
                  shouldBeOpaque
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-indigo-600'
                }`}
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/auth/signin');
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar




