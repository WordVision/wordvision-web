"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Inter } from "next/font/google";

import FileUploader, { FileUploaderHandle } from "./FileUploader";
import HeaderLayout from "@/components/HeaderLayout";

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

const inter500 = Inter({ weight: "500", subsets: ["latin"] });

export default function UserLibrary({ user }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const uploaderRef = useRef<FileUploaderHandle>(null);

  const supabase = createClient();
  const [userData, setUserData] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  }>();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserData({
          email: data.user.email ?? "",
          firstName: data.user.user_metadata.first_name,
          lastName: data.user.user_metadata.last_name,
          birthDate: data.user.user_metadata.birthdate,
        });
      }
    };
    fetchUserData();
  }, [supabase]);

  const fetchUserBooks = useCallback(async () => {
    const { data: userBooks, error: userBooksError } = await supabase
      .from("user_books")
      .select("book_id")
      .eq("user_id", user.id);

    if (userBooksError) {
      setError("Could not fetch user books.");
      setLoading(false);
      return;
    }

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
  }, [user.id]);

  useEffect(() => {
    fetchUserBooks();
  }, [fetchUserBooks, user.id]);

  if (loading)
    return <div className="text-center py-8">Loading your library...</div>;

  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <HeaderLayout text="Discover">
        <Link href="/profile">
          <button className="p-3 rounded-full active:bg-neutral-50">
            <div className="pt-1 pb-2 px-2 flex flex-col items-center gap-2 border-b">
              <div
                style={inter500.style}
                className="w-[72px] h-[72px] text-2xl flex justify-center items-center rounded-full shadow-[inset_0px_-8px_16px_0px_rgba(0,0,0,0.1)]"
              >
                {userData.firstName[0] + userData.lastName[0]}
              </div>
            </div>
          </button>
        </Link>
      </HeaderLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {books.map((book) => (
          <Link key={book.id} href={`/reader/${book.id}`}>
            <div className="cursor-pointer">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={book.title}
                  width={300}
                  height={180}
                  className="w-full h-[180px] object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-[180px] bg-gray-100 flex items-center justify-center text-gray-500 text-sm rounded-lg">
                  No Cover
                </div>
              )}
              <h3 className="mt-1 text-[15px] font-semibold text-gray-900 leading-snug break-words">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 truncate">{book.author}</p>
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

      <button
        className="py-2 px-4 fixed bottom-6 left-6 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 text-xl flex items-center justify-center"
        aria-label="Sign Out"
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          return redirect("/login");
        }}
      >
        sign out
      </button>
    </div>
  );
}
