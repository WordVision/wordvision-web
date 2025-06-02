"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";

import FileUploader, { FileUploaderHandle } from "./FileUploader";
import HeaderLayout from "@/components/HeaderLayout";
import Avatar from "./Avatar";

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

const inter600 = Inter({ weight: "600", subsets: ["latin"] });
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
    <div className="flex flex-col h-screen">

      <HeaderLayout text="Discover">
        <Link href="/profile">
          <button className="rounded-full active:bg-neutral-50">
            <Avatar
              firstName={userData?.firstName!}
              lastName={userData?.lastName!}
              width={40}
              height={40}
              fontSize={16}
            />
          </button>
        </Link>
      </HeaderLayout>

      <div className="py-2 flex flex-col flex-1 gap-2">
        <h2
          style={inter600.style}
          className="px-4 text-2xl font-bold text-gray-800"
        >
          Featured
        </h2>

        <div className="px-[10px] grid grid-cols-2 flex-1 overflow-scroll sm:grid-cols-3 md:grid-cols-4">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/reader/${book.id}`}
              className="px-2 py-1 active:bg-neutral-100 rounded-lg"
            >
              <button className="w-full cursor-pointer rounded-lg">
                {book.cover_url ? (
                  <Image
                    src={book.cover_url}
                    alt={book.title}
                    width={300}
                    height={180}
                    className="w-full h-[180px] object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-[240px] bg-neutral-300 flex items-center justify-center text-gray-500 text-sm rounded-lg">
                    No Cover
                  </div>
                )}
                <h3
                  style={inter600.style}
                  className="mt-[10px] text-[14px] font-semibold text-[#2C3131] leading-snug break-words text-left"
                >
                  {book.title}
                </h3>
                <p
                  style={inter500.style}
                  className="text-[12px] text-[#747878] text-left truncate"
                >
                  {book.author}
                </p>
              </button>
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
    </div>
  );
}
