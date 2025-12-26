import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Recycle, Heart, Award } from 'lucide-react'

export const metadata = {
    title: 'Sustainability',
    description: 'Our commitment to sustainable luxury - ethical sourcing, eco-friendly materials, and responsible manufacturing.',
}

export default function SustainabilityPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80"
                    alt="Sustainability"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-charcoal/50" />
                <div className="relative z-10 text-center text-ivory px-6">
                    <h1 className="font-serif text-5xl md:text-7xl mb-6 tracking-tight">
                        Sustainable Luxury
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Fashion that respects our planet and its people
                    </p>
                </div>
            </section>

            {/* Commitment Section */}
            <section className="section-padding">
                <div className="container-luxury max-w-4xl text-center">
                    <h2 className="font-serif text-4xl md:text-5xl mb-6">
                        Our Commitment
                    </h2>
                    <p className="text-lg text-soft-gray leading-relaxed">
                        We believe true luxury should never come at the expense of our planet
                        or the people who create it. Our approach to sustainability is woven
                        into every aspect of our business—from the materials we choose to the
                        partners we work with.
                    </p>
                </div>
            </section>

            {/* Pillars Grid */}
            <section className="section-padding bg-stone/20">
                <div className="container-luxury">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-ivory p-8">
                            <Leaf className="h-12 w-12 text-gold mb-4" />
                            <h3 className="font-serif text-2xl mb-4">Sustainable Materials</h3>
                            <p className="text-soft-gray mb-4">
                                We prioritize organic, recycled, and innovative eco-friendly materials.
                                Our fabrics are sourced from certified suppliers who share our environmental values.
                            </p>
                            <ul className="text-sm text-soft-gray space-y-2">
                                <li>• 100% organic cotton from GOTS-certified farms</li>
                                <li>• Recycled cashmere and wool fibers</li>
                                <li>• Innovative plant-based alternatives</li>
                                <li>• Low-impact dyes and finishes</li>
                            </ul>
                        </div>

                        <div className="bg-ivory p-8">
                            <Heart className="h-12 w-12 text-gold mb-4" />
                            <h3 className="font-serif text-2xl mb-4">Ethical Production</h3>
                            <p className="text-soft-gray mb-4">
                                We partner exclusively with manufacturers who uphold the highest labor
                                standards and provide safe, fair working conditions.
                            </p>
                            <ul className="text-sm text-soft-gray space-y-2">
                                <li>• Fair Trade certified facilities</li>
                                <li>• Living wages for all workers</li>
                                <li>• Regular third-party audits</li>
                                <li>• Long-term partnerships with artisans</li>
                            </ul>
                        </div>

                        <div className="bg-ivory p-8">
                            <Recycle className="h-12 w-12 text-gold mb-4" />
                            <h3 className="font-serif text-2xl mb-4">Circular Economy</h3>
                            <p className="text-soft-gray mb-4">
                                We're committed to reducing waste through thoughtful design, responsible
                                packaging, and take-back programs.
                            </p>
                            <ul className="text-sm text-soft-gray space-y-2">
                                <li>• 100% recyclable packaging</li>
                                <li>• Garment repair and alteration services</li>
                                <li>• Recycling program for end-of-life items</li>
                                <li>• Zero-waste pattern making</li>
                            </ul>
                        </div>

                        <div className="bg-ivory p-8">
                            <Award className="h-12 w-12 text-gold mb-4" />
                            <h3 className="font-serif text-2xl mb-4">Transparency</h3>
                            <p className="text-soft-gray mb-4">
                                We believe in full transparency. Every piece comes with information
                                about its materials, origin, and environmental impact.
                            </p>
                            <ul className="text-sm text-soft-gray space-y-2">
                                <li>• Complete supply chain traceability</li>
                                <li>• Annual sustainability reports</li>
                                <li>• Carbon footprint calculations</li>
                                <li>• Third-party certifications</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Goals Section */}
            <section className="section-padding">
                <div className="container-luxury max-w-4xl">
                    <h2 className="font-serif text-4xl md:text-5xl text-center mb-12">
                        2030 Goals
                    </h2>

                    <div className="space-y-8">
                        <div className="border-l-4 border-gold pl-6">
                            <h3 className="font-medium text-xl mb-2">Carbon Neutral Operations</h3>
                            <p className="text-soft-gray">
                                Achieve net-zero carbon emissions across our entire supply chain,
                                from sourcing to delivery.
                            </p>
                        </div>

                        <div className="border-l-4 border-gold pl-6">
                            <h3 className="font-medium text-xl mb-2">100% Sustainable Materials</h3>
                            <p className="text-soft-gray">
                                Transition to exclusively using organic, recycled, or regenerative
                                materials in all our collections.
                            </p>
                        </div>

                        <div className="border-l-4 border-gold pl-6">
                            <h3 className="font-medium text-xl mb-2">Circular Fashion Model</h3>
                            <p className="text-soft-gray">
                                Implement a fully circular business model where every garment can be
                                repaired, resold, or recycled.
                            </p>
                        </div>

                        <div className="border-l-4 border-gold pl-6">
                            <h3 className="font-medium text-xl mb-2">Community Impact</h3>
                            <p className="text-soft-gray">
                                Support 10,000+ artisans through fair trade partnerships and skill
                                development programs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-charcoal text-ivory">
                <div className="container-luxury max-w-3xl text-center">
                    <h2 className="font-serif text-4xl mb-6">
                        Join Us in Making a Difference
                    </h2>
                    <p className="text-lg mb-8 font-light">
                        Every purchase supports our mission to create beautiful, responsible fashion.
                        Together, we can build a more sustainable future.
                    </p>
                    <Link
                        href="/shop/women"
                        className="inline-flex items-center justify-center px-10 py-4 text-lg font-medium tracking-wide transition-all duration-300 bg-ivory text-charcoal hover:bg-ivory/90"
                    >
                        Explore Our Collections
                    </Link>
                </div>
            </section>
        </div>
    )
}
