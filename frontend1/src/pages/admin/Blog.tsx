import React, {useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Calendar, User, Clock, Share2, Heart } from 'lucide-react';
import {getBlogById } from '@/services/admin/blogsService'
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  description: string;
  image: string;
  author: string;
  createdAt: string;
  category?: string;
  readTime?: string;
}

const BlogPost = () => {
  const { toast } = useToast();
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);

   useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const req = { id };
      const res = await getBlogById(req);
      if (res?.status === 'success') {
        setPost(res.blog);
      } else {
        setPost(null);
        toast({
          title: 'No Blog Found',
          description: res?.message || 'No blog post available right now.',
          variant: 'default',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast({
        title: 'Failed to Load Blog',
        description: 'Something went wrong while fetching the blog post.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };


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
              {/* <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                {post.category}
              </span> */}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
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



export default BlogPost;