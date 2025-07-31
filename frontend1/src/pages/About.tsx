import { Award, Users, Leaf, Heart } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

const About = () => {
  const features = [
    {
      icon: <Leaf className="w-12 h-12 text-primary" />,
      title: "100% Natural",
      description:
        "Our products are made from pure, natural ingredients without any harmful chemicals.",
    },
    {
      icon: <Award className="w-12 h-12 text-primary" />,
      title: "Lab Tested",
      description:
        "All our products undergo rigorous testing to ensure safety and effectiveness.",
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "Remarkable Results",
      description:
        "Satisfied customers trust WocHerbal for their hair care needs.",
    },
    {
      icon: <Heart className="w-12 h-12 text-primary" />,
      title: "Made with Love",
      description:
        "Each product is crafted with care and dedication to provide the best results.",
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
            About Woc Herbal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of ayurveda with our premium hair care
            products, which are crafted using traditional Panchgavya and natural
            time tested herbs.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-foreground mb-6">
              Jaiswal Innovations WOC Panchagavya Ayurvedic Herbal Hair Oil
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Welcome to Jaiswal Innovations, where the enduring legacy of
                Ayurveda seamlessly converges with the evolving needs of
                contemporary wellness in the heart of India. Our foundation is
                deeply rooted in reverence for Ayurvedic healing traditions,
                with a focused commitment to the transformative potential of
                Panchgavya.
              </p>
              <p>
                At the core of our philosophy is the belief in the purity and
                power of nature. Our formulations are meticulously developed
                using time-honored herbal practices with the advantages of
                Panchgavya—indigenous cow’s milk is used to prepare this
                standardized Hair Oil to cater all your hair care needs. Each
                product is a harmonious blend of authenticity, efficacy, and
                sustainability, crafted to support holistic health and
                well-being.
              </p>
              <p>
                Driven by a passion to preserve India’s rich heritage of natural
                healing, Jaiswal Innovations offers more than just haircare
                products. We are dedicated to creating solutions that reflect
                our commitment to environmental stewardship and traditional
                knowledge, ensuring that every offering aligns with both
                ecological and ethical principles
              </p>
              <p>
                We invite you to embark on a transformative wellness journey
                with us. Let WOC Panchagavya Ayurvedic Herbal Hair Oil and our
                range of Ayurvedic products be your trusted companion in
                experiencing the profound benefits of Natural herbs and
                Panchgavya. Together, let us embrace a lifestyle that nurtures
                body, mind, and spirit—honoring ancient traditions while
                embracing modern health and balance.
              </p>
            </div>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src="/scrollng_image_mobile/02.jpg"
              alt="WocHerbal Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-lg transition-shadow"
            >
              <CardContent className="space-y-4">
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
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
            To bring the ancient wisdom of Ayurveda to modern hair care, helping
            people achieve naturally healthy and beautiful hair through the
            power of Panchgavya and traditional herbs. We are committed to
            providing chemical-free, effective solutions that honor both our
            heritage and your well-being.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
