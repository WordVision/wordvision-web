import { createClient } from "@/utils/supabase/client";
import { Visualization } from "../types";


export async function getBookHighlights(bookId: string): Promise<Visualization[]> {
  const supabase = createClient();

  // Get book highlights
  const { data: bookHighlights, error: bookHighlightsError } = await supabase
    .from("highlights")
    .select("id, text, location, img_url, img_prompt")
    .eq("book_id", bookId);

  if (bookHighlightsError) {
    console.error("Could not fetch book highlights: ", bookHighlights)
    throw bookHighlightsError;
  }

  console.debug({bookHighlights});

  return bookHighlights
}
