import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Leaf, Award } from "lucide-react";
import { Button } from "./ui/button";

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/uploads/86ce4255-a691-49a9-99fb-52b0851d8c58.png",
      mobileImage: "/scrollng_image_mobile/06.jpg",
    },
    {
      id: 2,
      image: "/uploads/9bd6cb1c-011e-4067-b5f0-4fceb1e26a90.png",
      mobileImage: "/scrollng_image_mobile/02.jpg",
    },
    {
      id: 3,
      image: "/uploads/986595a1-1c57-44d7-8c20-6dad4265e611.png",
      mobileImage: "/scrollng_image_mobile/05.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[400px] md:h-[40vh] overflow-hidden pt-4 mt-16 md:pt-0">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Desktop Image */}
          <img
            src={slide.image}
            alt="Product banner"
            className="hidden md:block w-full h-full object-cover"
          />
          {/* Mobile Image - 1080x1080 aspect ratio */}
          <img
            src={slide.mobileImage}
            alt="Product banner"
            className="block md:hidden w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-background/80 hover:bg-background text-foreground p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-background/80 hover:bg-background text-foreground p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-accent scale-125 shadow-lg"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerSlider;
