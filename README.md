# 📚 Book Review Platform

A full-stack web application built with **React.js**, **TypeScript**, **TailwindCSS**, **radix_ui** and **Supabase (POSTGRE_SQL)** that allows users to:

- 📘 Add new books
- 🔍 View a list of all books with filters and pagination
- ✍️ Write reviews for books
- ⭐ Rate books (1 to 5 stars)
- 📊 View average rating per book

---

## 🚀 Features

### ✅ Books
- Add new books (title, author, genre)
- View paginated list of books
- Filter by genre and/or author
- Sort books by:
  - Average rating
  - Date added

### ✅ Reviews
- Write text reviews with a rating (1 to 5 stars)
- View all reviews for a book
- See average rating and total reviews for each book

### ✅ Authentication
- Signup / Login using **Supabase Auth**
- Only authenticated users can:
  - Add books
  - Write reviews

---
 ### ✨ Bonus Features
- ✅ Visual stars for rating display

- ✅ Form validation with helpful error messages

- ✅ Responsive and modern UI (TailwindCSS)

- ✅ Secure RLS policies (Supabase)

- ✅ Unique reviews (only one review per user per book)

---

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [React Hook Form](https://react-hook-form.com/), [Lucide Icons](https://lucide.dev/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Database**: Supabase (PostgreSQL)
- **API Calls**: Supabase client

---

## 🧠 Architecture

- `books` table with `title`, `author`, `genre`, and `created_by`
- `reviews` table linked to books and users
- RLS policies enforced to protect data
- Views for calculating average ratings

---

## 🔐 Setup Authentication

1. Go to your Supabase project.
2. Enable **Email/Password** auth under `Authentication > Providers`.
3. Get your **API URL** and **Anon Public Key** from `Settings > API`.

## ⚙️ Getting Started

```bash
git clone https://github.com/your-username/book-review-platform.git
cd book-review-platform

npm install
# or
yarn install

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

npm run dev
# or
yarn dev
