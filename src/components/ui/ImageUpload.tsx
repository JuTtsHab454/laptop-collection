'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Star, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export interface UploadedImage {
  id?: string;
  url: string;
  alt?: string;
  isMain: boolean;
  sortOrder: number;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  maxImages = 5,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images total.`);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const newUploaded: UploadedImage[] = [...images];

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported format (JPEG, PNG, WebP).`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB.`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Upload failed');
        }

        const data = await res.json();
        const isFirst = newUploaded.length === 0;

        newUploaded.push({
          url: data.url,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          isMain: isFirst,
          sortOrder: newUploaded.length,
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
      }
    }

    setIsUploading(false);
    onChange(newUploaded);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSetMain = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const wasMain = images[index].isMain;
    const filtered = images.filter((_, i) => i !== index);

    // If main was removed, designate the first remaining as main
    if (wasMain && filtered.length > 0) {
      filtered[0].isMain = true;
    }

    const reindexed = filtered.map((img, i) => ({
      ...img,
      sortOrder: i,
    }));

    onChange(reindexed);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const reordered = copy.map((img, i) => ({
      ...img,
      sortOrder: i,
    }));
    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          images.length >= maxImages
            ? 'opacity-50 pointer-events-none border-gray-300'
            : 'border-surface-muted hover:border-accent-blue bg-surface-cream/40 dark:bg-brand-charcoal/40 hover:bg-surface-cream dark:hover:bg-brand-charcoal'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
              <p className="text-xs font-semibold text-accent-blue">Uploading images...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-accent-blue/10 rounded-full text-accent-blue">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                Click to browse images or drag and drop
              </p>
              <p className="text-[11px] text-gray-500">
                JPEG, PNG, WebP up to 5MB each (Max {maxImages} images. {images.length}/{maxImages} uploaded)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((img, index) => (
            <div
              key={index}
              className={`group relative rounded-xl border-2 overflow-hidden bg-gray-100 dark:bg-brand-charcoal aspect-square shadow-sm ${
                img.isMain ? 'border-accent-blue ring-2 ring-accent-blue/30' : 'border-surface-muted dark:border-brand-steel'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || 'Product preview'}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />

              {/* Main Badge */}
              {img.isMain && (
                <span className="absolute top-1.5 left-1.5 bg-accent-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
                  MAIN
                </span>
              )}

              {/* Hover Actions Toolbar */}
              <div className="absolute inset-0 bg-brand-navy/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetMain(index);
                    }}
                    title={img.isMain ? 'Currently main image' : 'Set as main image'}
                    className={`p-1 rounded-md transition-colors ${
                      img.isMain
                        ? 'text-accent-gold bg-accent-gold/20'
                        : 'text-white hover:text-accent-gold hover:bg-white/10'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    title="Remove image"
                    className="p-1 rounded-md text-red-400 hover:text-white hover:bg-red-500/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Move Left / Right buttons */}
                <div className="flex justify-center gap-2">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, 'left');
                      }}
                      className="p-1 rounded bg-white/20 text-white hover:bg-white/30"
                      title="Move earlier"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, 'right');
                      }}
                      className="p-1 rounded bg-white/20 text-white hover:bg-white/30"
                      title="Move later"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
