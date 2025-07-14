import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Plus, Edit, Trash2, Upload, Eye } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  author: string;
  status: 'draft' | 'published';
  createdAt: string;
}

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'The Science Behind Ayurvedic Hair Care',
      description: 'Discover how ancient Ayurvedic principles combined with modern science create powerful hair care solutions.',
      content: 'Full content here...',
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1080&h=1080&fit=crop',
      author: 'Dr. Priya Sharma',
      status: 'published',
      createdAt: '2024-01-15'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({});
  const { toast } = useToast();

  const handleSave = () => {
    if (!editingPost.title || !editingPost.description || !editingPost.content) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingPost.id) {
      // Update existing post
      setPosts(prev => prev.map(post => 
        post.id === editingPost.id ? { ...post, ...editingPost } as BlogPost : post
      ));
    } else {
      // Create new post
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: editingPost.title!,
        description: editingPost.description!,
        content: editingPost.content!,
        image: editingPost.image || 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1080&h=1080&fit=crop',
        author: editingPost.author || 'Admin',
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPosts(prev => [newPost, ...prev]);
    }

    setIsEditing(false);
    setEditingPost({});
    toast({
      title: "Blog post saved successfully!"
    });
  };

  const handleDelete = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
    toast({
      title: "Blog post deleted successfully!"
    });
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
        <Button
          onClick={() => setIsEditing(true)}
          className="bg-gradient-to-r from-accent to-green-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      {/* Blog Post Editor */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPost.id ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter blog post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <Input
                  value={editingPost.author || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                value={editingPost.description || ''}
                onChange={(e) => setEditingPost(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the blog post"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Featured Image (1080x1080px recommended)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="blog-image"
                />
                <label
                  htmlFor="blog-image"
                  className="flex items-center space-x-2 px-4 py-2 border border-accent/30 rounded-lg hover:bg-accent/5 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </label>
                {editingPost.image && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <img
                      src={editingPost.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <Textarea
                value={editingPost.content || ''}
                onChange={(e) => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Full blog post content (HTML supported)"
                rows={10}
              />
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleSave} className="bg-gradient-to-r from-accent to-green-600">
                Save Post
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingPost({});
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blog Posts List */}
      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{post.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">{post.description}</p>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingPost(post);
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700"
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
    </div>
  );
};

export default BlogManagement;