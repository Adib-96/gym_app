"use client"
import { useRouter } from 'next/navigation'

import Image from "next/image"
import Link from "next/link"
const Navbar = () => {
  const router = useRouter(); 

  return (
    <div className="fixed top-0 left-0 w-full z-50">
    <div className="backdrop-blur-md bg-transparent flex justify-evenly w-full mx-auto  items-center h-24">
        {/* LOGO */}
        <div className='w-30'>
          <Link href="/">
            <Image src="/images/lg.png" alt="logo" width={150} height={150} />
          </Link>
        </div>
        {/* Links */}
        <div className="hidden md:flex gap-6 text-white">
          <Link href="/#Testimonials" className="p-2 font-light">Testimonials</Link>
          <Link href="/#how-it-works" className="p-2 font-light">How it work</Link>
          <Link href="/#FAQ" className="p-2 font-light">FAQ</Link>
        </div>

        {/* register - sign in */}
        <div className="flex gap-3 p-2">
            <button
    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
    onClick={() => router.push('/register')}
  >
    Register
  </button>

  <button
    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
    onClick={() => router.push('/signin')}
  >
    Sign In
  </button>
        </div>
    </div>
    </div>

  )
}

export default Navbar




