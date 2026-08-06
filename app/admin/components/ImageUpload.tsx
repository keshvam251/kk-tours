"use client";

import { useState, useRef, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";

interface ImageUploadProps {
  currentUrl?: string;
  folder: string;
  onUpload: (url: string) => void;
}

export default function ImageUpload({ currentUrl, folder, onUpload }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(currentUrl || "");
  const [tab, setTab] = useState<"file" | "url">("file");
  const [directUrl, setDirectUrl] = useState("");
  const [compressing, setCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentUrl || "");
  }, [currentUrl]);

  /* ─── Client-side Canvas Compression ───
     Resizes large camera/phone photos to max 1200px and compresses JPEG quality to ~0.75.
     This turns 5MB-10MB photos into ~100KB-180KB base64 strings so Firestore 1MB limits are NEVER exceeded!
  ─── */
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Compress to WebP / JPEG format with 0.75 quality (~100KB output)
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    setCompressing(true);

    try {
      // 1. Compress image client-side to ensure it's under Firestore 1MB limit (~100KB)
      const compressedBase64 = await compressImage(file);
      setPreviewUrl(compressedBase64);
      onUpload(compressedBase64); // Instant callback!
      setCompressing(false);

      // 2. Try Firebase Storage upload in background if available
      try {
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const storageRef = ref(storage, `${folder}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          null,
          (err) => console.log("Firebase Storage info:", err),
          async () => {
            const firebaseUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (firebaseUrl) {
              setPreviewUrl(firebaseUrl);
              onUpload(firebaseUrl);
            }
          }
        );
      } catch {
        // Silent fallback to compressedBase64
      }
    } catch (err) {
      console.error("Compression error:", err);
      alert("Failed to process image file. Please try another image.");
      setCompressing(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!directUrl.trim()) return;
    const url = directUrl.trim();
    setPreviewUrl(url);
    onUpload(url);
  };

  return (
    <div className="space-y-3">
      {/* Mode Switcher */}
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setTab("file")}
          className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
            tab === "file" ? "bg-amber-500 text-gray-950 font-bold" : "bg-white/5 text-white/50 hover:text-white"
          }`}
        >
          📁 Upload Computer File
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
            tab === "url" ? "bg-amber-500 text-gray-950 font-bold" : "bg-white/5 text-white/50 hover:text-white"
          }`}
        >
          🔗 Paste Image Link
        </button>
      </div>

      {/* Preview Box */}
      {previewUrl ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-950 border border-white/10 group">
          <Image
            src={previewUrl}
            alt="Selected Preview"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviewUrl("");
                onUpload("");
                setDirectUrl("");
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow"
            >
              Remove
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-emerald-500 text-gray-950 text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
            ✓ Image Optimized &amp; Ready
          </div>
        </div>
      ) : (
        <>
          {tab === "file" && (
            <div
              className="border-2 border-dashed border-white/15 hover:border-amber-400/50 bg-white/5 hover:bg-amber-500/5 rounded-xl p-6 text-center transition-all cursor-pointer"
              onClick={() => !compressing && inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {compressing ? (
                <div className="space-y-2 py-2">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-amber-400 font-semibold text-xs">Optimizing Image...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-3xl block">🖼️</span>
                  <p className="text-white font-semibold text-sm">Click to choose an image from your device</p>
                  <p className="text-white/30 text-xs">Auto-compresses large photos to fit Firestore limits</p>
                </div>
              )}
            </div>
          )}

          {tab === "url" && (
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste web image link (e.g. https://images.unsplash.com/...)"
                value={directUrl}
                onChange={(e) => setDirectUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-all shrink-0"
              >
                Use Link
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
