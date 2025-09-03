"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    image: "/assets/images/home/banner-1.webp",
    title: "Encontrá tu auto ideal",
    subtitle: "Explorá cientos de modelos disponibles ahora",
    ctaText: "Ver autos",
    ctaLink: "/marketplace",
  },
  {
    image: "/assets/images/home/banner-2.webp",
    title: "Vendé tu auto fácilmente",
    subtitle: "Publicá gratis y alcanzá miles de compradores",
    ctaText: "Publicar auto",
    ctaLink: "/dashboard?tab=register-vehicle",
  },
  {
    image: "/assets/images/home/banner-3.webp",
    title: "Beneficios exclusivos para miembros VIP",
    subtitle: "Automatizá tus publicaciones con tecnología inteligente",
    ctaText: "Hacete VIP",
    ctaLink: "/dashboard?tab=premium",
  },
];

export default function HomeBannerSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slideDuration = 7000;

  const startSlideTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slideDuration);
  };

  useEffect(() => {
    startSlideTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const changeSlide = (newIndex: number) => {
    setCurrentSlide(newIndex);
    startSlideTimer();
  };

  const prevSlide = () =>
    changeSlide((currentSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => changeSlide((currentSlide + 1) % slides.length);

  return (
    <div className="w-full bg-principal-blue py-12">
      <div
        className="relative mx-auto overflow-hidden rounded-[50px] \
           w-full md:w-[80%] \
           aspect-video md:aspect-auto md:h-[60vh]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover rounded-[50px]"
              priority
            />
            <div className="absolute inset-0 bg-black/40 rounded-[50px]" />
            <motion.div
              className="absolute z-20 left-6 md:left-10 bottom-8 text-white max-w-[60%]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm md:text-2xl mb-4">
                {slides[currentSlide].subtitle}
              </p>
              <a
                href={slides[currentSlide].ctaLink}
                className="inline-block bg-[#facc15] text-gray-900 hover:bg-yellow-500 font-semibold px-6 py-3 rounded-2xl shadow transition"
              >
                {slides[currentSlide].ctaText} →
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
        >
          <ChevronLeft className="text-white stroke-2" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
        >
          <ChevronRight className="text-white stroke-2" />
        </button>
      </div>
    </div>
  );
}
