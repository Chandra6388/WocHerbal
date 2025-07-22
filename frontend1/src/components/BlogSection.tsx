import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import React, { useState, useEffect } from 'react';
import { getBlogById, getAllBlogs } from '@/services/admin/blogsService'

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
  isPublished: boolean;
}



const BlogSection = () => {

  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getBlogs()
  }, [])

  const getBlogs = async () => {
    try {
      const res = await getAllBlogs({});
      if (res?.status === "success") {
        setPosts(res.blogs || []);

      } else {
        setPosts([]);
        toast({
          title: "No Blogs Found",
          description: res?.message || "No blog posts available right now.",
          variant: "default",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "🚫 Failed to Load Blogs",
        description: "Something went wrong while fetching the blog posts. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const filterPublishBlog = posts.filter(item => item?.isPublished)



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
            {filterPublishBlog.map((post, index) => (
              <Link
                key={post._id}
                to={`/blog/${post._id}`}
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
                        <div className="flex items-center text-accent font-medium text-sm group-hover:translate-x-1 transition-transform"  onClick={() =>
                          window.open(`/blog/${post._id}`, "_blank")
                        }>
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