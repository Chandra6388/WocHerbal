import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2, Upload, Eye, Globe, FileText, Calendar, User } from 'lucide-react';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useToast } from '../../hooks/use-toast';
import { updateBlog, publishBlog, deleteBlog, getBlogById, getAllBlogs, addBlog } from '@/services/admin/blogsService'
interface BlogPost {
  _id?: string;
  title: string;
  description: string;
  content: string;
  image: string;
  author: string;
  isPublished?: boolean;
}
 
const BlogManagement = () => {
  const MySwal = withReactContent(Swal);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({});
  const { toast } = useToast();

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

  const handleSave = async () => {
    if (!editingPost.title || !editingPost.description || !editingPost.content) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingPost._id) {
      await updateBlog(editingPost)
        .then((res) => {
          if (res?.status == "success") {
            getBlogs()
            toast({
              title: "🎉 Blog Updated!",
              description: "Your blog post has been updated successfully.",
              variant: "success",
              duration: 3000,
            });
          }
          else {
            toast({
              title: "⚠️ Couldn't Updated Blog",
              description: res?.message || "Something went wrong while update your blog post. Please try again.",
              variant: "destructive",
              duration: 3000,
            });
          }
        })
        .catch((error) => {
          console.error("error", error);
          toast({
            title: "🚫 Blog updation Failed",
            description: "Oops! Something went wrong while update your blog. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        });
    } else {
      const newPost: BlogPost = {
        title: editingPost.title!,
        description: editingPost.description!,
        content: editingPost.content!,
        image: editingPost.image || 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1080&h=1080&fit=crop',
        author: editingPost.author || 'Admin',
      };

      await addBlog(newPost)
        .then((res) => {
          if (res?.status === "success") {
            getBlogs()
            toast({
              title: "🎉 Blog Published!",
              description: "Your blog post has been saved and published successfully.",
              variant: "success",
              duration: 3000,
            });
          } else {
            toast({
              title: "⚠️ Couldn't Save Blog",
              description: res?.message || "Something went wrong while saving your blog post. Please try again.",
              variant: "destructive",
              duration: 3000,
            });
          }
        })
        .catch((error) => {
          console.error("error", error);
          toast({
            title: "🚫 Blog Submission Failed",
            description: "Oops! Something went wrong while submitting your blog. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        });
    }

    setIsEditing(false);
    setEditingPost({});

  };

  const handlePublish = async (id: string, isPublishing: boolean) => {
    const actionText = !isPublishing ? "publish" : "unpublish";
    const confirm = await MySwal.fire({
      title: `Are you sure you want to ${actionText} this blog?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: !isPublishing ? "#10B981" : "#F59E0B",
      cancelButtonColor: "#EF4444",
    });

    if (!confirm.isConfirmed) {
      toast({
        title: "Cancelled",
        description: `Blog post was not ${!isPublishing ? "published" : "unpublished"}.`,
        variant: "default",
        duration: 3000,
      });
      return;
    }

    try {
      const req = { id, isPublished: !isPublishing };
      const res = await publishBlog(req);

      if (res?.status === "success") {
        toast({
          title: `✅ Blog ${!isPublishing ? "Published" : "Unpublished"}`,
          description: `The blog has been successfully ${!isPublishing ? "published" : "unpublished"}.`,
          variant: "success",
          duration: 3000,
        });

        // Optional: Refresh blog list if you maintain state
        getBlogs?.();
      } else {
        toast({
          title: "⚠️ Action Failed",
          description: res?.message || `Could not ${actionText} the blog. Please try again.`,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Publish/Unpublish Error:", error);
      toast({
        title: "🚫 Server Error",
        description: error?.response?.data?.message || `Error while trying to ${actionText} the blog.`,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmResult = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this blog post? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) {
      toast({
        title: "Cancelled",
        description: "Your blog post was not deleted.",
        variant: "default",
        duration: 3000,
      });
      return;
    }

    try {
      const req = { id: id }
      console.log("SS", req)
      const res = await deleteBlog(req);
      if (res?.status === "success") {
        getBlogs()
        toast({
          title: "🗑️ Blog Deleted",
          description: "The blog post has been deleted successfully.",
          variant: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "⚠️ Delete Failed",
          description: res?.message || "Something went wrong while deleting the blog post.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "🚫 Server Error",
        description: error?.response?.data?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server and get a URL
      const imageUrl = URL.createObjectURL(file);
      setEditingPost(prev => ({ ...prev, image: imageUrl }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-forest-50 to-accent/5 rounded-2xl p-8 border border-accent/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-playfair font-bold text-forest-700 mb-2">Blog Management</h1>
            <p className="text-forest-600">Create, edit, and publish engaging blog content for your audience</p>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-accent to-forest-600 hover:from-accent/90 hover:to-forest-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Post
          </Button>
        </div>
      </div>

      {/* Blog Post Editor */}
      {isEditing && (
        <Card className="border-2 border-accent/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-forest-50 to-accent/5 border-b border-accent/10">
            <CardTitle className="text-2xl font-playfair text-forest-700 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              {editingPost._id ? 'Edit Blog Post' : 'Create New Blog Post'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-forest-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Title *
                </label>
                <Input
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter an engaging blog title"
                  className="border-accent/30 focus:border-accent focus:ring-accent/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-forest-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Author
                </label>
                <Input
                  value={editingPost.author || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                  className="border-accent/30 focus:border-accent focus:ring-accent/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-forest-700">Description *</label>
              <Textarea
                value={editingPost.description || ''}
                onChange={(e) => setEditingPost(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Write a compelling description that will entice readers"
                rows={3}
                className="border-accent/30 focus:border-accent focus:ring-accent/20"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-forest-700">Featured Image</label>
              <div className="border-2 border-dashed border-accent/30 rounded-xl p-6 hover:border-accent/50 transition-colors">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="blog-image"
                  />
                  <label
                    htmlFor="blog-image"
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent/10 to-forest-100 border border-accent/30 rounded-xl hover:bg-accent/20 cursor-pointer transition-all font-medium text-forest-700"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Image</span>
                  </label>
                  {editingPost.image && (
                    <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={editingPost.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Recommended: 1080x1080px for best results</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-forest-700">Content *</label>
              <Textarea
                value={editingPost.content || ''}
                onChange={(e) => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your full blog content here. HTML tags are supported for formatting."
                rows={12}
                className="border-accent/30 focus:border-accent focus:ring-accent/20 font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt; for formatting
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-accent/10">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-accent to-forest-600 hover:from-accent/90 hover:to-forest-700 text-white px-8 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <FileText className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingPost({});
                }}
                className="border-accent/30 hover:bg-accent/5 px-8 py-2 rounded-xl font-medium"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blog Posts List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-playfair font-bold text-forest-700">All Blog Posts</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {posts.filter(p => p.isPublished === true).length} Published
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
              {posts.filter(p => p.isPublished === false).length} Drafts
            </span>
          </div>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post._id} className="border-2 border-accent/10 hover:border-accent/30 transition-all shadow-lg hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-48 h-32 lg:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-forest-100 to-accent/20 flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-playfair font-bold text-forest-700 line-clamp-1">
                            {post.title}
                          </h3>
                          <Badge
                            variant={post.isPublished === true ? 'default' : 'secondary'}
                            className={post.isPublished === true
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }
                          >
                            {post.isPublished === true ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {/* {new Date(post.createdAt).toLocaleDateString()} */}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-2">{post.description}</p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingPost(post);
                          setIsEditing(true);
                        }}
                        className="border-accent/30 hover:bg-accent/5 hover:border-accent/50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(post._id, post.isPublished)}
                        className={post.isPublished !== true
                          ? 'border-yellow-300 hover:bg-yellow-50 text-yellow-700 hover:border-yellow-400'
                          : 'border-green-300 hover:bg-green-50 text-green-700 hover:border-green-400'
                        }
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        {post.isPublished === true ? 'Publish' : 'Unpublish'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/admin/blog/${post._id}`, '_blank')}
                        className="border-blue-300 hover:bg-blue-50 text-blue-700 hover:border-blue-400"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(post._id)}
                        className="border-red-300 hover:bg-red-50 text-red-700 hover:border-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <Card className="border-2 border-dashed border-accent/30">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-accent/50 mb-4" />
              <h3 className="text-xl font-playfair font-bold text-forest-700 mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground mb-6">Start creating engaging content for your audience</p>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-accent to-forest-600 hover:from-accent/90 hover:to-forest-700 text-white px-6 py-2 rounded-xl font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;