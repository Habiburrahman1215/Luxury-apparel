'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter } from 'lucide-react'
import { useState } from 'react'
import Button from '../ui/Button'
import { useEffect } from 'react'

interface SocialLink {
  id: string
  platform: string
  url: string
  isActive: boolean
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  useEffect(() => {
    fetch('/api/admin/social')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSocialLinks(data.filter(link => link.isActive))
        }
      })
      .catch(err => console.error('Failed to fetch social links:', err))
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setMessage('Thank you for subscribing!')
        setEmail('')
      } else {
        setMessage('Something went wrong. Please try again.')
      }
    } catch (error) {
      setMessage('Error subscribing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const footerLinks = {
    shop: [
      { name: "Women's Collection", href: '/shop/women' },
      { name: "Men's Collection", href: '/shop/men' },
      { name: 'Best Sellers', href: '/shop?sort=bestsellers' },
      { name: 'New Arrivals', href: '/shop?sort=newest' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Sustainability', href: '/sustainability' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
    ],
    support: [
      { name: 'Shipping & Returns', href: '/shipping' },
      { name: 'Size Guide', href: '/size-guide' },
      { name: 'Care Instructions', href: '/care' },
      { name: 'FAQ', href: '/faq' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  }

  return (
    <footer className="bg-stone/30 border-t border-charcoal/10 mt-24">
      <div className="container-luxury section-padding">
        {/* Newsletter */}
        <div className="max-w-xl mx-auto text-center mb-16">
          <h3 className="font-serif text-2xl md:text-3xl mb-4">
            Join Our Newsletter
          </h3>
          <p className="text-soft-gray mb-6">
            Receive exclusive updates on new collections, events, and offers.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field flex-1"
              required
            />
            <Button type="submit" isLoading={isSubmitting}>
              Subscribe
            </Button>
          </form>
          {message && (
            <p className="mt-2 text-sm text-charcoal">{message}</p>
          )}
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-medium mb-4 tracking-wide">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-soft-gray hover:text-charcoal transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 tracking-wide">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-soft-gray hover:text-charcoal transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 tracking-wide">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-soft-gray hover:text-charcoal transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 tracking-wide">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-soft-gray hover:text-charcoal transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-charcoal/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-soft-gray">
            © {new Date().getFullYear()} Luxury Apparel. All rights reserved.
          </p>

          <div className="flex gap-6">
            {socialLinks.length > 0 ? (
              socialLinks.map((link) => {
                const PlatformIcon = {
                  Instagram: Instagram,
                  Facebook: Facebook,
                  Twitter: Twitter,
                }[link.platform] || Instagram

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-charcoal hover:text-gold transition-colors"
                  >
                    <PlatformIcon className="h-5 w-5" />
                  </a>
                )
              })
            ) : (
              <>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal hover:text-gold transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal hover:text-gold transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal hover:text-gold transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}