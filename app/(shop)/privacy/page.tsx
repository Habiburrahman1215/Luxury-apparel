export const metadata = {
    title: 'Privacy Policy',
    description: 'Learn how Luxury Apparel collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen section-padding">
            <div className="container-luxury max-w-4xl">
                <h1 className="font-serif text-4xl md:text-5xl mb-4">Privacy Policy</h1>
                <p className="text-soft-gray mb-12">Last updated: December 2024</p>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="font-serif text-3xl mb-4">Introduction</h2>
                        <p className="text-soft-gray leading-relaxed">
                            At Luxury Apparel, we are committed to protecting your privacy and ensuring
                            the security of your personal information. This Privacy Policy explains how
                            we collect, use, disclose, and safeguard your information when you visit our
                            website or make a purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Information We Collect</h2>
                        <h3 className="font-medium text-xl mb-3">Personal Information</h3>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            We collect information that you provide directly to us, including:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2 mb-6">
                            <li>Name, email address, and contact information</li>
                            <li>Shipping and billing addresses</li>
                            <li>Payment information (processed securely through our payment providers)</li>
                            <li>Account credentials</li>
                            <li>Purchase history and preferences</li>
                            <li>Communication preferences</li>
                        </ul>

                        <h3 className="font-medium text-xl mb-3">Automatically Collected Information</h3>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            When you visit our website, we automatically collect certain information:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2">
                            <li>Browser type and version</li>
                            <li>Operating system</li>
                            <li>IP address</li>
                            <li>Pages visited and time spent on pages</li>
                            <li>Referring website</li>
                            <li>Device information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">How We Use Your Information</h2>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2">
                            <li>Process and fulfill your orders</li>
                            <li>Communicate with you about your purchases</li>
                            <li>Send you marketing communications (with your consent)</li>
                            <li>Improve our website and customer experience</li>
                            <li>Prevent fraud and enhance security</li>
                            <li>Comply with legal obligations</li>
                            <li>Provide customer support</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Information Sharing</h2>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            We do not sell your personal information. We may share your information with:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2">
                            <li>Service providers who assist with order fulfillment, payment processing, and shipping</li>
                            <li>Marketing partners (only with your explicit consent)</li>
                            <li>Law enforcement when required by law</li>
                            <li>Business successors in the event of a merger or acquisition</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Cookies and Tracking</h2>
                        <p className="text-soft-gray leading-relaxed">
                            We use cookies and similar tracking technologies to enhance your browsing
                            experience, analyze website traffic, and personalize content. You can control
                            cookie preferences through your browser settings. For more information, please
                            see our Cookie Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Your Rights</h2>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2">
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of inaccurate information</li>
                            <li>Request deletion of your personal information</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Object to certain processing of your information</li>
                            <li>Request data portability</li>
                        </ul>
                        <p className="text-soft-gray leading-relaxed mt-4">
                            To exercise these rights, please contact us at privacy@luxuryapparel.com
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Data Security</h2>
                        <p className="text-soft-gray leading-relaxed">
                            We implement appropriate technical and organizational measures to protect your
                            personal information against unauthorized access, alteration, disclosure, or
                            destruction. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Children's Privacy</h2>
                        <p className="text-soft-gray leading-relaxed">
                            Our website is not intended for children under 13 years of age. We do not
                            knowingly collect personal information from children under 13.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Changes to This Policy</h2>
                        <p className="text-soft-gray leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of
                            any changes by posting the new policy on this page and updating the "Last
                            updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Contact Us</h2>
                        <p className="text-soft-gray leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="mt-4 text-soft-gray">
                            <p>Email: privacy@luxuryapparel.com</p>
                            <p>Address: 123 Madison Avenue, New York, NY 10016</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
