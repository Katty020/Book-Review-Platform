import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          genre: string
          created_at: string
          created_by: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          genre: string
          created_by?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          genre?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          book_id: string
          review_text: string
          rating: number
          reviewer_id: string
          reviewer_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          review_text: string
          rating: number
          reviewer_id?: string
          reviewer_name?: string
        }
        Update: {
          id?: string
          book_id?: string
          review_text?: string
          rating?: number
          updated_at?: string
        }
      }
    }
    Views: {
      books_with_ratings: {
        Row: {
          id: string
          title: string
          author: string
          genre: string
          created_at: string
          created_by: string
          updated_at: string
          average_rating: number
          review_count: number
        }
      }
    }
  }
}
