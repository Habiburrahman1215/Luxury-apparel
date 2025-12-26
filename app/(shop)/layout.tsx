import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import CartSync from '@/components/cart/CartSync'
import { prisma } from '@/lib/prisma'

async function getSettings() {
  const settings = await prisma.storeSettings.findFirst()
  return settings
}

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  const storeName = settings?.storeName || 'LUXURY APPAREL'

  return (
    <>
      <CartSync />
      <Header storeName={storeName} />
      <main className="pb-24 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}