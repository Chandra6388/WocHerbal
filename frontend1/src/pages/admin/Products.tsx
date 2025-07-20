import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  Image,
  Upload,
  X,
  Eye,
  Search,
  Filter,
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  getAllProducts,
  addNewProduct,
  updateNewProduct,
  deleteProduct,
  updateProductStatus,
  getoverallRevenue,
  getCategory,
} from "@/services/admin/productService";
interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  benefits: string;
  images: string;
  category: {
    name: string;
    _id:string
  };
  stock: number;
  soldCount?: number;
  status: "active" | "inactive" | "out-of-stock";
  tags: string[];
  weight: string;
  rating: number;
  reviews: {
    user: string;
    name: string;
    rating: number;
    comment: string;
  }[];
}

interface Category {
  _id?: string;
  name: string;
  status: "active" | "inactive" | "out-of-stock";
}
const Products = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [totalRevenueState, setTotalRevenueState] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    getProducts();
    handleGetOverallRevenue();
    getAllCategory();
  }, []);

  const getProducts = () => {
    const req = { user: "admin" };
    getAllProducts(req)
      .then((data) => {
        if (data?.status === "success" && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
          toast({
            title: "No Products Found",
            description: "There are no products available at the moment.",
            variant: "info",
            duration: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("getProducts error:", error);
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred while fetching products.";
        setProducts([]);
        toast({
          title: "Error Loading Products",
          description: errMsg,
          variant: "destructive",
          duration: 4000,
        });
      });
  };

  const getAllCategory = () => {
    getCategory()
      .then((data) => {
        if (data?.status === "success" && Array.isArray(data.allCategory)) {
          if (data.allCategory.length > 0) {
            setFormData((prev) => ({
              ...prev,
              category: data.allCategory[0]?._id,
            }));
            setCategory(data.allCategory);
          } else {
            setCategory([]);
            toast({
              title: "No Categories Found",
              description: "Please add at least one category to proceed.",
              variant: "info",
              duration: 3000,
            });
          }
        } else {
          setCategory([]);
          toast({
            title: "Unable to Load Categories",
            description: "Something went wrong. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("getAllCategory error:", error);

        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred while fetching categories.";

        setCategory([]);
        toast({
          title: "Error Fetching Categories",
          description: errMsg,
          variant: "destructive",
          duration: 4000,
        });
      });
  };

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    benefits: "",
    category: "",
    stock: "",
    status: "active" as "active" | "inactive" | "out-of-stock",
    tags: "",
    weight: "",
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImagePreview(imageUrl);
        setSelectedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      _id: "",
      name: "",
      price: "",
      originalPrice: "",
      description: "",
      benefits: "",
      category: "",
      stock: "",
      status: "active",
      tags: "",
      weight: "",
    });
    setImagePreview(null);
    setSelectedImage(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      _id: product._id,
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      description: product.description,
      benefits: product.benefits,
      category: product.category?._id,
      stock: product.stock.toString(),
      status: product.status,
      tags: product.tags.join(", "),
      weight: product.weight,
    });
    setImagePreview(product.images);
    setSelectedImage(product.images);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.name || !formData.price || !formData.stock || !formData.category) {
        toast({
          title: "Missing Required Fields",
          description: "Please fill out all mandatory fields before submitting.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        images: selectedImage || "/placeholder.svg",
      };

      if (editingProduct) {
        const req = {
          id: formData._id,
          productData,
        };

        await updateNewProduct(req);
        toast({
          title: "Product Updated",
          description: `${formData.name} has been successfully updated.`,
          variant: "success",
          duration: 3000,
        });
        getProducts()
      } else {
        const newProduct = {
          ...productData,
          soldCount: 0,
          rating: 0,
          reviews: [],
        };

        const { _id, ...productWithoutId } = newProduct;
        const response = await addNewProduct(productWithoutId);

        setProducts((prev) => [...prev, response?.product || newProduct]);
        toast({
          title: "Product Added",
          description: `${formData.name} has been successfully added.`,
          variant: "success",
          duration: 3000,
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Product submission error:", error);
      toast({
        title: "Something went wrong",
        description:
          error?.response?.data?.error ||
          error?.error ||
          "An unexpected error occurred while saving the product.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await deleteProduct(id);

      if (res?.status === "success") {
        toast({
          title: "Product Deleted",
          description: "The product was deleted successfully.",
          variant: "success",
          duration: 3000,
        });

        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        toast({
          title: "Deletion Failed",
          description: res?.message || "Could not delete the product. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Product deletion error:", error);

      toast({
        title: "Server Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred while deleting the product.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>
        );
      case "out-of-stock":
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const lowStockProducts = products.filter(
    (p) => p.stock <= 10 && p.stock > 0
  ).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const totalSales = products.reduce((sum, p) => sum + p.soldCount, 0);


  const handleStatusChange = async (
    productId: string,
    status: "active" | "inactive" | "out-of-stock"
  ) => {
    try {
      const res = await updateProductStatus(productId, status);

      if (res?.status === "success") {
        toast({
          title: "Status Updated",
          description: `Product marked as "${status.replace(/-/g, " ")}".`,
          variant: "success",
          duration: 3000,
        });

        getProducts();
      } else {
        toast({
          title: "Update Failed",
          description: res?.message || "Could not update the product status.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Product status update error:", error);

      toast({
        title: "Server Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred while updating status.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const handleGetOverallRevenue = async () => {
    try {
      const res = await getoverallRevenue();
      if (res?.success) {
        setTotalRevenueState(res.overallRevenue);
      } else {
        toast({
          title: "Unable to Fetch Revenue",
          description: res?.message || "Unexpected response received.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Revenue fetch error:", error);
      toast({
        title: "Server Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred while fetching revenue.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your herbal oil products and inventory
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update product information"
                  : "Create a new product for your store"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (₹)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            originalPrice: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits</Label>
                    <Textarea
                      id="benefits"
                      value={formData.benefits}
                      onChange={(e) =>
                        setFormData({ ...formData, benefits: e.target.value })
                      }
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImagePreview(null);
                              setSelectedImage(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            Click to upload product image
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-2 w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Category</Label>
                      <select
                        id="status"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-input rounded-md"
                      >
                        {
                          category?.map((item) => {
                            return <option value={item?._id}>{item?.name}</option>
                          })
                        }
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight/Volume</Label>
                      <Input
                        id="weight"
                        value={formData.weight}
                        onChange={(e) =>
                          setFormData({ ...formData, weight: e.target.value })
                        }
                        placeholder="e.g. 100ml"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as
                              | "active"
                              | "inactive"
                              | "out-of-stock",
                          })
                        }
                        className="w-full px-3 py-2 border border-input rounded-md"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="out-of-stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="e.g. ayurvedic, herbal, organic"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">

                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeProducts}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{lowStockProducts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{outOfStockProducts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{totalSales}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenueState}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                {/* <TableHead>SKU</TableHead> */}
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {product.images ? (
                          <img
                            src={product.images}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.weight}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    <span className="font-mono text-sm">{product.sku}</span>
                  </TableCell> */}
                  <TableCell>{product.category?.name}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-semibold">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${product.stock === 0
                        ? "text-red-600"
                        : product.stock <= 10
                          ? "text-yellow-600"
                          : "text-green-600"
                        }`}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>{product.soldCount}</TableCell>
                  <TableCell>
                    <select
                      value={product.status}
                      onChange={(e) =>
                        handleStatusChange(
                          product._id!,
                          e.target.value as
                          | "active"
                          | "inactive"
                          | "out-of-stock"
                        )
                      }
                      className="px-2 py-1 border rounded"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
