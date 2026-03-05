import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
            <Navbar alwaysOpaque={true} />

            <main className="pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Cookie Policy
                        </h1>
                        <p className="text-lg text-gray-600">
                            Last updated: March 6, 2025
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Cookies are small text files that are stored on your device when you visit our website or use our mobile application. They help us provide you with a better experience by remembering your preferences and understanding how you use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
                            <p className="text-gray-700 mb-4">We use cookies for the following purposes:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our service</li>
                                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
                            <div className="space-y-6">
                                <div className="border-l-4 border-indigo-500 pl-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Session Cookies</h3>
                                    <p className="text-gray-700">Temporary cookies that expire when you close your browser. Used to maintain your session and remember your login status.</p>
                                </div>

                                <div className="border-l-4 border-green-500 pl-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Persistent Cookies</h3>
                                    <p className="text-gray-700">Remain on your device for a set period or until you delete them. Used to remember your preferences and provide personalized experiences.</p>
                                </div>

                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Third-Party Cookies</h3>
                                    <p className="text-gray-700">Set by third-party services we use, such as analytics providers or social media platforms. These help us improve our services and provide social features.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Managing Your Cookie Preferences</h2>
                            <p className="text-gray-700 mb-4">You have several options to manage cookies:</p>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Browser Settings</h3>
                                <p className="text-gray-700 mb-3">Most web browsers allow you to control cookies through their settings preferences. You can:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Block all cookies</li>
                                    <li>Block third-party cookies</li>
                                    <li>Delete existing cookies</li>
                                    <li>Receive notifications when cookies are set</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg mt-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Our Cookie Settings</h3>
                                <p className="text-gray-700">
                                    You can manage your cookie preferences directly through our application settings. Access the privacy settings in your account dashboard to customize your cookie choices.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Impact of Disabling Cookies</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Please note that disabling certain cookies may affect the functionality of our service. Essential cookies are required for basic features to work properly. Disabling analytics or functional cookies may result in a less personalized experience.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
                            <p className="text-gray-700 mb-4">We use the following third-party services that may set cookies:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Google Analytics:</strong> For website analytics and user behavior insights</li>
                                <li><strong>Firebase:</strong> For app performance monitoring and crash reporting</li>
                                <li><strong>Social Media Platforms:</strong> For social sharing and login functionality</li>
                                <li><strong>Payment Processors:</strong> For secure payment processing</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Updates to This Policy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes via email or through our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                                <p className="text-gray-700">
                                    <strong>Email:</strong> privacy@gymtracker.com<br />
                                    <strong>Subject:</strong> Cookie Policy Inquiry
                                </p>
                            </div>
                        </section>

                        {/* Cookie Consent Banner Preview */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookie Consent</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                When you first visit our website or use our app, you'll see a cookie consent banner that allows you to accept or customize your cookie preferences. Your choices will be saved and respected throughout your browsing session.
                            </p>

                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Cookie Consent Banner Preview</h3>
                                <div className="bg-white border rounded-lg p-4 shadow-sm">
                                    <p className="text-sm text-gray-700 mb-3">
                                        We use cookies to enhance your experience. By continuing to use our site, you agree to our use of cookies.
                                    </p>
                                    <div className="flex space-x-3">
                                        <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium">
                                            Accept All
                                        </button>
                                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium">
                                            Customize
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}