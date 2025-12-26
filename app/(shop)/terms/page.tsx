export const metadata = {
    title: 'Terms of Service',
    description: 'Terms and conditions for using Luxury Apparel website and services.',
}

export default function TermsPage() {
    return (
        <div className="min-h-screen section-padding">
            <div className="container-luxury max-w-4xl">
                <h1 className="font-serif text-4xl md:text-5xl mb-4">Terms of Service</h1>
                <p className="text-soft-gray mb-12">Last updated: December 2024</p>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="font-serif text-3xl mb-4">Agreement to Terms</h2>
                        <p className="text-soft-gray leading-relaxed">
                            By accessing or using the Luxury Apparel website ("Website"), you agree to
                            be bound by these Terms of Service ("Terms"). If you do not agree to these
                            Terms, please do not use our Website.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Use of Website</h2>
                        <h3 className="font-medium text-xl mb-3">Eligibility</h3>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            You must be at least 18 years old to make purchases on our Website. By using
                            our Website, you represent that you are of legal age to form a binding contract.
                        </p>

                        <h3 className="font-medium text-xl mb-3">Account Responsibilities</h3>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            If you create an account, you are responsible for:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Providing accurate and current information</li>
                            <li>Notifying us immediately of any unauthorized use</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Orders and Pricing</h2>
                        <h3 className="font-medium text-xl mb-3">Order Acceptance</h3>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            All orders are subject to acceptance and availability. We reserve the right
                            to refuse or cancel any order for any reason, including but not limited to:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2 mb-6">
                            <li>Product unavailability</li>
                            <li>Pricing errors</li>
                            <li>Suspected fraudulent transactions</li>
                            <li>Violations of these Terms</li>
                        </ul>

                        <h3 className="font-medium text-xl mb-3">Pricing</h3>
                        <p className="text-soft-gray leading-relaxed">
                            All prices are in USD unless otherwise stated. We reserve the right to change
                            prices at any time without notice. Pricing errors are subject to correction.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Payment</h2>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            We accept the following payment methods:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2 mb-4">
                            <li>Credit and debit cards (Visa, Mastercard, American Express)</li>
                            <li>PayPal</li>
                            <li>Other payment methods as displayed at checkout</li>
                        </ul>
                        <p className="text-soft-gray leading-relaxed">
                            Payment is due at the time of order. By providing payment information, you
                            represent that you are authorized to use the payment method.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Shipping and Delivery</h2>
                        <p className="text-soft-gray leading-relaxed">
                            Shipping times and costs are provided at checkout. We are not responsible
                            for delays caused by shipping carriers or customs. Risk of loss passes to
                            you upon delivery to the carrier. For more information, see our Shipping &
                            Returns page.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Returns and Refunds</h2>
                        <p className="text-soft-gray leading-relaxed">
                            We accept returns within 30 days of delivery for unworn, unwashed items with
                            original tags attached. Sale items are final sale. Refunds are processed to
                            the original payment method within 5-7 business days of receiving the return.
                            For full details, see our Shipping & Returns page.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Intellectual Property</h2>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            All content on this Website, including but not limited to text, graphics,
                            logos, images, and software, is the property of Luxury Apparel and protected
                            by copyright, trademark, and other intellectual property laws.
                        </p>
                        <p className="text-soft-gray leading-relaxed">
                            You may not reproduce, distribute, modify, or create derivative works without
                            our express written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Prohibited Conduct</h2>
                        <p className="text-soft-gray leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc list-inside text-soft-gray space-y-2">
                            <li>Use the Website for any illegal purpose</li>
                            <li>Attempt to gain unauthorized access to the Website or systems</li>
                            <li>Interfere with the Website's operation</li>
                            <li>Impersonate any person or entity</li>
                            <li>Transmit viruses or malicious code</li>
                            <li>Scrape or harvest data from the Website</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Limitation of Liability</h2>
                        <p className="text-soft-gray leading-relaxed">
                            To the maximum extent permitted by law, Luxury Apparel shall not be liable
                            for any indirect, incidental, special, consequential, or punitive damages
                            arising from your use of the Website or products purchased.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Governing Law</h2>
                        <p className="text-soft-gray leading-relaxed">
                            These Terms are governed by the laws of the State of New York, without regard
                            to conflict of law principles. Any disputes shall be resolved in the courts
                            of New York County, New York.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Changes to Terms</h2>
                        <p className="text-soft-gray leading-relaxed">
                            We reserve the right to modify these Terms at any time. Changes will be
                            effective immediately upon posting. Your continued use of the Website
                            constitutes acceptance of the modified Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-3xl mb-4">Contact Information</h2>
                        <p className="text-soft-gray leading-relaxed">
                            For questions about these Terms, please contact us at:
                        </p>
                        <div className="mt-4 text-soft-gray">
                            <p>Email: legal@luxuryapparel.com</p>
                            <p>Address: 123 Madison Avenue, New York, NY 10016</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
