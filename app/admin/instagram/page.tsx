'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

interface InstagramPost {
    id: string
    imageUrl: string
    link: string | null
    order: number
}

export default function InstagramPage() {
    const [posts, setPosts] = useState<InstagramPost[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newPost, setNewPost] = useState({ imageUrl: '', link: '', order: 0 })

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/admin/instagram')
            const data = await response.json()
            setPosts(data)
        } catch (error) {
            toast.error('Failed to fetch posts')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/admin/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost),
            })
            if (!response.ok) throw new Error()
            toast.success('Post created successfully')
            setIsAdding(false)
            setNewPost({ imageUrl: '', link: '', order: 0 })
            fetchPosts()
        } catch (error) {
            toast.error('Failed to create post')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return
        try {
            const response = await fetch(`/api/admin/instagram?id=${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) throw new Error()
            toast.success('Post deleted')
            fetchPosts()
        } catch (error) {
            toast.error('Failed to delete post')
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-serif mb-2">@LuxuryApparel</h1>
                    <p className="text-soft-gray">Manage the Instagram feed on the homepage</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-charcoal text-ivory px-4 py-2 hover:bg-charcoal/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Post
                </button>
            </div>

            {isAdding && (
                <div className="bg-stone/10 p-6 mb-8 border border-charcoal/10">
                    <h2 className="font-serif text-lg mb-4">Add New Post</h2>
                    <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest">Image URL</label>
                            <input
                                type="url"
                                required
                                className="w-full bg-ivory border border-charcoal/20 p-2 focus:border-charcoal outline-none"
                                value={newPost.imageUrl}
                                onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                                placeholder="https://images.unsplash.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest">Link (Optional)</label>
                            <input
                                type="url"
                                className="w-full bg-ivory border border-charcoal/20 p-2 focus:border-charcoal outline-none"
                                value={newPost.link}
                                onChange={(e) => setNewPost({ ...newPost, link: e.target.value })}
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div className="flex gap-4 items-end">
                            <button
                                type="submit"
                                className="bg-gold text-ivory px-6 py-2 hover:bg-gold/90 transition-colors"
                            >
                                Create Post
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
            ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-stone/5 border border-dashed border-charcoal/20">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-charcoal/10" />
                    <p className="text-soft-gray">No posts added yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="group relative bg-ivory border border-charcoal/10 overflow-hidden">
                            <div className="aspect-square relative">
                                <Image
                                    src={post.imageUrl}
                                    alt="Post preview"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                {post.link && (
                                    <a
                                        href={post.link}
                                        target="_blank"
                                        className="flex items-center gap-2 text-xs text-soft-gray hover:text-charcoal transition-colors truncate"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        Visit Link
                                    </a>
                                )}
                                <div className="mt-2 text-xs text-soft-gray italic">
                                    Order: {post.order}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
