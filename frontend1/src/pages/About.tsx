
import { Award, Users, Leaf, Heart } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const About = () => {
  const features = [
    {
      icon: <Leaf className="w-12 h-12 text-primary" />,
      title: "100% Natural",
      description: "Our products are made from pure, natural ingredients without any harmful chemicals."
    },
    {
      icon: <Award className="w-12 h-12 text-primary" />,
      title: "Clinically Tested",
      description: "All our products undergo rigorous testing to ensure safety and effectiveness."
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "Trusted by Thousands",
      description: "Over 10,000 satisfied customers trust WocHerbal for their hair care needs."
    },
    {
      icon: <Heart className="w-12 h-12 text-primary" />,
      title: "Made with Love",
      description: "Each product is crafted with care and dedication to provide the best results."
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
            About WocHerbal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the power of Ayurveda with our premium hair care products, 
            crafted using traditional Panchgavya and natural herbs.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-foreground mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                WocHerbal was born from a passion for natural wellness and the ancient wisdom of Ayurveda. 
                Our journey began with a simple belief: nature holds the key to healthy, beautiful hair.
              </p>
              <p>
                Drawing from centuries-old Ayurvedic traditions, we have carefully formulated our products 
                using Panchgavya - a sacred blend of five cow-derived products that have been revered in 
                Indian culture for their healing properties.
              </p>
              <p>
                Each bottle of WocHerbal hair oil is a testament to our commitment to purity, quality, 
                and effectiveness. We source our ingredients from organic farms and prepare our products 
                using traditional methods that preserve their natural potency.
              </p>
            </div>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src="/placeholder.svg"
              alt="WocHerbal Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-secondary rounded-lg p-12 text-center">
          <h2 className="text-3xl font-playfair font-bold text-foreground mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            To bring the ancient wisdom of Ayurveda to modern hair care, helping people achieve 
            naturally healthy and beautiful hair through the power of Panchgavya and traditional herbs. 
            We are committed to providing chemical-free, effective solutions that honor both our heritage 
            and your well-being.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
