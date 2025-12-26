import { Sparkles, Wind, Sun, Snowflake } from 'lucide-react'

export const metadata = {
    title: 'Care Instructions',
    description: 'Learn how to care for your luxury garments to ensure they last for years to come.',
}

export default function CarePage() {
    return (
        <div className="min-h-screen section-padding">
            <div className="container-luxury max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Care Instructions</h1>
                    <p className="text-soft-gray max-w-2xl mx-auto">
                        Preserve the beauty and longevity of your garments with proper care
                    </p>
                </div>

                {/* General Care */}
                <section className="mb-16">
                    <h2 className="font-serif text-3xl mb-6">General Care Guidelines</h2>
                    <div className="space-y-4 text-soft-gray">
                        <p>
                            Each piece from Luxury Apparel is crafted with exceptional materials
                            that deserve thoughtful care. Following these guidelines will help your
                            garments maintain their beauty for years to come.
                        </p>
                        <p>
                            Always check the care label inside your garment for specific instructions.
                            When in doubt, opt for professional cleaning.
                        </p>
                    </div>
                </section>

                {/* Material-Specific Care */}
                <section className="mb-16">
                    <h2 className="font-serif text-3xl mb-6">Care by Material</h2>

                    <div className="space-y-6">
                        {/* Cotton */}
                        <div className="bg-stone/20 p-6">
                            <h3 className="font-serif text-2xl mb-4">Organic Cotton</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-gold" />
                                        Washing
                                    </h4>
                                    <ul className="text-sm text-soft-gray space-y-1">
                                        <li>• Machine wash cold with like colors</li>
                                        <li>• Use gentle, eco-friendly detergent</li>
                                        <li>• Avoid bleach and fabric softeners</li>
                                        <li>• Turn garments inside out</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Wind className="h-5 w-5 text-gold" />
                                        Drying & Storage
                                    </h4>
                                    <ul className="text-sm text-soft-gray space-y-1">
                                        <li>• Tumble dry low or line dry</li>
                                        <li>• Remove promptly to prevent wrinkles</li>
                                        <li>• Iron on medium heat if needed</li>
                                        <li>• Fold and store in cool, dry place</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Wool & Cashmere */}
                        <div className="bg-stone/20 p-6">
                            <h3 className="font-serif text-2xl mb-4">Wool & Cashmere</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-gold" />
                                        Washing
                                    </h4>
                                    <ul className="text-sm text-soft-gray space-y-1">
                                        <li>• Dry clean recommended</li>
                                        <li>• Hand wash in cold water if necessary</li>
                                        <li>• Use wool-specific detergent</li>
                                        <li>• Never wring or twist</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Snowflake className="h-5 w-5 text-gold" />
                                        Drying & Storage
                                    </h4>
                                    <ul className="text-sm text-soft-gray space-y-1">
                                        <li>• Lay flat to dry on clean towel</li>
                                        <li>• Reshape while damp</li>
                                        <li>• Never hang—will stretch</li>
                                        <li>• Store folded with cedar or lavender</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Silk */}
                        <div className="bg-stone/20 p-6">
                            <h3 className="font-serif text-2xl mb-4">Silk</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-gold" />
                                        Washing
                                    </h4>
                                    <ul className="text-sm text-soft-gray space-y-1">
                                        <li>• Dry clean for best results</li>
                                        <li>• Hand wash in lukewarm water if needed</li>
                                        <li>• Use gentle silk detergent</li>
                                        <li>• Never use bleach or harsh chemicals</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Sun className="h-5 w-5 text-gold" />
                                        Drying & Storage
                                    </h4>
                                    <ul className="text-sm text-soft-gray space-y-1">
                                        <li>• Roll in towel to remove excess water</li>
                                        <li>• Air dry away from direct sunlight</li>
                                        <li>• Iron on low heat while slightly damp</li>
                                        <li>• Store on padded hangers</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Linen */}
                        <div className="bg-stone/20 p-6">
                            <h3 className="font-serif text-2xl mb-4">Linen</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-gold" />
                                        Washing
                                    </h4>
                                    <ul className="text-sm text-soft-gray space-y-1">
                                        <li>• Machine wash cold or lukewarm</li>
                                        <li>• Use gentle cycle</li>
                                        <li>• Natural or mild detergent</li>
                                        <li>• Can be machine washed frequently</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Wind className="h-5 w-5 text-gold" />
                                        Drying & Storage
                                    </h4>
                                    <ul className="text-sm text-soft-gray space-y-1">
                                        <li>• Line dry for best results</li>
                                        <li>• Can tumble dry on low</li>
                                        <li>• Iron while slightly damp on high heat</li>
                                        <li>• Embrace natural wrinkles or press crisp</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Storage Tips */}
                <section className="mb-16">
                    <h2 className="font-serif text-3xl mb-6">Storage Tips</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4 text-soft-gray">
                            <div>
                                <h3 className="font-medium text-charcoal mb-2">Seasonal Storage</h3>
                                <ul className="text-sm space-y-1">
                                    <li>• Clean before storing</li>
                                    <li>• Use breathable garment bags</li>
                                    <li>• Add cedar blocks or lavender sachets</li>
                                    <li>• Store in cool, dry, dark place</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium text-charcoal mb-2">Daily Care</h3>
                                <ul className="text-sm space-y-1">
                                    <li>• Air out after wearing</li>
                                    <li>• Use quality hangers</li>
                                    <li>• Avoid overcrowding in closet</li>
                                    <li>• Rotate garments regularly</li>
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-4 text-soft-gray">
                            <div>
                                <h3 className="font-medium text-charcoal mb-2">Stain Removal</h3>
                                <ul className="text-sm space-y-1">
                                    <li>• Blot, don't rub fresh stains</li>
                                    <li>• Treat immediately when possible</li>
                                    <li>• Test cleaners on hidden area first</li>
                                    <li>• Seek professional help for delicate fabrics</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium text-charcoal mb-2">Professional Care</h3>
                                <ul className="text-sm space-y-1">
                                    <li>• Choose eco-friendly dry cleaners</li>
                                    <li>• Remove plastic bags immediately</li>
                                    <li>• Point out stains to cleaner</li>
                                    <li>• Request gentle, natural processes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Repair Service */}
                <section className="bg-charcoal text-ivory p-8">
                    <div className="text-center">
                        <h2 className="font-serif text-3xl mb-4">Repair & Alteration Services</h2>
                        <p className="mb-6 text-ivory/80">
                            We offer complimentary repair services for manufacturing defects and
                            professional alteration services to ensure the perfect fit.
                        </p>
                        <a
                            href="mailto:care@luxuryapparel.com"
                            className="text-gold hover:text-gold/80 underline"
                        >
                            Contact our care team
                        </a>
                    </div>
                </section>
            </div>
        </div>
    )
}
