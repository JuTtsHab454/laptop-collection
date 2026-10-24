'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  alt?: string | null;
  isMain?: boolean;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  title: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Fallback placeholder image if none uploaded
  const displayImages =
    images.length > 0
      ? images
      : [
          {
            id: 'placeholder',
            url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
            alt: title,
          },
        ];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* Main Image Frame with Ambient Amber Glow */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="group relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#131929] via-[#0D121F] to-[#080B12] border border-white/[0.08] hover:border-amber-500/40 shadow-2xl cursor-zoom-in transition-all duration-300"
      >
        {/* Radial Gold Backlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_70%)] pointer-events-none" />

        <Image
          src={currentImage.url}
          alt={currentImage.alt || title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-contain p-6 transition-all duration-500 group-hover:scale-105 drop-shadow-2xl"
        />

        {/* Zoom Overlay Indicator */}
        <div className="absolute bottom-3.5 right-3.5 p-2 rounded-xl bg-[#090D17]/80 border border-white/[0.1] text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-md">
          <Maximize2 className="w-4 h-4" />
        </div>

        {/* Carousel arrows if multiple */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#090D17]/80 border border-white/[0.08] text-amber-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500 hover:text-black backdrop-blur-md shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#090D17]/80 border border-white/[0.08] text-amber-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500 hover:text-black backdrop-blur-md shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#0D121F] border-2 transition-all p-1.5 ${
                selectedIndex === idx
                  ? 'border-amber-400 ring-2 ring-amber-400/25 shadow-lg shadow-amber-500/20 scale-105'
                  : 'border-white/[0.08] opacity-60 hover:opacity-100 hover:border-amber-500/40'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${title} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Fullscreen Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6 text-amber-400" />
          </button>

          {/* Previous / Next buttons */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-amber-500 hover:text-black transition-all z-50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-amber-500 hover:text-black transition-all z-50"
                aria-label="Next image"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-4xl h-[75vh]">
            <Image
              src={currentImage.url}
              alt={currentImage.alt || title}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
