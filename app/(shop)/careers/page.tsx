import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button-variants'
import { Briefcase, Users, TrendingUp, Heart } from 'lucide-react'

export const metadata = {
    title: 'Careers',
    description: 'Join the Luxury Apparel team and help shape the future of sustainable luxury fashion.',
}

export default function CareersPage() {
    return (
        <div className="min-h-screen section-padding">
            <div className="container-luxury max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Careers</h1>
                    <p className="text-lg text-soft-gray max-w-2xl mx-auto">
                        Join our team in creating timeless, sustainable luxury fashion
                    </p>
                </div>

                {/* Culture Section */}
                <section className="mb-16">
                    <h2 className="font-serif text-3xl mb-6">Why Luxury Apparel?</h2>
                    <p className="text-soft-gray leading-relaxed mb-8">
                        At Luxury Apparel, we're more than a fashion brand—we're a community
                        of passionate individuals dedicated to creating beautiful, responsible
                        products. We believe in fostering creativity, collaboration, and continuous
                        growth while maintaining a healthy work-life balance.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-stone/20 p-6">
                            <Users className="h-8 w-8 text-gold mb-3" />
                            <h3 className="font-medium text-xl mb-2">Collaborative Culture</h3>
                            <p className="text-soft-gray text-sm">
                                Work alongside talented individuals who share your passion for
                                design, sustainability, and excellence.
                            </p>
                        </div>

                        <div className="bg-stone/20 p-6">
                            <TrendingUp className="h-8 w-8 text-gold mb-3" />
                            <h3 className="font-medium text-xl mb-2">Growth Opportunities</h3>
                            <p className="text-soft-gray text-sm">
                                We invest in our team through training, mentorship, and clear
                                paths for advancement.
                            </p>
                        </div>

                        <div className="bg-stone/20 p-6">
                            <Heart className="h-8 w-8 text-gold mb-3" />
                            <h3 className="font-medium text-xl mb-2">Comprehensive Benefits</h3>
                            <p className="text-soft-gray text-sm">
                                Competitive salaries, health insurance, retirement plans, and
                                generous employee discounts.
                            </p>
                        </div>

                        <div className="bg-stone/20 p-6">
                            <Briefcase className="h-8 w-8 text-gold mb-3" />
                            <h3 className="font-medium text-xl mb-2">Meaningful Work</h3>
                            <p className="text-soft-gray text-sm">
                                Be part of a mission to make luxury fashion more sustainable
                                and accessible.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Open Positions */}
                <section className="mb-16">
                    <h2 className="font-serif text-3xl mb-6">Open Positions</h2>
                    <div className="bg-stone/20 p-8 text-center">
                        <p className="text-soft-gray mb-4">
                            We're not currently hiring, but we're always looking for exceptional talent.
                        </p>
                        <p className="text-soft-gray mb-6">
                            Send your resume and portfolio to{' '}
                            <a href="mailto:careers@luxuryapparel.com" className="text-charcoal hover:text-gold underline">
                                careers@luxuryapparel.com
                            </a>
                        </p>
                        <Link
                            href="/contact"
                            className={buttonVariants({ variant: 'secondary' })}
                        >
                            Contact Us
                        </Link>
                    </div>
                </section>

                {/* What We Look For */}
                <section>
                    <h2 className="font-serif text-3xl mb-6">What We Look For</h2>
                    <div className="space-y-4 text-soft-gray">
                        <div className="border-l-4 border-gold pl-4">
                            <h3 className="font-medium text-charcoal mb-1">Passion for Fashion & Sustainability</h3>
                            <p className="text-sm">
                                You care deeply about creating beautiful products that respect our planet.
                            </p>
                        </div>

                        <div className="border-l-4 border-gold pl-4">
                            <h3 className="font-medium text-charcoal mb-1">Attention to Detail</h3>
                            <p className="text-sm">
                                You understand that excellence lives in the details.
                            </p>
                        </div>

                        <div className="border-l-4 border-gold pl-4">
                            <h3 className="font-medium text-charcoal mb-1">Collaborative Spirit</h3>
                            <p className="text-sm">
                                You thrive in team environments and value diverse perspectives.
                            </p>
                        </div>

                        <div className="border-l-4 border-gold pl-4">
                            <h3 className="font-medium text-charcoal mb-1">Growth Mindset</h3>
                            <p className="text-sm">
                                You're always learning and seeking ways to improve.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
