"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import FileUploader, { FileUploaderHandle } from "./FileUploader";

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

  const uploaderRef = useRef<FileUploaderHandle>(null);

  const fetchUserBooks = async () => {
    const supabase = createClient();

    const { data: userBooks } = await supabase
      .from("user_books")
      .select("book_id")
      .eq("user_id", user.id);

    const bookIds = userBooks?.map((entry) => entry.book_id) || [];

    if (bookIds.length === 0) {
      setBooks([]);
      setLoading(false);
      return;
    }

    const { data: booksData } = await supabase
      .from("books")
      .select("*")
      .in("id", bookIds);

    setBooks(booksData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserBooks();
  }, [user.id]);

  if (loading)
    return <div className="text-center py-8">Loading your library...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

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

      {/* Floating + Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-blue-700 text-3xl flex items-center justify-center"
        aria-label="Add Book"
        onClick={() => uploaderRef.current?.openFilePicker()}
      >
        +
      </button>

      {/* Hidden uploader with callback */}
      <FileUploader
        ref={uploaderRef}
        user={user}
        onUploadComplete={() => {
          setLoading(true); // Optional: show loading UI
          fetchUserBooks();
        }}
      />
    </div>
  );
}
