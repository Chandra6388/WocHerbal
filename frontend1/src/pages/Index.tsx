
import Hero from '@/components/Hero';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import IngredientExplorer from '@/components/IngredientExplorer';
import BlogSection from '@/components/BlogSection';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Shield, Truck, Award, Users, MapPin, Phone, Mail, Sparkles, Leaf, Heart, Package, Zap, Globe, Clock, Gift } from 'lucide-react';
import { featuredProduct } from '../data/products';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const Index = () => {
  const benefits = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "100% Natural & Safe",
      description: "No harmful chemicals, parabens, or artificial additives. Pure Ayurvedic formula crafted with traditional herbs and modern science.",
      gradient: "from-green-400 to-emerald-500",
      bgGradient: "bg-gradient-to-br from-green-50 to-emerald-50",
      textColor: "text-green-700",
      features: ["Chemical-free", "Dermatologically tested", "Safe for daily use"]
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Clinically Proven Results",
      description: "Scientifically validated formulation with 95% customer satisfaction rate. Visible results in just 2-4 weeks of regular use.",
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
      textColor: "text-blue-700",
      features: ["Lab tested", "95% satisfaction", "Proven efficacy"]
    },
    {
      icon: <Truck className="w-12 h-12" />,
      title: "Free & Fast Delivery",
      description: "Complimentary shipping across India with secure packaging. Express delivery available in major cities within 24-48 hours.",
      gradient: "from-purple-400 to-pink-500",
      bgGradient: "bg-gradient-to-br from-purple-50 to-pink-50",
      textColor: "text-purple-700",
      features: ["Free shipping", "Secure packaging", "Express delivery"]
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Trusted by 10,000+",
      description: "Join our growing family of satisfied customers who have transformed their hair naturally with WOC's Ayurvedic formula.",
      gradient: "from-orange-400 to-red-500",
      bgGradient: "bg-gradient-to-br from-orange-50 to-red-50",
      textColor: "text-orange-700",
      features: ["10k+ customers", "5-star reviews", "Natural transformation"]
    }
  ];

  const whyChooseUs = [
    { icon: <Globe className="w-6 h-6" />, text: "Global Quality Standards", color: "text-blue-600" },
    { icon: <Clock className="w-6 h-6" />, text: "24/7 Customer Support", color: "text-green-600" },
    { icon: <Gift className="w-6 h-6" />, text: "Money-back Guarantee", color: "text-purple-600" },
    { icon: <Zap className="w-6 h-6" />, text: "Fast-acting Formula", color: "text-yellow-600" }
  ];

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Blog Section */}
      <BlogSection />
      
      {/* Enhanced About Preview Section */}
      <section className="py-24 bg-gradient-to-br from-secondary/10 via-background to-accent/5 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-green-400/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-accent/10 text-accent px-6 py-3 rounded-full text-sm font-medium mb-6 hover:scale-105 transition-transform cursor-pointer">
              <Heart className="w-4 h-4 mr-2" />
              About WOC Herbal
              <Sparkles className="w-4 h-4 ml-2 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
              Rooted in Ancient Wisdom,
              <span className="block bg-gradient-to-r from-accent via-green-600 to-teal-500 bg-clip-text text-transparent">
                Perfected by Science
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover the perfect blend of traditional Ayurvedic knowledge and modern scientific research, 
              crafted to give you the healthiest, most beautiful hair naturally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className={`${benefit.bgGradient} border-2 border-transparent hover:border-accent/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer`}
              >
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                    {benefit.icon}
                  </div>
                  <h3 className={`font-bold text-lg mb-4 ${benefit.textColor} group-hover:text-accent transition-colors`}>
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                    {benefit.description}
                  </p>
                  <div className="space-y-2">
                    {benefit.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center text-sm">
                        <div className={`w-2 h-2 bg-gradient-to-r ${benefit.gradient} rounded-full mr-2`} />
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-playfair font-bold mb-8 flex items-center justify-center">
              <Zap className="w-6 h-6 mr-2 text-accent" />
              Why Choose WOC Herbal?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-3 p-4 bg-card/50 rounded-xl hover:bg-card transition-colors duration-300 group">
                  <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-center group-hover:text-accent transition-colors">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link to="/about">
              <Button size="lg" className="bg-gradient-to-r from-accent to-green-600 hover:from-green-600 hover:to-accent hover:scale-110 transition-all duration-300 shadow-xl">
                <Heart className="w-5 h-5 mr-2" />
                Learn More About Our Story
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Ingredient Explorer Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <IngredientExplorer />
        </div>
      </section>

      {/* Enhanced Product Preview Section */}
      <section className="py-24 bg-gradient-to-br from-accent/5 via-background to-green-500/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-accent/10 text-accent px-6 py-3 rounded-full text-sm font-medium mb-6">
              <Package className="w-4 h-4 mr-2" />
              Featured Product
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
              Our Premium Ayurvedic Formula
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the transformative power of traditional Ayurveda with our scientifically formulated herbal hair oil
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-700 border-2 border-accent/20 hover:border-accent/40 bg-gradient-to-br from-card to-card/90">
              <CardContent className="p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="relative group">
                    <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-accent/5 to-green-500/5 relative">
                      <img
                        src={featuredProduct.image}
                        alt={featuredProduct.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                      23% OFF 🔥
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-3xl font-playfair font-bold mb-4">{featuredProduct.name}</h3>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-lg font-semibold">({featuredProduct.rating}/5)</span>
                        <span className="text-muted-foreground">• {featuredProduct.reviews} reviews</span>
                      </div>
                      <p className="text-lg text-muted-foreground mb-6">{featuredProduct.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {featuredProduct.benefits.slice(0, 6).map((benefit, index) => (
                        <div key={index} className="flex items-center text-muted-foreground hover:text-accent transition-colors cursor-pointer group">
                          <div className="w-3 h-3 bg-accent rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                          <span className="text-sm font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-accent/5 to-green-500/5 p-6 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-foreground">₹{featuredProduct.price}</span>
                        <span className="text-xl text-muted-foreground line-through">₹{featuredProduct.originalPrice}</span>
                      </div>
                      <Link to="/products">
                        <Button className="bg-gradient-to-r from-accent to-green-600 hover:from-green-600 hover:to-accent hover:scale-110 transition-all duration-300 shadow-xl">
                          View Product Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-2 border-accent/30 hover:bg-accent/5 hover:scale-105 transition-all duration-300">
                Explore All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-secondary/20 via-background to-accent/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-accent/10 text-accent px-6 py-3 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Customer Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
              Real Results from Real People
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover why thousands of customers trust WOC Herbal for their natural hair care journey
            </p>
          </div>
          
          <TestimonialsCarousel />
          
          <div className="text-center mt-12">
            <Link to="/testimonials">
              <Button size="lg" variant="outline" className="border-2 border-accent/30 hover:bg-accent/5 hover:scale-105 transition-all duration-300">
                Read All Customer Stories
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Track Order Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
              Track Your WOC Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with your order status and delivery progress with our simple tracking system
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-accent/20 hover:border-accent/40 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-accent/5">
              <CardContent className="p-12 text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-accent to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Truck className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Order Tracking Made Easy</h3>
                  <p className="text-muted-foreground text-lg">Enter your order ID to get real-time updates on your package delivery status</p>
                </div>
                <Link to="/track-order">
                  <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-accent to-green-600 hover:from-green-600 hover:to-accent hover:scale-110 transition-all duration-300 shadow-xl text-lg px-12 py-4">
                    <Truck className="w-5 h-5 mr-2" />
                    Track My Order Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Preview */}
      <section className="py-24 bg-gradient-to-br from-accent/5 via-background to-green-500/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
              We're Here to Help
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about your hair care journey? Our expert team is ready to guide you every step of the way
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { 
                icon: <MapPin className="w-8 h-8" />, 
                title: "Visit Our Store", 
                info: "123 Herbal Street, Ayurveda City, India",
                gradient: "from-blue-400 to-cyan-500",
                bg: "bg-blue-50"
              },
              { 
                icon: <Phone className="w-8 h-8" />, 
                title: "Call Us Anytime", 
                info: "+91 98765 43210",
                gradient: "from-green-400 to-emerald-500",
                bg: "bg-green-50"
              },
              { 
                icon: <Mail className="w-8 h-8" />, 
                title: "Email Support", 
                info: "support@wocherbal.com",
                gradient: "from-purple-400 to-pink-500",
                bg: "bg-purple-50"
              }
            ].map((contact, index) => (
              <Card key={index} className={`${contact.bg} text-center p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-transparent hover:border-accent/20 cursor-pointer group`}>
                <CardContent className="p-0">
                  <div className={`w-16 h-16 bg-gradient-to-r ${contact.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                    {contact.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-3 group-hover:text-accent transition-colors">{contact.title}</h3>
                  <p className="text-muted-foreground font-medium">{contact.info}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/contact">
              <Button size="lg" className="bg-gradient-to-r from-accent to-green-600 hover:from-green-600 hover:to-accent hover:scale-110 transition-all duration-300 shadow-xl text-lg px-12 py-4">
                <Mail className="w-5 h-5 mr-2" />
                Get in Touch Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
