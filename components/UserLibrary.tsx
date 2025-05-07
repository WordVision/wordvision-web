//components/UserLibrary.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";

type Book = {
  id: string;
  title: string;
  author: string;
  cover_url?: string | null;
};

type Props = {
  user: {
    id: string;
    email?: string;
  };
};

export default function UserLibrary({ user }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserBooks = async () => {
      const supabase = createClient();

      const { data: userBooks, error: userBooksError } = await supabase
        .from("user_books")
        .select("book_id")
        .eq("user_id", user.id);

      if (userBooksError) {
        setError("Could not load your books.");
        setLoading(false);
        return;
      }

      const bookIds = userBooks.map((entry) => entry.book_id);

      if (bookIds.length === 0) {
        setBooks([]);
        setLoading(false);
        return;
      }

      const { data: booksData, error: booksError } = await supabase
        .from("books")
        .select("*")
        .in("id", bookIds);

      if (booksError) {
        setError("Could not load books.");
        setLoading(false);
        return;
      }

      setBooks(booksData || []);
      setLoading(false);
    };

    fetchUserBooks();
  }, [user.id]);

  if (loading)
    return <div className="text-center py-8">Loading your library...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  if (books.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No books found in your library.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
        {books.map((book) => (
          <Link key={book.id} href={`/book/${book.id}`}>
            <div className="flex flex-col items-center cursor-pointer">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={book.title}
                  width={120}
                  height={180}
                  className="rounded-md object-cover mb-3"
                />
              ) : (
                <div className="w-[120px] h-[180px] bg-gray-100 text-center flex flex-col justify-center items-center rounded-md mb-3 p-2">
                  <p className="font-semibold text-black text-sm">
                    {book.title}
                  </p>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
