import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const links = await prisma.socialLink.findMany({
            orderBy: { createdAt: 'asc' },
        })
        return NextResponse.json(links)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        const link = await prisma.socialLink.create({
            data: {
                platform: data.platform,
                url: data.url,
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        })
        return NextResponse.json(link, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create social link' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id, ...data } = await request.json()
        const link = await prisma.socialLink.update({
            where: { id },
            data,
        })
        return NextResponse.json(link)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update social link' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

        await prisma.socialLink.delete({
            where: { id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete social link' }, { status: 500 })
    }
}
