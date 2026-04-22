"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUploadComplete: (path: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  previewUrl?: string | null;
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  accept = "image/*",
  maxSizeMB = 5,
  label = "Upload Image",
  previewUrl,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      const msg = `File too large. Max ${maxSizeMB}MB allowed.`;
      setError(msg);
      onUploadError?.(msg);
      return;
    }

    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError(null);

    // Upload
    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Wait a moment to show 100% progress
      setTimeout(() => {
        setIsUploading(false);
        onUploadComplete(data.path); // Backend returns { path, fullUrl }
      }, 300);
    } catch (err) {
      setIsUploading(false);
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      onUploadError?.(msg);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <div className="relative aspect-video w-full">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
              <Progress value={progress} className="w-32" />
              <p className="text-sm text-white">Uploading... {progress}%</p>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 cursor-pointer transition-colors hover:bg-muted hover:border-[#C14FE6]",
            error && "border-red-300 bg-red-50"
          )}
        >
          <div className="w-12 h-12 rounded-full bg-[#C14FE6]/10 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-[#C14FE6]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}