import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="w-full bg-gradient-to-b from-[#1B004D] to-[#2E0A6F] text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Logo and Description */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <Image alt="GymTracker Logo" width={40} height={40} src="/images/lg.png" />
                            <span className="text-xl font-bold">GymTracker</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                            Transform your fitness journey with personalized workouts, expert coaching, and comprehensive progress tracking. Join thousands of users achieving their goals.
                        </p>
                        {/* Social Media Links */}
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaFacebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaTwitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaInstagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaYoutube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link></li>
                            <li><Link href="#Testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</Link></li>
                            <li><Link href="#FAQ" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><Link href="/auth/forgot-password" className="text-gray-300 hover:text-white transition-colors">Reset Password</Link></li>
                            <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="border-t border-[#3B1A7A] pt-8 pb-6">
                    <div className="max-w-md mx-auto text-center">
                        <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
                        <p className="text-gray-300 text-sm mb-4">Get the latest fitness tips and app updates</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                            />
                            <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-r-lg transition-colors font-medium">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#3B1A7A]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>Made with ❤️ © 2025 GymTracker. All rights reserved.</p>
                    <div className="flex space-x-6 mt-2 md:mt-0">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};