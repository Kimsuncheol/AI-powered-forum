"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Dynamic import for SSR safety
const SwiperComponent = dynamic(
  () => import("swiper/react").then((mod) => mod.Swiper),
  { ssr: false }
);
const SwiperSlide = dynamic(
  () => import("swiper/react").then((mod) => mod.SwiperSlide),
  { ssr: false }
);

interface InfiniteImageCarouselProps {
  images: string[];
}

export default function InfiniteImageCarousel({
  images,
}: InfiniteImageCarouselProps) {
  const [swiperInstance, setSwiperInstance] = React.useState<SwiperType | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        mb: 2,
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "action.hover",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <SwiperComponent
        direction="horizontal"
        spaceBetween={0}
        slidesPerView={1}
        loop={images.length > 1}
        onSwiper={(swiper: SwiperType) => setSwiperInstance(swiper)}
        style={{ width: "100%", aspectRatio: "16/9" }}
      >
        {images.map((url, index) => (
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={url}
              alt={`Slide ${index + 1}`}
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
        ))}
      </SwiperComponent>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <IconButton
            onClick={() => swiperInstance?.slidePrev()}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
            size="small"
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={() => swiperInstance?.slideNext()}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
            size="small"
          >
            <ChevronRight />
          </IconButton>
        </>
      )}

      {/* Pagination Dots */}
      {images.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            gap: 0.5,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => swiperInstance?.slideTo(index)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "background-color 0.2s",
                "&:hover": { bgcolor: "rgba(255,255,255,0.8)" },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
