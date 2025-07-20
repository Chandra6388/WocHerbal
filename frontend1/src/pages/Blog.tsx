import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User, Clock, Share2, Heart } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  description: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const mockBlogPosts: { [key: string]: BlogPost } = {
  '1': {
    id: '1',
    title: 'The Science Behind Ayurvedic Hair Care',
    description: 'Discover how ancient Ayurvedic principles combined with modern science create powerful hair care solutions.',
    content: `
      <h2>Understanding Ayurvedic Hair Care</h2>
      <p>Ayurveda, the ancient Indian system of medicine, has been treating hair problems for over 5,000 years. The science behind Ayurvedic hair care lies in its holistic approach that addresses the root cause of hair issues rather than just treating symptoms.</p>
      
      <h3>The Three Doshas and Hair Health</h3>
      <p>According to Ayurveda, our health is governed by three doshas: Vata, Pitta, and Kapha. Each dosha affects hair differently:</p>
      <ul>
        <li><strong>Vata:</strong> Controls hair growth and scalp circulation</li>
        <li><strong>Pitta:</strong> Affects hair color, texture, and premature graying</li>
        <li><strong>Kapha:</strong> Determines hair thickness, shine, and oiliness</li>
      </ul>
      
      <h3>Natural Ingredients for Hair Care</h3>
      <p>Ayurvedic hair care relies on powerful natural ingredients that have been scientifically proven to benefit hair health:</p>
      
      <h4>Amla (Indian Gooseberry)</h4>
      <p>Rich in Vitamin C and antioxidants, amla prevents premature graying and promotes hair growth.</p>
      
      <h4>Brahmi</h4>
      <p>Known for its cooling properties, brahmi soothes the scalp and reduces hair fall.</p>
      
      <h4>Bhringraj</h4>
      <p>Often called the "king of herbs" for hair, bhringraj promotes hair growth and prevents baldness.</p>
      
      <h3>Modern Scientific Validation</h3>
      <p>Recent studies have validated many Ayurvedic principles. Research shows that herbs like amla have high antioxidant activity, while oils like coconut oil can penetrate the hair shaft better than other oils.</p>
      
      <h3>Creating a Holistic Hair Care Routine</h3>
      <p>The key to Ayurvedic hair care is consistency and using the right combination of herbs for your specific dosha type. Regular oil massages, proper diet, and stress management all play crucial roles in maintaining healthy hair.</p>
    `,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1080&h=1080&fit=crop',
    author: 'Dr. Priya Sharma',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Science'
  }
};

const BlogPost = () => {
  const { id } = useParams();
  const post = id ? mockBlogPosts[id] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Blog post not found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <Link to="/admin/blog" className="inline-flex items-center text-accent hover:text-green-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <article>
          <div className="mb-8">
            <div className="aspect-video overflow-hidden rounded-2xl mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              {post.description}
            </p>

            <div className="flex items-center space-x-4 mb-8">
              <Button size="sm" variant="outline">
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
};

const BlogList = () => {
  const posts = Object.values(mockBlogPosts);

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the latest insights on natural hair care, Ayurvedic wisdom, and wellness tips
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`}>
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
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground text-sm">
                      {post.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export { BlogPost, BlogList };
export default BlogList;