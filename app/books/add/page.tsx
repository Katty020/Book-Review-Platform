"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthGuard } from "@/components/auth-guard"
import { ArrowLeft, BookPlus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AddBookPage() {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [genre, setGenre] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!title.trim() || !author.trim() || !genre.trim()) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("books")
        .insert([
          {
            title: title.trim(),
            author: author.trim(),
            genre: genre.trim(),
            created_by: user?.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Book added successfully!",
        description: `"${title}" has been added to the platform.`,
      })

      router.push(`/books/${data.id}`)
    } catch (error: any) {
      console.error("Error adding book:", error)
      setError(error.message || "Failed to add book. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
           
            <div className="mb-8">
              <Button asChild variant="ghost" className="mb-4">
                <Link href="/books">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Books
                </Link>
              </Button>

              <div className="flex items-center gap-3 mb-2">
                <BookPlus className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Add New Book</h1>
              </div>
              <p className="text-muted-foreground">
                Share a great book with the community by adding it to our platform.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
                <CardDescription>Please provide the following information about the book.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="title">Book Title *</Label>
                    <Input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter the book title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Enter the author's name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre *</Label>
                    <Input
                      id="genre"
                      type="text"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      placeholder="e.g., Fiction, Mystery, Romance, Science Fiction"
                      required
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Add Book
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/books">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
