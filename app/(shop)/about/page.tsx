import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button-variants'

export const metadata = {
    title: 'About Us',
    description: 'Discover the story behind Luxury Apparel - timeless elegance, exceptional craftsmanship, and sustainable luxury.',
}

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80"
                    alt="About Luxury Apparel"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-charcoal/40" />
                <div className="relative z-10 text-center text-ivory px-6">
                    <h1 className="font-serif text-5xl md:text-7xl mb-6 tracking-tight">
                        Our Story
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Where timeless elegance meets conscious craftsmanship
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="section-padding">
                <div className="container-luxury max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl md:text-5xl mb-6">
                            Crafting Timeless Luxury
                        </h2>
                        <p className="text-lg text-soft-gray leading-relaxed">
                            Founded on the belief that true luxury transcends trends, Luxury Apparel
                            represents more than just clothing—it embodies a philosophy of conscious
                            elegance and enduring quality.
                        </p>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-soft-gray leading-relaxed mb-6">
                            Since our inception, we have been dedicated to creating pieces that stand
                            the test of time. Each garment is thoughtfully designed and meticulously
                            crafted from the finest materials, sourced responsibly from artisans who
                            share our commitment to excellence.
                        </p>
                        <p className="text-soft-gray leading-relaxed">
                            Our collections are born from a deep appreciation for simplicity and
                            refinement. We believe in the power of quiet luxury—pieces that speak
                            through their quality, fit, and attention to detail rather than fleeting
                            trends or logos.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-padding bg-stone/20">
                <div className="container-luxury">
                    <h2 className="font-serif text-4xl md:text-5xl text-center mb-12">
                        Our Values
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <h3 className="font-serif text-2xl mb-4">Quality</h3>
                            <p className="text-soft-gray">
                                We source only the finest materials and work with skilled artisans
                                who share our dedication to exceptional craftsmanship.
                            </p>
                        </div>

                        <div className="text-center">
                            <h3 className="font-serif text-2xl mb-4">Sustainability</h3>
                            <p className="text-soft-gray">
                                Every decision we make considers our impact on the environment
                                and the communities we work with.
                            </p>
                        </div>

                        <div className="text-center">
                            <h3 className="font-serif text-2xl mb-4">Timelessness</h3>
                            <p className="text-soft-gray">
                                Our designs transcend trends, creating pieces that remain relevant
                                and cherished for years to come.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Craftsmanship Section */}
            <section className="section-padding">
                <div className="container-luxury">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[500px]">
                            <Image
                                src="https://images.unsplash.com/photo-1558769132-cb1aea1c8dd5?w=800&q=80"
                                alt="Craftsmanship"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        <div>
                            <h2 className="font-serif text-4xl mb-6">
                                Exceptional Craftsmanship
                            </h2>
                            <p className="text-soft-gray leading-relaxed mb-6">
                                Behind every piece is a team of dedicated artisans who bring decades
                                of experience and an unwavering commitment to excellence. From the
                                initial sketch to the final stitch, each garment undergoes rigorous
                                quality control to ensure it meets our exacting standards.
                            </p>
                            <p className="text-soft-gray leading-relaxed mb-8">
                                We partner with workshops that share our values, ensuring fair wages,
                                safe working conditions, and opportunities for professional growth.
                                This collaborative approach results in pieces that carry the soul
                                and expertise of those who create them.
                            </p>
                            <Link
                                href="/sustainability"
                                className={buttonVariants({ variant: 'outline' })}
                            >
                                Learn About Our Sustainability
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-charcoal text-ivory">
                <div className="container-luxury max-w-3xl text-center">
                    <h2 className="font-serif text-4xl md:text-5xl mb-6">
                        Join Our Journey
                    </h2>
                    <p className="text-lg mb-8 font-light">
                        Discover pieces that transcend trends and become cherished parts
                        of your wardrobe for years to come.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/shop/women"
                            className={buttonVariants({ size: 'lg', variant: 'secondary' })}
                        >
                            Shop Women
                        </Link>
                        <Link
                            href="/shop/men"
                            className={buttonVariants({ size: 'lg', variant: 'outlineIvory' })}
                        >
                            Shop Men
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
