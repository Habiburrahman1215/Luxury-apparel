'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button-variants'

interface FAQItem {
    question: string
    answer: string
    category: string
}

const faqs: FAQItem[] = [
    {
        category: 'Orders',
        question: 'How do I place an order?',
        answer: 'Browse our collections, select your desired items, choose size and color, then add to cart. Proceed to checkout to complete your purchase with our secure payment system.'
    },
    {
        category: 'Orders',
        question: 'Can I modify or cancel my order?',
        answer: 'Orders can be modified or canceled within 2 hours of placement. Contact our customer service immediately at orders@luxuryapparel.com.'
    },
    {
        category: 'Orders',
        question: 'Do you offer gift wrapping?',
        answer: 'Yes! We offer complimentary luxury gift wrapping and personalized gift messages at checkout.'
    },
    {
        category: 'Shipping',
        question: 'How long will my order take to arrive?',
        answer: 'Standard shipping takes 3-5 business days. Express shipping (1-2 days) is also available. International orders typically arrive within 7-14 business days.'
    },
    {
        category: 'Shipping',
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. Customers are responsible for any customs fees or import duties.'
    },
    {
        category: 'Shipping',
        question: 'How can I track my order?',
        answer: 'You will receive a tracking number via email once your order ships. Use this number to track your package on our website or the carrier\'s website.'
    },
    {
        category: 'Returns',
        question: 'What is your return policy?',
        answer: 'We offer free returns within 30 days of delivery. Items must be unworn, unwashed, and have all original tags attached. Sale items are final sale.'
    },
    {
        category: 'Returns',
        question: 'How do I initiate a return?',
        answer: 'Email returns@luxuryapparel.com within 30 days of delivery. We will send you a prepaid return label. Refunds are processed within 5-7 business days of receiving your return.'
    },
    {
        category: 'Returns',
        question: 'Can I exchange an item?',
        answer: 'Yes, exchanges are subject to availability. Contact our customer service team to arrange an exchange.'
    },
    {
        category: 'Products',
        question: 'How do I find the right size?',
        answer: 'Visit our Size Guide page for detailed measurements. If you\'re between sizes, we recommend sizing up for a relaxed fit or down for a closer fit.'
    },
    {
        category: 'Products',
        question: 'Are your materials sustainable?',
        answer: 'Yes, we prioritize organic, recycled, and eco-friendly materials. Visit our Sustainability page to learn more about our commitment to responsible fashion.'
    },
    {
        category: 'Products',
        question: 'How do I care for my garments?',
        answer: 'Each garment has specific care instructions on its label. Visit our Care Instructions page for detailed guidelines by material type.'
    },
    {
        category: 'Account',
        question: 'Do I need an account to make a purchase?',
        answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save items to your wishlist, and enjoy a faster checkout experience.'
    },
    {
        category: 'Account',
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page. Enter your email address and we\'ll send you instructions to reset your password.'
    },
    {
        category: 'Account',
        question: 'How can I update my account information?',
        answer: 'Log in to your account and navigate to Profile Settings to update your personal information, shipping addresses, and payment methods.'
    }
]

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('All')

    const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))]
    const filteredFAQs = selectedCategory === 'All'
        ? faqs
        : faqs.filter(faq => faq.category === selectedCategory)

    return (
        <div className="min-h-screen section-padding">
            <div className="container-luxury max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-soft-gray">
                        Find answers to common questions about orders, shipping, and more
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 justify-center mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={buttonVariants({
                                variant: selectedCategory === category ? 'primary' : 'secondary',
                                size: 'sm'
                            })}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                        <div key={index} className="border-b border-charcoal/10">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full py-6 flex justify-between items-center text-left hover:text-gold transition-colors"
                            >
                                <span className="font-medium pr-8">{faq.question}</span>
                                <ChevronDown
                                    className={`h-5 w-5 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-6 text-soft-gray leading-relaxed">{faq.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-16 bg-stone/20 p-8 text-center">
                    <h2 className="font-serif text-2xl mb-3">Still have questions?</h2>
                    <p className="text-soft-gray mb-6">
                        Our customer service team is here to help
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:support@luxuryapparel.com"
                            className={buttonVariants({ variant: 'primary', size: 'lg' })}
                        >
                            Email Us
                        </a>
                        <Link
                            href="/contact"
                            className={buttonVariants({ variant: 'outline', size: 'lg' })}
                        >
                            Contact Page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
