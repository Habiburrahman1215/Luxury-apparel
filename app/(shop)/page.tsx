import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/button-variants'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/shop/ProductCard'

export const metadata = {
  title: 'Home',
}

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: { featured: true },
    include: { variants: true },
    take: 4,
  })
}

async function getBestSellers() {
  return await prisma.product.findMany({
    where: { bestSeller: true },
    include: { variants: true },
    take: 4,
  })
}

async function getInstagramPosts() {
  return await prisma.instagramPost.findMany({
    orderBy: { order: 'asc' },
    take: 8,
  })
}

export default async function HomePage() {
  const [featured, bestSellers, instagramPosts] = await Promise.all([
    getFeaturedProducts(),
    getBestSellers(),
    getInstagramPosts(),
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
          alt="Luxury fashion"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/20" />
        <div className="relative z-10 text-center text-ivory px-6">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight">
            Timeless Elegance
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light tracking-wide">
            Discover refined luxury in every detail. Crafted for those who appreciate quiet sophistication.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop/women" className={buttonVariants({ size: 'lg', variant: 'primary' })}>
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

      {/* Featured Collections */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/shop/women" className="group relative h-[600px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                alt="Women's Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              <div className="absolute bottom-12 left-12 text-ivory">
                <h2 className="font-serif text-4xl mb-2">Women</h2>
                <p className="text-lg font-light mb-4">Refined femininity</p>
                <span className="inline-block border-b-2 border-ivory pb-1">
                  Explore Collection →
                </span>
              </div>
            </Link>

            <Link href="/shop/men" className="group relative h-[600px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80"
                alt="Men's Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              <div className="absolute bottom-12 left-12 text-ivory">
                <h2 className="font-serif text-4xl mb-2">Men</h2>
                <p className="text-lg font-light mb-4">Modern masculinity</p>
                <span className="inline-block border-b-2 border-ivory pb-1">
                  Explore Collection →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section-padding bg-stone/20">
          <div className="container-luxury">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl mb-4">
                Featured Pieces
              </h2>
              <p className="text-soft-gray max-w-2xl mx-auto">
                Curated selections that embody our commitment to timeless design and exceptional quality.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featured.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="section-padding">
          <div className="container-luxury">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl mb-4">
                Best Sellers
              </h2>
              <p className="text-soft-gray max-w-2xl mx-auto">
                The most coveted pieces from our collection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {bestSellers.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Philosophy */}
      <section className="section-padding bg-charcoal text-ivory">
        <div className="container-luxury max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">
            Our Philosophy
          </h2>
          <p className="text-lg leading-relaxed mb-8 font-light">
            We believe in the power of quiet luxury. Each piece is thoughtfully designed to transcend trends,
            crafted from the finest materials, and made to become a cherished part of your wardrobe for years to come.
          </p>
          <Link
            href="/about"
            className={buttonVariants({ variant: 'outlineIvory' })}
          >
            Learn More About Us
          </Link>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">
              @LuxuryApparel
            </h2>
            <p className="text-soft-gray">
              Follow us for daily inspiration
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instagramPosts.length > 0 ? (
              instagramPosts.map((post: any) => (
                <div key={post.id} className="relative aspect-square overflow-hidden group cursor-pointer">
                  {post.link ? (
                    <Link href={post.link} target="_blank">
                      <Image
                        src={post.imageUrl}
                        alt="Instagram post"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </Link>
                  ) : (
                    <Image
                      src={post.imageUrl}
                      alt="Instagram post"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors" />
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="relative aspect-square overflow-hidden group cursor-pointer">
                  <Image
                    src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=400&q=80`}
                    alt={`Instagram post ${i}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}