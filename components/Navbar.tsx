"use client"
import { useRouter } from 'next/navigation'

import Image from "next/image"
import Link from "next/link"
const Navbar = () => {
  const router = useRouter(); 

  return (
    <div className="flex justify-around max-w-7xl mx-auto md:justify-between items-center h-30">
        {/* LOGO */}
        <div className='w-30'>
          <Link href="/">
            <Image src="/images/logo.png" alt="logo" width={150} height={150} />
          </Link>
        </div>
        {/* Links */}
        <div className="hidden md:flex gap-6">
          <Link href="/#Testimonials" className="p-2 font-semibold">Testimonials</Link>
          <Link href="/#how-it-works" className="p-2 font-semibold">How it work</Link>
          <Link href="/#FAQ" className="p-2 font-semibold">FAQ</Link>
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
  )
}

export default Navbar