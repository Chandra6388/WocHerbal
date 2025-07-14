
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      info: "hello@wocherbal.com",
      subtitle: "We'll respond within 24 hours"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      subtitle: "Mon-Fri 9am-6pm EST"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      info: "123 Wellness Street",
      subtitle: "New York, NY 10001"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-forest-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-earth-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-forest-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-forest-800 mb-6">
            Get in
            <span className="block bg-gradient-to-r from-forest-500 to-earth-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-xl text-forest-600 max-w-2xl mx-auto">
            Ready to start your natural wellness journey? We're here to help you every step of the way.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div 
                  key={item.title}
                  className="flex items-start space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up border border-cream-200"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-forest-500 to-earth-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-playfair font-bold text-forest-800 mb-1">{item.title}</h3>
                    <p className="text-forest-700 font-medium">{item.info}</p>
                    <p className="text-forest-600 text-sm">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-br from-forest-500 to-earth-500 p-8 rounded-3xl text-white animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <h3 className="font-playfair font-bold text-xl mb-4">Why Choose WocHerbal?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Premium quality herbal products</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Science-backed formulations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>15+ years of expertise</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>100% natural and organic</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-cream-200">
              <div>
                <label htmlFor="name" className="block text-forest-800 font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-300 bg-white/50"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-forest-800 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-300 bg-white/50"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-forest-800 font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-300 resize-none bg-white/50"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-forest-500 to-earth-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
