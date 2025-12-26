'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Share2, ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface SocialLink {
    id: string
    platform: string
    url: string
    isActive: boolean
}

const PLATFORMS = ['Instagram', 'Facebook', 'Twitter', 'TikTok', 'Pinterest', 'LinkedIn']

export default function SocialPage() {
    const [links, setLinks] = useState<SocialLink[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newLink, setNewLink] = useState({ platform: 'Instagram', url: '', isActive: true })

    useEffect(() => {
        fetchLinks()
    }, [])

    const fetchLinks = async () => {
        try {
            const response = await fetch('/api/admin/social')
            const data = await response.json()
            setLinks(data)
        } catch (error) {
            toast.error('Failed to fetch social links')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/admin/social', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLink),
            })
            if (!response.ok) throw new Error()
            toast.success('Social link added')
            setIsAdding(false)
            setNewLink({ platform: 'Instagram', url: '', isActive: true })
            fetchLinks()
        } catch (error) {
            toast.error('Failed to add social link')
        }
    }

    const handleToggle = async (link: SocialLink) => {
        try {
            const response = await fetch('/api/admin/social', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: link.id, isActive: !link.isActive }),
            })
            if (!response.ok) throw new Error()
            toast.success(`Link ${!link.isActive ? 'enabled' : 'disabled'}`)
            fetchLinks()
        } catch (error) {
            toast.error('Failed to toggle status')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this link?')) return
        try {
            const response = await fetch(`/api/admin/social?id=${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) throw new Error()
            toast.success('Link deleted')
            fetchLinks()
        } catch (error) {
            toast.error('Failed to delete link')
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-serif mb-2">Social Links</h1>
                    <p className="text-soft-gray">Manage social media icons in the footer</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-charcoal text-ivory px-4 py-2 hover:bg-charcoal/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Link
                </button>
            </div>

            {isAdding && (
                <div className="bg-stone/10 p-6 mb-8 border border-charcoal/10">
                    <h2 className="font-serif text-lg mb-4">Add New Social Link</h2>
                    <form onSubmit={handleCreate} className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest">Platform</label>
                            <select
                                className="w-full bg-ivory border border-charcoal/20 p-2 focus:border-charcoal outline-none"
                                value={newLink.platform}
                                onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                            >
                                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest">URL</label>
                            <input
                                type="url"
                                required
                                className="w-full bg-ivory border border-charcoal/20 p-2 focus:border-charcoal outline-none"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div className="flex gap-4 items-end">
                            <button
                                type="submit"
                                className="bg-gold text-ivory px-6 py-2 hover:bg-gold/90 transition-colors"
                            >
                                Add Link
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="text-soft-gray px-6 py-2 hover:text-charcoal transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : links.length === 0 ? (
                <div className="text-center py-12 bg-stone/5 border border-dashed border-charcoal/20">
                    <Share2 className="h-12 w-12 mx-auto mb-4 text-charcoal/10" />
                    <p className="text-soft-gray">No social links added yet</p>
                </div>
            ) : (
                <div className="bg-ivory border border-charcoal/10 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-charcoal/10 bg-stone/5">
                                <th className="px-6 py-4 text-xs uppercase tracking-widest">Platform</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-widest">URL</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal/5">
                            {links.map((link) => (
                                <tr key={link.id} className="hover:bg-stone/5 transition-colors">
                                    <td className="px-6 py-4 font-medium">{link.platform}</td>
                                    <td className="px-6 py-4 text-sm text-soft-gray truncate max-w-xs">
                                        <a href={link.url} target="_blank" className="hover:text-charcoal transition-colors">
                                            {link.url}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggle(link)}
                                            className={`flex items-center gap-2 text-xs uppercase tracking-widest ${link.isActive ? 'text-green-600' : 'text-gray-400'}`}
                                        >
                                            {link.isActive ? (
                                                <>
                                                    <ToggleRight className="h-5 w-5" />
                                                    Enabled
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleLeft className="h-5 w-5" />
                                                    Disabled
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(link.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 transition-colors rounded"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
