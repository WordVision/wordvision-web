// components/FileUploader.tsx
"use client";

import {
  ChangeEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createClient } from "@/utils/supabase/client";
import ePub from "epubjs";

export type FileUploaderHandle = {
  openFilePicker: () => void;
};

type Props = {
  user: any;
  onUploadComplete: () => void;
};

const FileUploader = forwardRef<FileUploaderHandle, Props>(
  ({ user, onUploadComplete }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    useImperativeHandle(ref, () => ({
      openFilePicker: () => {
        fileInputRef.current?.click();
      },
    }));

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      if (!file.name.toLowerCase().endsWith(".epub")) {
        alert("Only .epub files are supported.");
        return;
      }

      const filePath = `${Date.now()}-${file.name}`;
      const supabase = createClient();

      setUploading(true);

      const { error: uploadError } = await supabase.storage
        .from("books")
        .upload(filePath, file);

      if (uploadError) {
        alert(`Upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      await saveMetadata(user, file, filePath);
      setUploading(false);
      onUploadComplete();
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
          return;
        }

        const bookId = data.id;

        const { error: linkError } = await supabase.from("user_books").insert({
          user_id: user.id,
          book_id: bookId,
        });

        if (linkError) {
          console.error("Link error:", linkError.message);
        }
      } catch (err) {
        console.error("Metadata extraction or DB error:", err);
      }
    };

    return (
      <>
        <input
          type="file"
          hidden
          ref={fileInputRef}
          accept=".epub"
          onChange={handleFileChange}
        />
      </>
    );
  }
);

FileUploader.displayName = "FileUploader";
export default FileUploader;
