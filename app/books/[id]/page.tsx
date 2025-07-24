"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StarRating } from "@/components/star-rating"
import { AuthGuard } from "@/components/auth-guard"
import { ArrowLeft, BookOpen, MessageCircle, User, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Book {
  id: string
  title: string
  author: string
  genre: string
  created_at: string
  average_rating: number
  review_count: number
}

interface Review {
  id: string
  review_text: string
  rating: number
  reviewer_name: string
  created_at: string
  reviewer_id: string
}

export default function BookDetailPage() {
  const params = useParams()
  const bookId = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [error, setError] = useState("")
  const [userReview, setUserReview] = useState<Review | null>(null)

  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (bookId) {
      fetchBookDetails()
      fetchReviews()
    }
  }, [bookId])

  const fetchBookDetails = async () => {
    try {
      const { data, error } = await supabase.from("books_with_ratings").select("*").eq("id", bookId).single()

      if (error) throw error
      setBook(data)
    } catch (error) {
      console.error("Error fetching book:", error)
      toast({
        title: "Error",
        description: "Failed to fetch book details.",
        variant: "destructive",
      })
    }
  }

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("book_id", bookId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setReviews(data || [])

      if (user) {
        const existingReview = data?.find((review) => review.reviewer_id === user.id)
        setUserReview(existingReview || null)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setReviewLoading(true)
    setError("")

    if (!reviewText.trim()) {
      setError("Please write a review")
      setReviewLoading(false)
      return
    }

    if (rating === 0) {
      setError("Please select a rating")
      setReviewLoading(false)
      return
    }

    try {
      const reviewData = {
        book_id: bookId,
        review_text: reviewText.trim(),
        rating,
        reviewer_id: user?.id,
        reviewer_name: user?.user_metadata?.full_name || user?.email || "Anonymous",
      }

      if (userReview) {
        // Update existing review
        const { error } = await supabase.from("reviews").update(reviewData).eq("id", userReview.id)

        if (error) throw error

        toast({
          title: "Review updated!",
          description: "Your review has been updated successfully.",
        })
      } else {
        // Create new review
        const { error } = await supabase.from("reviews").insert([reviewData])

        if (error) throw error

        toast({
          title: "Review added!",
          description: "Thank you for sharing your thoughts!",
        })
      }

      setReviewText("")
      setRating(0)
      fetchBookDetails() // Refresh to get updated average rating
      fetchReviews() // Refresh reviews list
    } catch (error: any) {
      console.error("Error submitting review:", error)
      setError(error.message || "Failed to submit review. Please try again.")
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Book not found</h3>
            <p className="text-muted-foreground mb-4">The book you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/books">Back to Books</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            <Button asChild variant="ghost" className="mb-6">
              <Link href="/books">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Books
              </Link>
            </Button>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{book.title}</CardTitle>
                    <CardDescription className="text-lg mb-4">by {book.author}</CardDescription>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary" className="text-sm">
                        {book.genre}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Added {new Date(book.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <StarRating rating={book.average_rating} size="lg" />
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="w-4 h-4" />
                        <span>
                          {book.review_count} review{book.review_count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <BookOpen className="w-16 h-16 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
           
              <Card>
                <CardHeader>
                  <CardTitle>{userReview ? "Update Your Review" : "Write a Review"}</CardTitle>
                  <CardDescription>
                    {userReview
                      ? "You can update your existing review and rating."
                      : "Share your thoughts about this book with other readers."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label>Your Rating</Label>
                      <StarRating rating={rating} interactive onRatingChange={setRating} size="lg" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="review">Your Review</Label>
                      <Textarea
                        id="review"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="What did you think about this book? Share your thoughts..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={reviewLoading} className="w-full">
                      {reviewLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {userReview ? "Update Review" : "Submit Review"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reviews ({reviews.length})</CardTitle>
                  <CardDescription>See what other readers think about this book.</CardDescription>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this book!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review, index) => (
                        <div key={review.id}>
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-muted rounded-full">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{review.reviewer_name}</span>
                                <StarRating rating={review.rating} size="sm" />
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-sm leading-relaxed">{review.review_text}</p>
                            </div>
                          </div>
                          {index < reviews.length - 1 && <Separator className="mt-6" />}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
