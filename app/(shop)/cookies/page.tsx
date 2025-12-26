export const metadata = {
    title: 'Cookie Policy',
    description: 'Learn about how Luxury Apparel uses cookies and similar technologies.',
}

export default function CookiesPage() {
    return (
        <div className="min-h-screen section-padding">
            <div className="container-luxury max-w-4xl">
                <h1 className="font-serif text-4xl md:text-5xl mb-4">Cookie Policy</h1>
                <p className="text-soft-gray mb-12">Last updated: December 2024</p>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="font-serif text-3xl mb-4">What Are Cookies?</h2>
                        <p className="text-soft-gray leading-relaxed">
                            Cookies are small text files that are placed on your device when you visit
                            our website. They help us provide you with a better experience by remembering
                            your preferences and understanding how you use our site.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Types of Cookies We Use</h2>

                        <h3 className="font-medium text-xl mb-3">Essential Cookies</h3>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            These cookies are necessary for the website to function properly. They enable
                            core functionality such as:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2 mb-6">
                            <li>Security and authentication</li>
                            <li>Shopping cart functionality</li>
                            <li>Session management</li>
                            <li>Load balancing</li>
                        </ul>

                        <h3 className="font-medium text-xl mb-3">Performance Cookies</h3>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            These cookies collect information about how visitors use our website:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2 mb-6">
                            <li>Pages visited most often</li>
                            <li>Error messages received</li>
                            <li>Time spent on pages</li>
                            <li>User navigation patterns</li>
                        </ul>

                        <h3 className="font-medium text-xl mb-3">Functional Cookies</h3>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            These cookies allow the website to remember choices you make:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2 mb-6">
                            <li>Language preferences</li>
                            <li>Region or country</li>
                            <li>Font size and display preferences</li>
                            <li>Items in your wishlist</li>
                        </ul>

                        <h3 className="font-medium text-xl mb-3">Targeting/Advertising Cookies</h3>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            These cookies are used to deliver relevant advertisements:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2">
                            <li>Limiting the number of times you see an ad</li>
                            <li>Measuring the effectiveness of campaigns</li>
                            <li>Personalizing ads based on your interests</li>
                            <li>Retargeting visitors across other websites</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Third-Party Cookies</h2>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            We use third-party services that may set cookies on your device:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2">
                            <li><strong>Google Analytics:</strong> For website analytics and performance tracking</li>
                            <li><strong>Stripe:</strong> For secure payment processing</li>
                            <li><strong>Social Media Platforms:</strong> For social sharing and authentication</li>
                            <li><strong>Marketing Partners:</strong> For advertising and remarketing (with your consent)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">How Long Do Cookies Last?</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-lg mb-2">Session Cookies</h3>
                                <p className="text-soft-gray leading-relaxed">
                                    These are temporary cookies that expire when you close your browser.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium text-lg mb-2">Persistent Cookies</h3>
                                <p className="text-soft-gray leading-relaxed">
                                    These remain on your device for a set period or until you delete them.
                                    They help us recognize you when you return to our website.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Managing Cookies</h2>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            You have the right to accept or reject cookies. Most browsers automatically
                            accept cookies, but you can modify your browser settings to decline cookies
                            if you prefer.
                        </p>

                        <h3 className="font-medium text-xl mb-3">Browser Settings</h3>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            You can control cookies through your browser settings:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2 mb-6">
                            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                            <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                            <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                            <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                        </ul>

                        <div className="bg-stone/20 p-6">
                            <p className="text-sm text-soft-gray">
                                <strong>Note:</strong> Blocking or deleting cookies may impact your experience
                                on our website. Some features may not function properly without cookies.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Do Not Track Signals</h2>
                        <p className="text-soft-gray leading-relaxed">
                            We currently do not respond to "Do Not Track" browser signals. However, you
                            can manage cookies through your browser settings as described above.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Updates to This Policy</h2>
                        <p className="text-soft-gray leading-relaxed">
                            We may update this Cookie Policy from time to time to reflect changes in
                            technology, legislation, or our practices. Please check this page periodically
                            for updates.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Contact Us</h2>
                        <p className="text-soft-gray leading-relaxed">
                            If you have questions about our use of cookies, please contact us at:
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
