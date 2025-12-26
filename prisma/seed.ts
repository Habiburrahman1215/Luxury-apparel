import { PrismaClient, Gender } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { slugify, generateSKU } from '../lib/utils'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123456', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@luxuryapparel.com' },
    update: {},
    create: {
      email: 'admin@luxuryapparel.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  })

  console.log('Admin user created:', admin.email)

  // Sample products
  const products = [
    {
      name: 'Cashmere Turtleneck',
      description: 'Luxuriously soft cashmere turtleneck. Perfect layering piece for any occasion.',
      gender: Gender.WOMEN,
      category: 'Knitwear',
      price: 29500, // $295
      compareAtPrice: 35000,
      images: [
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
        'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800',
      ],
      colors: [
        { name: 'Ivory', hex: '#F5F5DC' },
        { name: 'Black', hex: '#000000' },
        { name: 'Camel', hex: '#C19A6B' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      materials: '100% Cashmere',
      careInstructions: 'Dry clean only',
      featured: true,
      bestSeller: true,
    },
    {
      name: 'Tailored Wool Blazer',
      description: 'Impeccably tailored blazer in premium wool. A wardrobe essential.',
      gender: Gender.WOMEN,
      category: 'Outerwear',
      price: 59500,
      images: [
        'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800',
        'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
      ],
      colors: [
        { name: 'Navy', hex: '#000080' },
        { name: 'Black', hex: '#000000' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      materials: '100% Merino Wool',
      careInstructions: 'Dry clean only',
      featured: true,
    },
    {
      name: 'Silk Slip Dress',
      description: 'Elegant silk slip dress with delicate straps. Timeless and versatile.',
      gender: Gender.WOMEN,
      category: 'Dresses',
      price: 38500,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
      ],
      colors: [
        { name: 'Champagne', hex: '#F7E7CE' },
        { name: 'Black', hex: '#000000' },
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      materials: '100% Silk',
      careInstructions: 'Hand wash cold',
      bestSeller: true,
    },
    {
      name: 'Classic Oxford Shirt',
      description: 'Crisp cotton oxford shirt. Essential for the modern wardrobe.',
      gender: Gender.MEN,
      category: 'Shirts',
      price: 18500,
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
      ],
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Blue', hex: '#4169E1' },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      materials: '100% Cotton',
      careInstructions: 'Machine wash cold',
      featured: true,
      bestSeller: true,
    },
    {
      name: 'Merino Wool Sweater',
      description: 'Timeless crewneck sweater in fine merino wool.',
      gender: Gender.MEN,
      category: 'Knitwear',
      price: 24500,
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
      ],
      colors: [
        { name: 'Navy', hex: '#000080' },
        { name: 'Charcoal', hex: '#36454F' },
        { name: 'Oatmeal', hex: '#E8D5C4' },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      materials: '100% Merino Wool',
      careInstructions: 'Hand wash cold',
      featured: true,
    },
  ]

  for (const productData of products) {
    const slug = slugify(productData.name)

    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        ...productData,
        metaTitle: productData.name,
        metaDescription: productData.description,
      },
      create: {
        ...productData,
        slug,
        metaTitle: productData.name,
        metaDescription: productData.description,
      },
    })

    // Delete existing variants for this product
    await prisma.productVariant.deleteMany({
      where: { productId: product.id },
    })

    // Create variants
    for (const color of productData.colors) {
      for (const size of productData.sizes) {
        const sku = generateSKU(product.name, color.name, size)

        await prisma.productVariant.create({
          data: {
            productId: product.id,
            color: color.name,
            size,
            sku,
            inventory: Math.floor(Math.random() * 50) + 10, // Random inventory between 10-60
          },
        })
      }
    }

    console.log(`Created product: ${product.name}`)
  }

  // Create sample orders for testing invoice functionality
  console.log('\nCreating sample orders...')

  const sampleOrders = [
    {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      status: 'DELIVERED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      status: 'SHIPPED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      email: 'bob.johnson@example.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      street: '789 Elm Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'United States',
      phone: '+1 (555) 456-7890',
      status: 'PROCESSING' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      email: 'alice.williams@example.com',
      firstName: 'Alice',
      lastName: 'Williams',
      street: '321 Pine Road',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'United States',
      phone: '+1 (555) 234-5678',
      status: 'DELIVERED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      email: 'charlie.brown@example.com',
      firstName: 'Charlie',
      lastName: 'Brown',
      street: '654 Maple Lane',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'United States',
      phone: '+1 (555) 876-5432',
      status: 'PENDING' as const,
      paymentStatus: 'PAID' as const,
    },
  ]

  const allProducts = await prisma.product.findMany({ include: { variants: true } })

  for (const [index, orderData] of sampleOrders.entries()) {
    // Create shipping address
    const address = await prisma.address.create({
      data: {
        userId: admin.id,
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        street: orderData.street,
        city: orderData.city,
        state: orderData.state,
        zipCode: orderData.zipCode,
        country: orderData.country,
        phone: orderData.phone,
        isDefault: false,
      },
    })

    // Select random products for this order (2-4 items)
    const itemCount = Math.floor(Math.random() * 3) + 2
    const selectedProducts = allProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, itemCount)

    let subtotal = 0
    const orderItems = []

    for (const product of selectedProducts) {
      const variant = product.variants[Math.floor(Math.random() * product.variants.length)]
      const quantity = Math.floor(Math.random() * 2) + 1
      const price = product.price

      subtotal += price * quantity

      orderItems.push({
        productId: product.id,
        variantId: variant.id,
        quantity,
        price,
      })
    }

    const shipping = 1500 // $15
    const tax = Math.round(subtotal * 0.08) // 8% tax
    const total = subtotal + shipping + tax

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${index + 1}`,
        email: orderData.email,
        userId: admin.id,
        shippingAddressId: address.id,
        subtotal,
        shipping,
        tax,
        total,
        paymentStatus: orderData.paymentStatus,
        orderStatus: orderData.status,
        stripePaymentId: `pi_${Math.random().toString(36).substring(7)}`,
        items: {
          create: orderItems,
        },
      },
    })

    console.log(`Created order: ${order.orderNumber} for ${orderData.email}`)
  }

  console.log('\nSeeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })