
import { useState } from 'react';
import { Star, Quote, Heart, Send } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';

const Testimonials = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "WOC Panchgavya hair oil has completely transformed my hair! After using it for just 2 months, my hair fall reduced by 80%. The natural ingredients make all the difference.",
      image: "/placeholder.svg",
      verified: true,
      likes: 24,
      liked: false
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      text: "I was skeptical about Ayurvedic products, but WOC proved me wrong. My hair feels stronger, thicker, and healthier than ever before. Highly recommended!",
      image: "/placeholder.svg",
      verified: true,
      likes: 18,
      liked: false
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Bangalore",
      rating: 5,
      text: "Best hair oil I've ever used! The texture is amazing and it doesn't leave my hair greasy. My hairdresser noticed the difference immediately.",
      image: "/placeholder.svg",
      verified: true,
      likes: 31,
      liked: false
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Pune",
      rating: 5,
      text: "My wife recommended this oil to me. After 3 months of use, my premature graying has slowed down significantly. Thank you WOC!",
      image: "/placeholder.svg",
      verified: true,
      likes: 15,
      liked: false
    },
    {
      id: 5,
      name: "Kavitha Reddy",
      location: "Hyderabad",
      rating: 5,
      text: "Natural ingredients, no side effects, and visible results. WOC has become an essential part of my hair care routine.",
      image: "/placeholder.svg",
      verified: true,
      likes: 22,
      liked: false
    },
    {
      id: 6,
      name: "Deepak Agarwal",
      location: "Jaipur",
      rating: 5,
      text: "Fantastic product! My hair feels softer and looks shinier. The traditional Ayurvedic formula really works.",
      image: "/placeholder.svg",
      verified: true,
      likes: 19,
      liked: false
    }
  ]);

  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    rating: 5,
    text: ''
  });

  const handleLike = (id: number) => {
    setReviews(reviews.map(review => 
      review.id === id 
        ? { 
            ...review, 
            liked: !review.liked,
            likes: review.liked ? review.likes - 1 : review.likes + 1
          }
        : review
    ));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.name || !newReview.text) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and review text.",
        variant: "destructive"
      });
      return;
    }

    const review = {
      id: reviews.length + 1,
      ...newReview,
      image: "/placeholder.svg",
      verified: false,
      likes: 0,
      liked: false
    };

    setReviews([review, ...reviews]);
    setNewReview({ name: '', location: '', rating: 5, text: '' });
    
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback! Your review is now live.",
    });
  };

  const handleStarClick = (rating: number) => {
    setNewReview({ ...newReview, rating });
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
            <span className="text-2xl font-bold">4.9/5</span>
            <span className="text-muted-foreground">Based on {reviews.length} reviews</span>
          </div>
        </div>

        {/* Add Review Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-playfair font-bold mb-6">Share Your Experience</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reviewName">Your Name</Label>
                    <Input
                      id="reviewName"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reviewLocation">Location (Optional)</Label>
                    <Input
                      id="reviewLocation"
                      value={newReview.location}
                      onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                      placeholder="Your city"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Your Rating</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`w-6 h-6 ${
                            star <= newReview.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          } hover:fill-yellow-400 hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reviewText">Your Review</Label>
                  <Textarea
                    id="reviewText"
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    placeholder="Share your experience with WOC hair oil..."
                    rows={4}
                    required
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reviews.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
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
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        {testimonial.verified && (
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Verified
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleLike(testimonial.id)}
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
            <div className="text-4xl font-bold text-accent mb-2">{reviews.length}+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">4.9/5</div>
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
