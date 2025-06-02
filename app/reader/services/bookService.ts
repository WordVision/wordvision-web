import { createClient } from "@/utils/supabase/client";
import { BookDetails } from "../types";


/**
 * Gets the details for a given book
 *
 * @async
 * @function getBookDetails
 * @param {string} bookId - The ID of the book to get details from.
 *
 * @returns
 * A promise that resolves to the books basic details (title, filename)
 */
export async function getBookDetails(bookId: string): Promise<BookDetails> {
  const supabase = createClient();

  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("title, filename")
    .eq("id", bookId)
    .single();

  if (bookError) {
    throw new Error(`Could not fetch book details for id: ${bookId}`, {
      cause: bookError
    });
  }

  return book;
}


/**
 * Gets the user's last read location in the book from remote
 *
 * @async
 * @function getUserLastLocationInBook
 * @param {string} userId - The ID of the user who owns the book.
 * @param {string} bookId - The ID of the book the user wants to read.
 *
 * @returns
 * A promise that resolves to an epubcfi location in the book (string)
 */
export async function getUserLastLocationInBook(userId: string, bookId: string): Promise<string | null> {
  const supabase = createClient();

  const {data: userBook, error: userBookError} = await supabase
    .from("user_books")
    .select("last_location")
    .match({
      user_id: userId,
      book_id: bookId,
    })
    .single();

  if (userBookError) {
    throw new Error("Error retrieving book's last location", {
      cause: userBookError
    })
  }

  return userBook.last_location;
}


/**
 * Downloads the file contents of a file from supabase storage.
 *
 * @async
 * @function downloadFile
 * @param {string} bucket - The name of the bucket where the file is located
 * @param {string} filename - The name of the file to download
 *
 * @returns
 * A promise that resolves to the binary data of the downloaded file (ArrayBuffer)
 */
export async function downloadFile(bucket: string, filename: string): Promise<ArrayBuffer> {
  const supabase = createClient();

  // Create signed url
  const { data: urlData, error: urlError } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(filename, 3600);

  if (urlError) {
    throw new Error(`Could not create signed url for: ${filename}`, {
      cause: urlError,
    })
  }

  // Fetch data from url
  const res = await fetch(urlData.signedUrl);
  const blob = await res.blob();

  return await blob.arrayBuffer();
}
