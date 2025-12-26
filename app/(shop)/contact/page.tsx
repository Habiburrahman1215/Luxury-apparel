'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitMessage('')

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000))

        setSubmitMessage('Thank you for contacting us. We will respond within 24 hours.')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setIsSubmitting(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="min-h-screen section-padding">
            <div className="container-luxury max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Contact Us</h1>
                    <p className="text-soft-gray max-w-2xl mx-auto">
                        We're here to help. Reach out to us for any inquiries about our products,
                        orders, or collaborations.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <h2 className="font-serif text-2xl mb-6">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    className="input-field w-full resize-none"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                className="w-full"
                            >
                                Send Message
                            </Button>

                            {submitMessage && (
                                <p className="text-sm text-green-600">{submitMessage}</p>
                            )}
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="font-serif text-2xl mb-6">Get in Touch</h2>
                            <p className="text-soft-gray mb-8">
                                Our customer service team is available Monday through Friday,
                                9:00 AM - 6:00 PM EST.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <Mail className="h-6 w-6 text-gold flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium mb-1">Email</h3>
                                    <a
                                        href="mailto:hello@luxuryapparel.com"
                                        className="text-soft-gray hover:text-gold transition-colors"
                                    >
                                        hello@luxuryapparel.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Phone className="h-6 w-6 text-gold flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium mb-1">Phone</h3>
                                    <a
                                        href="tel:+1-800-LUXURY"
                                        className="text-soft-gray hover:text-gold transition-colors"
                                    >
                                        +1 (800) LUXURY-1
                                    </a>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <MapPin className="h-6 w-6 text-gold flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium mb-1">Flagship Store</h3>
                                    <p className="text-soft-gray">
                                        123 Madison Avenue<br />
                                        New York, NY 10016<br />
                                        United States
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-stone/20 p-6 mt-8">
                            <h3 className="font-medium mb-2">Store Hours</h3>
                            <div className="text-sm text-soft-gray space-y-1">
                                <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                                <p>Sunday: 12:00 PM - 6:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
