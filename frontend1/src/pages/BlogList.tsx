
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User, Clock, Share2, Heart } from 'lucide-react';
import { getBlogById, getAllBlogs } from '@/services/admin/blogsService'
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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


const BlogList = () => {
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


    if (filterPublishBlog?.length == 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-4">No Blog post is found</h1>
                </div>
            </div>
        );
    }


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
                    {filterPublishBlog.map((post) => (
                        <Link key={post._id} to={`/blog/${post._id}`}>
                            <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-transparent hover:border-accent/30 group">
                                <CardContent className="p-0">
                                    <div className="aspect-square overflow-hidden rounded-t-lg">
                                        <img
                                            src={post?.image}
                                            alt={post?.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="p-6 space-y-4">
                                        {/* <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                                                {post.category}
                                            </span>
                                            <span>{post.readTime}</span>
                                        </div> */}

                                        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                                            {post?.title}
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

export default BlogList;
