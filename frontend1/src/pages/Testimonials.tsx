
import { useState, useEffect } from 'react';
import { Star, Quote, Heart, Send } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import {getAllReview, LikeReview} from '@/services/user/reviewsService';

const Testimonials = () => {
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

    const getAvgRating = () => {
      if (allReviews.length === 0) return 0;
      const totalRating = allReviews.reduce((acc, review) => acc + review.rating, 0);
      return (totalRating / allReviews.length).toFixed(1);
    };  

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
            What Our Customers
            <span className="block text-accent">Say About Us</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real experiences from real customers who have transformed their hair with WOC Panchgavya Hair Oil
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold">{getAvgRating()}/5</span>
            <span className="text-muted-foreground">Based on {allReviews.length} reviews</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {allReviews.map((testimonial) => (
            <Card key={testimonial._id} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-accent mr-2" />
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                   
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{testimonial.user}</p>
                        
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Verified
                          </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLike(testimonial._id)}
                    className="flex items-center space-x-1 text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        testimonial.liked ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                    <span className="text-sm">{testimonial.likes}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">{allReviews.length}+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">{getAvgRating()}/5</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">95%</div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">100%</div>
            <div className="text-muted-foreground">Natural Formula</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
