import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="w-full bg-gradient-to-b from-[#1B004D] to-[#2E0A6F] text-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    {/* Logo and Description */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                            <Image alt="GymTracker Logo" width={32} height={32} src="/images/lg.png" className="w-8 h-8 sm:w-10 sm:h-10" />
                            <span className="text-lg sm:text-xl font-bold">GymTracker</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md">
                            Transform your fitness journey with personalized workouts, expert coaching, and comprehensive progress tracking. Join thousands of users achieving their goals.
                        </p>
                        {/* Social Media Links */}
                        <div className="flex space-x-3 sm:space-x-4 mt-4 sm:mt-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaTwitter className="h-4 w-4 sm:h-5 sm:w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaInstagram className="h-4 w-4 sm:h-5 sm:w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaYoutube className="h-4 w-4 sm:h-5 sm:w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
                        <ul className="space-y-1.5 sm:space-y-2">
                            <li><Link href="#features" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Features</Link></li>
                            <li><Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">How It Works</Link></li>
                            <li><Link href="#Testimonials" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Testimonials</Link></li>
                            <li><Link href="#FAQ" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h3>
                        <ul className="space-y-1.5 sm:space-y-2">
                            <li><Link href="/auth/forgot-password" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Reset Password</Link></li>
                            <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Contact Us</Link></li>
                            <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="border-t border-[#3B1A7A] pt-6 sm:pt-8 pb-6">
                    <div className="max-w-md mx-auto text-center">
                        <h4 className="text-base sm:text-lg font-semibold mb-2">Stay Updated</h4>
                        <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">Get the latest fitness tips and app updates</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-3 sm:px-4 py-2 bg-white/10 border border-gray-600 rounded-lg sm:rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 text-sm"
                            />
                            <button className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg sm:rounded-r-lg transition-colors font-medium text-sm sm:text-base whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#3B1A7A]">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-400 gap-2 sm:gap-0">
                    <p>Made with ❤️ © 2025 GymTracker. All rights reserved.</p>
                    <div className="flex space-x-4 sm:space-x-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};