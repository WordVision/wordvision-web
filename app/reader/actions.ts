"use server"

import { v4 as uuidv4 } from 'uuid';
import { createClient } from "@/utils/supabase/server";
import { BookSelection, Visualization } from "./types";
import { FunctionsHttpError } from '@supabase/supabase-js';

/**
 * Generates an image based on the user's selected text and saves the details
 * as a highlight to the remote db
 *
 * @async
 * @function visualize
 * @param {string} userId - The ID of the user requesting the visualization.
 * @param {string} bookId - The ID of the book to which the selected passage belongs.
 * @param {{text: string, location: string(epubcfi)}} selection - An object detailing the user's selection.
 *
 * @returns
 * A promise that resolves to:
 * {data: Visualization, error: null} on success or
 * {data: null, error: {message: string}} on error
 */
export async function visualize(
  userId: string,
  bookId: string,
  selection: BookSelection
): Promise<{
  data: Visualization | null,
  error: any | null
}> {
  const supabase = await createClient();

  // Get book title
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("title")
    .eq("id", bookId)
    .single();

  if (bookError) {
    return {
      data: null,
      error: {
        message: bookError.message
      }
    }
  }

  // Generate image from prompt and get image url
  const image_id = uuidv4();
  console.debug("Visualization Data: ", {
    image_id,
    passage: selection.text,
    book_title: book.title
  })
  const {data: genImage, error: genImageError} = await supabase
    .functions
    .invoke<{img_url: string}>('generate-image', {
      body: {
        image_id,
        passage: selection.text,
        book_title: book.title
      },
    });

  if (!genImage || genImageError) {
    if (
      genImageError instanceof FunctionsHttpError &&
      genImageError.context.status === 429
    ) {
      const errCtx = genImageError.context;
      const errorData: { message: string; reset: number } = await errCtx.json();
      const resetDate = new Date(errorData.reset);
      return {
        data: null,
        error: {
          message: `${errorData.message}\n\nYour quota resets on ${resetDate.toLocaleString()}`
        }
      }
    }

    return {
      data: null,
      error: {
        message: "Error visualizing image"
      }
    }
  }

  // Insert new visualized highlight
  const { data: highlight, error: highlightError } = await supabase
    .from("highlights")
    .insert({
      user_id: userId,
      book_id: bookId,
      text: selection.text,
      location: selection.location,
      img_url: genImage.img_url,
      img_prompt: selection.text,
    })
    .select("id, text, location, img_url, img_prompt")
    .single();

  if (!highlight || highlightError) {
    return {
      data: null,
      error: {
        message: highlightError.message
      }
    }
  }

  return {
    data: highlight,
    error: null
  }
}


/**
 * Deletes an image visualization from the remote db and storage
 *
 * @async
 * @function deleteVisualization
 * @param {Visualization} v - details of the image to delete
 *
 * @returns
 * A promise that resolves to:
 * {error: null} on success or
 * {error: {message: string}} on error
 */
export async function deleteVisualization(v: Visualization): Promise<{error: { message: string } | null}> {
  const supabase = await createClient();

  // Get image path
  const imgPath = v.img_url.split("images/")[1];

  // Delete image
  const { error: deleteImageError } = await supabase
    .storage
    .from('images')
    .remove([imgPath])

  if (deleteImageError) {
    return {
      error: {
        message: deleteImageError.message
      }
    }
  }

  // Delete highlight
  const response = await supabase
    .from('highlights')
    .delete()
    .eq('id', v.id);

  if (response.error) {
    return {
      error: {
        message: response.error.message
      }
    }
  }

  return { error: null }
}


/**
 * Saves the user's location in the book to the database
 *
 * @async
 * @function saveReadingProgress
 * @param {string} userId - The ID of the user reading the book.
 * @param {string} bookId - The ID of the book to save location to.
 * @param {string | null} location - epubcfi of the user's current location in the book.
 *
 * @returns
 * A promise that resolves to:
 * {error: null} on success or
 * {error: {message: string}} on error
 */
export async function saveReadingProgress(
  userId: string,
  bookId: string,
  location: string | null
): Promise<{error: { message: string } | null }> {
  const supabase = await createClient();

  const {error: updateError} = await supabase
    .from("user_books")
    .update({
      current_location: location
    })
    .match({
      user_id: userId,
      book_id: bookId,
    })

  if (updateError) {
    console.error("Update Reading Progress Error: ", updateError)
    return {
      error: {
        message: updateError.message
      }
    }
  }

  return { error: null }
}

