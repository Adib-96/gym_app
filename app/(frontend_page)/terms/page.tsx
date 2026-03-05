import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
            <Navbar alwaysOpaque={true} />

            <main className="pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-gray-600">
                            Last updated: March 6, 2025
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                By accessing and using GymTracker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                            <p className="text-gray-700 leading-relaxed">
                                GymTracker is a comprehensive fitness tracking platform that provides workout logging, progress tracking, coaching services, and fitness management tools. Our services include mobile and web applications, data analytics, and personalized fitness recommendations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-800">Account Creation</h3>
                                <p className="text-gray-700">
                                    To use our services, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-800">Account Types</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li><strong>Client:</strong> Access to personal workout tracking and basic features</li>
                                    <li><strong>Coach:</strong> Additional tools for managing clients and creating workout plans</li>
                                    <li><strong>Admin:</strong> Administrative access for gym management</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
                            <p className="text-gray-700 mb-4">You agree to:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Provide accurate and truthful information</li>
                                <li>Use the service only for lawful purposes</li>
                                <li>Not share your account credentials with others</li>
                                <li>Not attempt to reverse engineer or hack the service</li>
                                <li>Respect the privacy and rights of other users</li>
                                <li>Not upload harmful or inappropriate content</li>
                                <li>Follow all applicable laws and regulations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Subscription and Payment</h2>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-800">Subscription Plans</h3>
                                <p className="text-gray-700">
                                    We offer various subscription plans with different features and pricing. Subscription fees are billed in advance and are non-refundable except as required by law.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-800">Payment Terms</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>All fees are exclusive of applicable taxes</li>
                                    <li>Payment is due at the beginning of each billing cycle</li>
                                    <li>Failed payments may result in service suspension</li>
                                    <li>Price changes will be communicated 30 days in advance</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                            <p className="text-gray-700 leading-relaxed">
                                The Service and its original content, features, and functionality are owned by GymTracker and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. User-Generated Content</h2>
                            <p className="text-gray-700 leading-relaxed">
                                You retain ownership of content you create and upload to the Service. By uploading content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content in connection with the Service. You are responsible for ensuring you have the right to grant this license.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our Service, you consent to the collection and use of your information as outlined in our Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Service Availability</h2>
                            <p className="text-gray-700 leading-relaxed">
                                While we strive for high availability, we do not guarantee that the Service will be uninterrupted or error-free. We reserve the right to modify, suspend, or discontinue the Service with reasonable notice. We are not liable for any damages resulting from service interruptions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed">
                                To the maximum extent permitted by law, GymTracker shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
                            <p className="text-gray-700 leading-relaxed">
                                You agree to indemnify and hold harmless GymTracker and its affiliates from any claims, damages, losses, or expenses arising from your use of the Service, violation of these Terms, or infringement of any rights of another party.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may terminate or suspend your account immediately for violations of these Terms. Upon termination, your right to use the Service ceases immediately. Sections that by their nature should survive termination will remain in effect.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
                            <p className="text-gray-700 leading-relaxed">
                                These Terms are governed by and construed in accordance with the laws of the United States, without regard to its conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of [Your Jurisdiction].
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Your continued use of the Service after such changes constitutes acceptance of the modified Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have any questions about these Terms, please contact us at:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                                <p className="text-gray-700">
                                    <strong>Email:</strong> legal@gymtracker.com<br />
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