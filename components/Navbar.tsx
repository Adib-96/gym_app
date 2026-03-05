"use client"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import Image from "next/image"
import Link from "next/link"

interface NavbarProps {
  alwaysOpaque?: boolean;
}

const Navbar = ({ alwaysOpaque = false }: NavbarProps) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if navbar should have opaque background
  const shouldBeOpaque = alwaysOpaque || isScrolled;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className={`transition-all duration-300 ${shouldBeOpaque ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent backdrop-blur-md'} flex justify-evenly w-full mx-auto items-center h-24`}>
        {/* LOGO */}
        <div className='w-30'>
          <Link href="/">
            <Image src="/images/lg.png" alt="logo" width={150} height={150} />
          </Link>
        </div>
        {/* Links */}
        <div className={`hidden md:flex gap-6 ${shouldBeOpaque ? 'text-gray-800' : 'text-white'}`}>
          <Link href="/#Testimonials" className="p-2 font-light hover:text-indigo-600 transition-colors">Testimonials</Link>
          <Link href="/#how-it-works" className="p-2 font-light hover:text-indigo-600 transition-colors">How it work</Link>
          <Link href="/#FAQ" className="p-2 font-light hover:text-indigo-600 transition-colors">FAQ</Link>
        </div>

        {/* register - sign in */}
        <div className="flex gap-3 p-2">
          <button
            className={`font-medium px-4 py-2 rounded-full border-2 transition-all duration-300 ease-in-out transform hover:scale-105 ${
              shouldBeOpaque
                ? 'border-indigo-500 text-indigo-600 bg-transparent hover:bg-indigo-50'
                : 'border-white text-white bg-transparent hover:bg-white hover:text-gray-800'
            }`}
            onClick={() => router.push('/auth/register')}
          >
            Register
          </button>

          <button
            className={`font-medium px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 ${
              shouldBeOpaque
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-indigo-600'
                : 'bg-white hover:bg-gray-100 text-indigo-600 border-2 border-white'
            }`}
            onClick={() => router.push('/auth/signin')}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>

  )
}

export default Navbar




