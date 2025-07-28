
import Hero from '@/components/Hero';
import BannerSlider from '@/components/BannerSlider';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import IngredientExplorer from '@/components/IngredientExplorer';
import BlogSection from '@/components/BlogSection';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Shield, Truck, Award, Users, MapPin, Phone, Mail, Sparkles, Leaf, Heart, Package, Zap, Globe, Clock, Gift } from 'lucide-react';
import { featuredProduct } from '../data/products';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { } from '@/services/user/reviewsService';
const Index = () => {
  const benefits = [
    {
      icon: <Shield className="w-12 h-12 text-alime" />,
      title: "Powered by Panchgavya & 30+ Ayurvedic Herbs",
      description: "Our hair oil is enriched with Panchgavya and over 30 natural herbs that deeply nourish the scalp and promote healthy.",
      gradient: "from-gray-600 to-gray-800",
      bgGradient: "bg-gradient-to-br from-gray-50 to-gray-100",
      textColor: "text-gray-700",
      features: ["30+ time tested herbs", "Root to tip nourishment", "Panchgavya based formula"]
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Visible Results in 2–4 Weeks",
      description: "Experience noticeable improvement in hair fall, dandruff, and texture with consistent use. Our customers see visible changes in just a few weeks.",
      gradient: "from-gray-600 to-gray-800",
      bgGradient: "bg-gradient-to-br from-gray-100 to-gray-200",
      textColor: "text-gray-800",
      features: ["Reduces hair fall", "Boosts natural shine", "Improves scalp health"]
    },
    {
      icon: <Truck className="w-12 h-12" />,
      title: "100% Natural & Lab Tested",
      description: "Free from parabens, sulfates, and synthetic fragrances. Safe for all hair types and suitable for daily or weekly use.",
      gradient: "from-gray-600 to-gray-800",
      bgGradient: "bg-gradient-to-br from-gray-200 to-gray-300",
      textColor: "text-gray-900",
      features: ["No harmful chemicals", "Aromatic soothing effect", "Suitable for men & women"]
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Free & Fast Delivery across India",
      description: "We offer quick and complimentary shipping with safe packaging. Expect your order at your doorstep in 2–5 business days.",
      gradient: "from-gray-600 to-gray-800",
      bgGradient: "bg-gradient-to-br from-gray-50 to-gray-150",
      textColor: "text-gray-600",
      features: ["Free shipping", "Real-time tracking on all orders", "Secure & eco-friendly packaging"]
    }
  ];

  const whyChooseUs = [
    { icon: <Globe className="w-6 h-6" />, text: "Global Quality Standards", color: "text-blue-600" },
    { icon: <Clock className="w-6 h-6" />, text: "24/7 Customer Support", color: "text-green-600" },
    { icon: <Gift className="w-6 h-6" />, text: "Money-back Guarantee", color: "text-purple-600" },
    { icon: <Zap className="w-6 h-6" />, text: "Fast-acting Formula", color: "text-yellow-600" }
  ];
  ;



  return (
    <div className="min-h-screen">
      <BannerSlider />
      <Hero />
      <section className="py-24 bg-gradient-to-br from-secondary/20 via-background to-muted/10">
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

      <IngredientExplorer />

      <BlogSection />
      <section className="py-24 bg-gradient-to-br from-secondary/10 via-background to-muted/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-muted-foreground/20 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center bg-accent/10 text-accent px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium mb-4 sm:mb-6 hover:scale-105 transition-transform cursor-pointer">
              <Heart className="w-4 h-4 mr-2" />
              About WOC Herbal
              <Sparkles className="w-4 h-4 ml-2 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4 sm:mb-6">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-accent via-primary to-accent-soft bg-clip-text text-transparent font-extrabold">
                  WOC Highlights
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent-soft rounded-full transform scale-x-75 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className={`bg-white
 border-2 border-transparent hover:border-accent/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer`}
              >
                <CardContent className="p-6 sm:p-8 text-center h-full flex flex-col">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                    {benefit.icon}
                  </div>
                  <h3 className={`font-bold text-lg mb-3 sm:mb-4 ${benefit.textColor} group-hover:text-accent transition-colors`}>
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 sm:mb-6 flex-grow leading-relaxed text-sm sm:text-base">
                    {benefit.description}
                  </p>
                  <div className="space-y-2">
                    {benefit.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center text-xs sm:text-sm">
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
          {/* <div className="text-center mb-8 sm:mb-12 ">
            <h3 className="text-xl sm:text-2xl font-playfair font-bold mb-6 sm:mb-8 flex items-center justify-center">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-accent" />
              Why Choose WOC Herbal?
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-card/50 rounded-xl hover:bg-card transition-colors duration-300 group">
                  <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-center group-hover:text-accent transition-colors">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div> */}

          <div className="text-center">
            <Link to="/about">
              <Button size="lg" className="bg-gradient-to-r from-accent to-muted-foreground hover:from-muted-foreground hover:to-accent hover:scale-110 transition-all duration-300 shadow-xl">
                <Heart className="w-5 h-5 mr-2" />
                Learn More About Our Story
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-accent/5 via-background to-muted/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center bg-accent/10 text-accent px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium mb-4 sm:mb-6">
              <Package className="w-4 h-4 mr-2" />
              Featured Product
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4 sm:mb-6">
              Our Premium Ayurvedic Formula
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Experience the transformative power of traditional Ayurveda with our scientifically formulated herbal hair oil
            </p>
          </div>

          <div className=" mx-auto">
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-700 border-2 border-accent/20 hover:border-accent/40 bg-gradient-to-br from-card to-card/90">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                  <div className="relative group order-2 lg:order-1">
                    <div className="aspect-square overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-accent/5 to-green-500/5 relative">
                      <img
                        src={featuredProduct.image}
                        alt={featuredProduct.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-bounce">
                      23% OFF 🔥
                    </div>
                  </div>

                  <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-playfair font-bold mb-3 sm:mb-4">{featuredProduct.name}</h3>
                      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-base sm:text-lg font-semibold">({featuredProduct.rating}/5)</span>
                        <span className="text-muted-foreground text-sm sm:text-base">• {featuredProduct.reviews} reviews</span>
                      </div>
                      <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">{featuredProduct.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {featuredProduct.benefits.slice(0, 6).map((benefit, index) => (
                        <div key={index} className="flex items-center text-muted-foreground hover:text-accent transition-colors cursor-pointer group">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full mr-2 sm:mr-3 group-hover:scale-125 transition-transform"></div>
                          <span className="text-xs sm:text-sm font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-accent/5 to-green-500/5 p-4 sm:p-6 rounded-2xl gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-3xl sm:text-4xl font-bold text-foreground">₹{featuredProduct.price}</span>
                        <span className="text-lg sm:text-xl text-muted-foreground line-through">₹{featuredProduct.originalPrice}</span>
                      </div>
                      <Link to="/products">
                        <Button className="w-full sm:w-auto bg-gradient-to-r from-accent to-muted-foreground hover:from-muted-foreground hover:to-accent hover:scale-110 transition-all duration-300 shadow-xl">
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
                  <div className="w-24 h-24 bg-gradient-to-r from-accent to-muted-foreground rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Truck className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Order Tracking Made Easy</h3>
                  <p className="text-muted-foreground text-lg">Enter your order ID to get real-time updates on your package delivery status</p>
                </div>
                <Link to="/track-order">
                  <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-accent to-muted-foreground hover:from-muted-foreground hover:to-accent hover:scale-110 transition-all duration-300 shadow-xl text-lg px-12 py-4">
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

      <section className="py-24 bg-gradient-to-br from-accent/5 via-background to-muted/5">
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
                gradient: "from-gray-400 to-gray-600",
                bg: "bg-gray-50"
              },
              {
                icon: <Phone className="w-8 h-8" />,
                title: "Call Us Anytime",
                info: "+91 98765 43210",
                gradient: "from-gray-500 to-gray-700",
                bg: "bg-gray-100"
              },
              {
                icon: <Mail className="w-8 h-8" />,
                title: "Email Support",
                info: "support@wocherbal.com",
                gradient: "from-gray-600 to-gray-800",
                bg: "bg-gray-200"
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
              <Button size="lg" className="bg-gradient-to-r from-accent to-muted-foreground hover:from-muted-foreground hover:to-accent hover:scale-110 transition-all duration-300 shadow-xl text-lg px-12 py-4">
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
