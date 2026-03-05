import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
            <Navbar alwaysOpaque={true} />

            <main className="pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-gray-600">
                            Last updated: March 6, 2025
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Welcome to GymTracker ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our fitness tracking application and services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Name, email address, and password</li>
                                    <li>Profile information (age, gender, fitness goals)</li>
                                    <li>Payment information (processed securely by third-party providers)</li>
                                    <li>Communication preferences</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gray-800">Fitness Data</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Workout logs and exercise data</li>
                                    <li>Progress measurements and photos</li>
                                    <li>Health metrics and performance statistics</li>
                                    <li>Device and app usage data</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gray-800">Technical Information</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>IP address and location data</li>
                                    <li>Device information and browser type</li>
                                    <li>Usage patterns and app interactions</li>
                                    <li>Cookies and similar technologies</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-700 mb-4">We use your information to:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Provide and maintain our fitness tracking services</li>
                                <li>Personalize your workout plans and recommendations</li>
                                <li>Track your progress and provide insights</li>
                                <li>Communicate with you about your account and services</li>
                                <li>Process payments and manage subscriptions</li>
                                <li>Improve our app and develop new features</li>
                                <li>Ensure security and prevent fraud</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                            <p className="text-gray-700 mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>With your consent:</strong> When you explicitly agree to share data</li>
                                <li><strong>Service providers:</strong> Trusted third parties who help us operate our services</li>
                                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale</li>
                                <li><strong>Coach-Client relationships:</strong> Coaches can view client data as authorized</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments. However, no method of transmission over the internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
                            <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                                <li><strong>Restriction:</strong> Limit how we process your data</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie preferences through your browser settings, though this may affect app functionality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through our app. Your continued use of our services after such changes constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have any questions about this Privacy Policy or our data practices, please contact us at:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                                <p className="text-gray-700">
                                    <strong>Email:</strong> privacy@gymtracker.com<br />
                                    <strong>Address:</strong> 123 Fitness Street, Workout City, WC 12345, United States
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}