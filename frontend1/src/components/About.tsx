
import { Award, Users, Leaf, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Award className="w-8 h-8" />, value: "15+", label: "Years of Expertise" },
    { icon: <Users className="w-8 h-8" />, value: "10K+", label: "Happy Customers" },
    { icon: <Leaf className="w-8 h-8" />, value: "100%", label: "Natural Products" },
    { icon: <Globe className="w-8 h-8" />, value: "50+", label: "Countries Served" }
  ];

  const values = [
    {
      title: "Pure & Natural",
      description: "We source only the finest organic herbs from trusted growers worldwide",
      gradient: "from-forest-400 to-forest-600"
    },
    {
      title: "Science-Backed",
      description: "Every formulation is supported by rigorous research and clinical studies",
      gradient: "from-earth-400 to-earth-600"
    },
    {
      title: "Sustainable",
      description: "Committed to environmental responsibility in every aspect of our business",
      gradient: "from-cream-400 to-cream-600"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-forest-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-earth-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-forest-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-forest-100 px-4 py-2 rounded-full">
              <Leaf className="w-4 h-4 text-forest-600" />
              <span className="text-sm font-medium text-forest-800">Our Story</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-forest-800 leading-tight">
              Rooted in Nature,
              <span className="block bg-gradient-to-r from-forest-500 to-earth-500 bg-clip-text text-transparent">
                Driven by Science
              </span>
            </h2>

            <div className="space-y-6 text-forest-600 leading-relaxed">
              <p className="text-lg">
                Founded with a passionate belief in nature's healing power, WocHerbal has been at the forefront of herbal wellness innovation for over 15 years.
              </p>
              
              <p>
                Our journey began with a simple mission: to bridge the gap between ancient herbal wisdom and modern scientific understanding. Today, we're proud to offer premium, research-backed herbal solutions that empower people to take control of their wellness naturally.
              </p>
            </div>

            {/* Values Grid */}
            <div className="space-y-4">
              {values.map((value, index) => (
                <div 
                  key={value.title}
                  className="flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${value.gradient} rounded-xl flex-shrink-0`}></div>
                  <div>
                    <h3 className="font-playfair font-bold text-forest-800 mb-2">{value.title}</h3>
                    <p className="text-forest-600 text-sm">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Stats & Image */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {/* Main Image */}
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-forest-100 to-earth-100 rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&h=320&fit=crop"
                  alt="Natural herbs and wellness"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl animate-float">
                <div className="text-center">
                  <div className="text-3xl font-playfair font-bold text-forest-800">4.9⭐</div>
                  <div className="text-sm text-forest-600">Customer Rating</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="text-forest-600 mb-3 flex justify-center">{stat.icon}</div>
                  <div className="text-2xl font-playfair font-bold text-forest-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-forest-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
