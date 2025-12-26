import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SettingsForm from '@/components/admin/settings/SettingsForm'

export const metadata = {
    title: 'Settings',
}

async function getSettings() {
    let settings = await prisma.storeSettings.findFirst()

    if (!settings) {
        // Create default settings if none exist
        settings = await prisma.storeSettings.create({
            data: {
                storeName: 'Luxury Apparel',
                storeEmail: 'hello@luxuryapparel.com',
                supportEmail: 'support@luxuryapparel.com',
            },
        })
    }

    return settings
}

export default async function AdminSettingsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
        redirect('/')
    }

    const settings = await getSettings()

    return (
        <div className="container-luxury max-w-4xl">
            <h1 className="font-serif text-4xl mb-8">Settings</h1>
            <SettingsForm initialData={settings} />
        </div>
    )
}
