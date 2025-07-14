
import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Heart, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      rating: 5,
      text: "WOC has completely transformed my hair! Reduced hair fall by 80% in just 2 months. The natural ingredients make such a difference. My hairdresser was amazed!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      verified: true,
      likes: 24,
      timeAgo: "2 weeks ago"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi, NCR", 
      rating: 5,
      text: "Best hair oil I've ever used! My hair feels stronger and healthier than ever. The Ayurvedic formula really works. Worth every penny!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      verified: true,
      likes: 18,
      timeAgo: "1 month ago"
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Bangalore, Karnataka",
      rating: 5,
      text: "Natural ingredients with visible results! My hair has never been shinier. The scalp health improvement is incredible. Highly recommend to everyone!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      verified: true,
      likes: 31,
      timeAgo: "3 weeks ago"
    },
    {
      id: 4,
      name: "Meera Singh",
      location: "Jaipur, Rajasthan",
      rating: 5,
      text: "Amazing product! My hair fall reduced dramatically and I can see new hair growth. The traditional Ayurvedic formula is simply magical!",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      verified: true,
      likes: 27,
      timeAgo: "1 week ago"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-3xl">
        <div 
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0">
              <Card className="mx-4 bg-gradient-to-br from-card via-card/95 to-accent/5 border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-accent/30 shadow-lg hover:scale-110 transition-transform duration-300"
                      />
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-foreground">{testimonial.name}</h4>
                          <p className="text-muted-foreground text-sm">{testimonial.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">{testimonial.timeAgo}</p>
                        </div>
                      </div>
                      
                      {/* Quote */}
                      <div className="relative mb-4">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-accent/30" />
                        <p className="text-muted-foreground italic leading-relaxed pl-6">
                          "{testimonial.text}"
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-2 text-muted-foreground hover:text-accent transition-colors group">
                            <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">{testimonial.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 transition-colors group">
                            <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">Love</span>
                          </button>
                        </div>
                        {testimonial.verified && (
                          <div className="flex items-center space-x-1 text-green-600 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Verified Purchase</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="sm"
        onClick={prevTestimonial}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 bg-card/80 backdrop-blur-sm border-accent/30 hover:bg-accent/10 hover:scale-110 transition-all duration-300 z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={nextTestimonial}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 bg-card/80 backdrop-blur-sm border-accent/30 hover:bg-accent/10 hover:scale-110 transition-all duration-300 z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
      
      {/* Dots Indicator */}
      <div className="flex justify-center space-x-3 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-accent scale-125 shadow-lg' 
                : 'bg-muted-foreground/30 hover:bg-accent/50 hover:scale-110'
            }`}
          />
        ))}
      </div>
      
      {/* Auto-play control */}
      <div className="text-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          {isAutoPlaying ? '⏸️ Pause' : '▶️ Auto-play'}
        </button>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
