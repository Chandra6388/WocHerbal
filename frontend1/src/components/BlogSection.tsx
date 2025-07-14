import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Science Behind Ayurvedic Hair Care',
    description: 'Discover how ancient Ayurvedic principles combined with modern science create powerful hair care solutions.',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1080&h=1080&fit=crop',
    author: 'Dr. Priya Sharma',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Science'
  },
  {
    id: '2',
    title: '5 Natural Ingredients for Healthy Hair',
    description: 'Learn about powerful natural ingredients that can transform your hair health naturally.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1080&h=1080&fit=crop',
    author: 'Wellness Team',
    date: '2024-01-12',
    readTime: '7 min read',
    category: 'Ingredients'
  },
  {
    id: '3',
    title: 'Hair Care Routine for Different Hair Types',
    description: 'Customize your hair care routine based on your unique hair type and concerns.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1080&h=1080&fit=crop',
    author: 'Hair Expert',
    date: '2024-01-10',
    readTime: '6 min read',
    category: 'Tips'
  },
  {
    id: '4',
    title: 'Benefits of Organic Hair Oil',
    description: 'Understanding why organic hair oils are superior for long-term hair health.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop',
    author: 'Organic Team',
    date: '2024-01-08',
    readTime: '4 min read',
    category: 'Organic'
  }
];

const BlogSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-background via-accent/5 to-green-500/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-accent/10 text-accent px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Calendar className="w-4 h-4 mr-2" />
            Latest from Our Blog
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
            Hair Care Insights &
            <span className="block bg-gradient-to-r from-accent via-green-600 to-teal-500 bg-clip-text text-transparent">
              Expert Tips
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest hair care trends, natural remedies, and expert advice
          </p>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-6 w-max">
            {mockBlogPosts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="block w-80 flex-shrink-0"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-transparent hover:border-accent/30 group">
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                          {post.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {post.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-accent/10">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center text-accent font-medium text-sm group-hover:translate-x-1 transition-transform">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/blog">
            <Button size="lg" variant="outline" className="border-2 border-accent/30 hover:bg-accent/5 hover:scale-105 transition-all duration-300">
              View All Blog Posts
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;