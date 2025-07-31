
import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Heart, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { getAllReview, LikeReview } from '@/services/user/reviewsService';
import { useToast } from '@/hooks/use-toast';
const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { toast } = useToast();
  const [allReviews, setAllReviews] = useState([]);


  const fetchReviews = async () => {
    try {
      const reviews = await getAllReview()
      if (reviews?.status === 'success') {
        setAllReviews(reviews.reviews);
      } else {
        setAllReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);



  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allReviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, allReviews.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % allReviews.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + allReviews.length) % allReviews.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handleLike = async (reviewId) => {
    try {
      const response = await LikeReview(reviewId);
      if (response.status === 'success') {
        fetchReviews();
        toast({
          title: "Review Liked",
          description: "You have liked this review.",
          variant: "success",
          duration: 3000,
          });
      } else {
        toast({
          title: "Like Failed",
          description: "Please try again later.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Like Failed",
        description: error.message || 'An error occurred while liking the review',
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto">
      <div className="space-y-6 grid grid-cols-1 sm:grid-cols-2  gap-6">
        {allReviews?.slice(0, 4)?.map((testimonial) => (

          <Card key={testimonial._id} className=" bg-gradient-to-br from-card via-card/95 to-accent/5 border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 shadow-xl hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Profile Image */}
                <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center sm:text-left">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-foreground">{testimonial.user}</h4>
                    </div>
                    <div className="text-center sm:text-right">
                       <div className="flex items-center justify-center sm:justify-end mb-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                      <p className="text-xs text-muted-foreground">{new Date(testimonial.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="relative mb-3">
                    <Quote className="absolute -top-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 text-accent/30" />
                    <p className="text-muted-foreground italic leading-relaxed pl-3 sm:pl-4 text-xs sm:text-sm">
                      "{testimonial.comment}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-1 text-muted-foreground hover:text-accent transition-colors group" onClick={() => handleLike(testimonial._id)}>
                        <ThumbsUp className="w-3 h-3 group-hover:scale-110 transition-transform" />
                        <span className="text-xs">{testimonial.likes}</span>
                      </button>
                       
                    </div>
                  
                      <div className="flex items-center space-x-1 text-green-600 text-xs">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden sm:inline">Verified</span>
                      </div>
                   
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
