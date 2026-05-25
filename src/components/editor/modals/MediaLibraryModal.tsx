"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NextImage from "next/image";
import {
  X,
  Upload,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  HardDrive,
} from "lucide-react";
import type { MediaFile } from "@/types/editor";

interface Props {
  isOpen: boolean;
  files: MediaFile[];
  isLoading: boolean;
  isUploading: boolean;
  deletingName: string | null;
  onClose: () => void;
  onSelect: (url: string) => void;
  onUpload: (file: File) => void;
  onDelete: (fileName: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function MediaLibraryModal({
  isOpen,
  files,
  isLoading,
  isUploading,
  deletingName,
  onClose,
  onSelect,
  onUpload,
  onDelete,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onUpload(file);
      }
    },
    [onUpload],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
      e.target.value = "";
    },
    [onUpload],
  );

  const handleConfirmSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      setSelectedUrl(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-4 sm:inset-8 lg:inset-16 z-50 flex flex-col bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <ImageIcon size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Media Library
                  </h2>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[9px] font-bold text-slate-400">
                      {files.length} files
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                      <HardDrive size={8} />
                      {formatSize(totalSize)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative hidden sm:block">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search files..."
                    className="w-48 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scroll relative"
            >
              {isDragging && (
                <div className="absolute inset-4 border-2 border-dashed border-indigo-500 rounded-3xl bg-indigo-50/80 dark:bg-indigo-500/10 flex items-center justify-center z-10 backdrop-blur-sm">
                  <div className="text-center">
                    <Upload
                      size={40}
                      className="text-indigo-500 mx-auto mb-3"
                    />
                    <p className="text-sm font-black text-indigo-600 uppercase">
                      Drop image here
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-4 sm:mb-6">
                <button
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full py-6 sm:py-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all flex flex-col items-center gap-2 group disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2
                      className="animate-spin text-indigo-500"
                      size={28}
                    />
                  ) : (
                    <Upload
                      size={28}
                      className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                    />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors">
                    {isUploading ? "Uploading..." : "Upload New Image"}
                  </span>
                  <span className="text-[8px] text-slate-300">
                    PNG, JPG, WEBP up to 5MB
                  </span>
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-indigo-500" size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Loading media...
                  </span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <ImageIcon size={48} className="text-slate-200" />
                  <p className="text-xs font-bold text-slate-400">
                    {search
                      ? "No files match your search"
                      : "No files uploaded yet"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {filtered.map((file) => (
                    <div
                      key={file.name}
                      onClick={() => setSelectedUrl(file.url)}
                      className={`group relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all hover:shadow-xl ${
                        selectedUrl === file.url
                          ? "border-indigo-500 ring-4 ring-indigo-500/20 scale-[0.97]"
                          : "border-transparent hover:border-slate-200 dark:hover:border-white/10"
                      }`}
                    >
                      <NextImage
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />

                      {selectedUrl === file.url && (
                        <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                          <CheckCircle2
                            size={32}
                            className="text-white drop-shadow-lg"
                          />
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/30 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-[9px] font-bold text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-[8px] text-white/60">
                          {formatSize(file.size)}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(file.name);
                        }}
                        disabled={deletingName === file.name}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 disabled:opacity-50 shadow-lg"
                      >
                        {deletingName === file.name ? (
                          <Loader2 className="animate-spin" size={12} />
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 sm:p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
              <p className="text-[9px] font-bold text-slate-400">
                {selectedUrl ? "1 file selected" : "Click an image to select"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSelect}
                  disabled={!selectedUrl}
                  className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all"
                >
                  Use Selected
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
