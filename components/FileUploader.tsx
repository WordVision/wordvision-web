//components/FileUploader.tsx
"use client";

import { ChangeEvent, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import ePub from "epubjs";

export default function FileUploader({ user }: { user: any }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileMeta, setUploadedFileMeta] = useState<{
    file: File;
    filePath: string;
  } | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Filter for .epub files only
      const epubFiles = selectedFiles.filter((file) =>
        file.name.toLowerCase().endsWith(".epub")
      );

      if (epubFiles.length === 0) {
        setMessage("Please select only .epub files.");
        return;
      }

      setFiles(epubFiles);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setMessage("");

    const supabase = createClient();

    for (const file of files) {
      const filePath = `${Date.now()}-${file.name}`; // use unique path
      const { error: uploadError } = await supabase.storage
        .from("books")
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        setMessage(`Error uploading ${file.name}: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      // Immediately save metadata using same UUID
      await saveMetadata(user, file, filePath);
    }

    setMessage("EPUB files uploaded and saved!");
    setFiles([]);
    setUploading(false);
  };

  const saveMetadata = async (user: any, file: File, filePath: string) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const book = ePub(arrayBuffer);
      const metadata = await book.loaded.metadata;

      const title = metadata.title || "Untitled";
      const author = metadata.creator || "Unknown Author";

      const supabase = createClient();

      const { data, error: insertError } = await supabase
        .from("books")
        .insert({
          title,
          author,
          filename: file.name,
          img_url: `https://szlxwnautzzqyrsnlenr.supabase.co/storage/v1/object/public/books/${filePath}`,
        })
        .select("id")
        .single();

      if (insertError || !data) {
        console.error("Insert error:", insertError?.message);
        setMessage(`Book insert failed for ${file.name}`);
        return;
      }

      const bookId = data.id;

      const { error: linkError } = await supabase.from("user_books").insert({
        user_id: user.id,
        book_id: bookId,
      });

      if (linkError) {
        console.error("Link error:", linkError.message);
        setMessage(`Book inserted but user_books failed for ${file.name}`);
      }
    } catch (err) {
      console.error("Metadata extraction or DB error:", err);
      setMessage(`Failed to save metadata for ${file.name}`);
    }
  };

  return (
    <div className="bg-slate-500 min-h-screen flex justify-center items-center flex-col gap-8">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        hidden
        accept=".epub" // HTML-level filter
        onChange={handleFileChange}
      />
      <button
        className="bg-slate-600 py-2 w-40 rounded-lg"
        onClick={() => fileInputRef.current?.click()}
      >
        Select EPUB files
      </button>

      <ul className="text-white">
        {files.map((file, index) => (
          <li key={index}>📄 {file.name}</li>
        ))}
      </ul>

      <button
        className="bg-slate-600 py-2 w-40 rounded-lg disabled:opacity-50"
        onClick={handleUpload}
        disabled={uploading || !files.length}
      >
        {uploading ? "Uploading..." : "Upload EPUBs"}
      </button>

      <p className="mt-2 text-white">Logged in as: {user.email}</p>
      {message && <p className="text-yellow-300">{message}</p>}
    </div>
  );
}
