import { Package, Truck, Globe, RotateCcw } from 'lucide-react'

export const metadata = {
    title: 'Shipping & Returns',
    description: 'Learn about our shipping options, delivery times, and hassle-free return policy.',
}

export default function ShippingPage() {
    return (
        <div className="min-h-screen section-padding">
            <div className="container-luxury max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Shipping & Returns</h1>
                    <p className="text-soft-gray max-w-2xl mx-auto">
                        Fast, reliable shipping and hassle-free returns
                    </p>
                </div>

                {/* Shipping Section */}
                <section className="mb-16">
                    <h2 className="font-serif text-3xl mb-6">Shipping Information</h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-stone/20 p-6">
                            <Truck className="h-8 w-8 text-gold mb-3" />
                            <h3 className="font-medium text-xl mb-2">Standard Shipping</h3>
                            <p className="text-soft-gray text-sm mb-3">
                                3-5 business days
                            </p>
                            <p className="text-charcoal font-medium">$15.00</p>
                            <p className="text-xs text-soft-gray mt-1">Free on orders over $200</p>
                        </div>

                        <div className="bg-stone/20 p-6">
                            <Package className="h-8 w-8 text-gold mb-3" />
                            <h3 className="font-medium text-xl mb-2">Express Shipping</h3>
                            <p className="text-soft-gray text-sm mb-3">
                                1-2 business days
                            </p>
                            <p className="text-charcoal font-medium">$30.00</p>
                        </div>
                    </div>

                    <div className="prose prose-sm max-w-none text-soft-gray">
                        <h3 className="text-charcoal font-medium mb-3">Shipping Details</h3>
                        <ul className="space-y-2">
                            <li>All orders are processed within 1-2 business days</li>
                            <li>You will receive a tracking number once your order ships</li>
                            <li>Signature may be required for delivery</li>
                            <li>We cannot ship to PO boxes for express delivery</li>
                        </ul>
                    </div>
                </section>

                {/* International Shipping */}
                <section className="mb-16">
                    <div className="flex gap-4 mb-4">
                        <Globe className="h-8 w-8 text-gold flex-shrink-0" />
                        <div>
                            <h2 className="font-serif text-3xl mb-2">International Shipping</h2>
                            <p className="text-soft-gray">
                                We currently ship to select international destinations. Delivery
                                times vary by location (typically 7-14 business days).
                            </p>
                        </div>
                    </div>

                    <div className="bg-stone/20 p-6 mt-6">
                        <h3 className="font-medium mb-3">Important Notes</h3>
                        <ul className="text-sm text-soft-gray space-y-2">
                            <li>• International shipping costs calculated at checkout</li>
                            <li>• Customers are responsible for any customs fees or import duties</li>
                            <li>• Some items may have shipping restrictions</li>
                            <li>• International orders cannot be expedited</li>
                        </ul>
                    </div>
                </section>

                {/* Returns Section */}
                <section className="mb-16">
                    <div className="flex gap-4 mb-6">
                        <RotateCcw className="h-8 w-8 text-gold flex-shrink-0" />
                        <div>
                            <h2 className="font-serif text-3xl mb-2">Returns & Exchanges</h2>
                            <p className="text-soft-gray">
                                We want you to love your purchase. If you're not completely satisfied,
                                we offer free returns within 30 days of delivery.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-lg mb-3">Return Process</h3>
                            <ol className="list-decimal list-inside space-y-2 text-soft-gray">
                                <li>Contact us at returns@luxuryapparel.com within 30 days</li>
                                <li>We'll send you a prepaid return label</li>
                                <li>Pack your items securely with original tags attached</li>
                                <li>Drop off at any authorized carrier location</li>
                                <li>Refund processed within 5-7 business days of receipt</li>
                            </ol>
                        </div>

                        <div className="bg-stone/20 p-6">
                            <h3 className="font-medium mb-3">Return Policy</h3>
                            <ul className="text-sm text-soft-gray space-y-2">
                                <li>• Items must be unworn, unwashed, and in original condition</li>
                                <li>• All original tags must be attached</li>
                                <li>• Sale items are final sale and cannot be returned</li>
                                <li>• Exchanges are subject to availability</li>
                                <li>• Refunds issued to original payment method</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="bg-charcoal text-ivory p-8 text-center">
                    <h3 className="font-serif text-2xl mb-2">Questions?</h3>
                    <p className="mb-4 text-ivory/80">
                        Our customer service team is here to help
                    </p>
                    <a
                        href="mailto:support@luxuryapparel.com"
                        className="text-gold hover:text-gold/80 underline"
                    >
                        support@luxuryapparel.com
                    </a>
                </section>
            </div>
        </div>
    )
}
