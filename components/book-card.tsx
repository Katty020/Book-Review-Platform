"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarRating } from "./star-rating"
import { Book, MessageCircle } from "lucide-react"
import Link from "next/link"

interface BookCardProps {
  book: {
    id: string
    title: string
    author: string
    genre: string
    average_rating: number
    review_count: number
  }
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 mb-1">{book.title}</CardTitle>
            <p className="text-sm text-muted-foreground">by {book.author}</p>
          </div>
          <Book className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <Badge variant="secondary" className="mb-3">
          {book.genre}
        </Badge>

        <div className="space-y-2">
          <StarRating rating={book.average_rating} size="sm" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span>
              {book.review_count} review{book.review_count !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/books/${book.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
