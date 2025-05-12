"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

// TypeScript interface for Book data
interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  publishDate: string;
  publisher: string;
  pages: number;
  isbn: string;
  language: string;
  genre: string[];
  rating: number;
  description: string;
}

// Mock book data (in a real app, this would come from an API)
const sampleBook: Book = {
  id: "1",
  title: "The Midnight Library",
  author: "Matt Haig",
  coverImage: "/api/placeholder/300/450",
  publishDate: "2020-08-13",
  publisher: "Canongate Books",
  pages: 304,
  isbn: "978-1786892720",
  language: "English",
  genre: ["Fiction", "Fantasy", "Contemporary"],
  rating: 4.2,
  description:
    "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
};

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow-400 text-xl">
          {i < fullStars ? "★" : i === fullStars && hasHalfStar ? "½" : "☆"}
        </span>
      ))}
      <span className="ml-2 text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function BookDetailsPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate API fetch
  useEffect(() => {
    // In a real app, this would be an API call like:
    // fetch(`/api/books/${bookId}`).then(res => res.json()).then(data => setBook(data))
    setTimeout(() => {
      setBook(sampleBook);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!book) {
    return <div className="text-center p-8 text-red-500">Book not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Book Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Cover Image */}
            <div className="md:w-1/3 p-6 flex justify-center">
              <Image
                src={book.coverImage}
                alt={`${book.title} cover`}
                width={300}
                height={450}
                className="w-full object-cover rounded shadow-lg"
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {book.genre.join(" • ")}
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 leading-tight">
              {book.title}
            </h1>
            <h2 className="text-xl text-gray-600">by {book.author}</h2>

            <div className="mt-4">
              <StarRating rating={book.rating} />
            </div>

            <div className="mt-6 text-gray-600 leading-relaxed">
              {book.description}
            </div>

            {/* Book Details Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex">
                <span className="font-semibold w-24">Publisher:</span>
                <span>{book.publisher}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24">Published:</span>
                <span>{new Date(book.publishDate).toLocaleDateString()}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24">ISBN:</span>
                <span>{book.isbn}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24">Pages:</span>
                <span>{book.pages}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24">Language:</span>
                <span>{book.language}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition duration-200">
                Add to Reading List
              </button>
              <button className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition duration-200">
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Reader Reviews</h3>
        <div className="text-gray-500 italic">
          Reviews would be loaded and displayed here
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Similar Books</h3>
        <div className="text-gray-500 italic">
          Similar book recommendations would be displayed here
        </div>
      </div>
    </div>
  );
}
