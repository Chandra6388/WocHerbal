
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { addNewCategory , getCategory, deleteCategory, updateCategory} from '@/services/admin/productService';
interface Category {
    _id?: string
    name: string;
    status: 'active' | 'inactive' | 'out-of-stock';
}

const Categorys = () => {
    const [category, setCategory] = useState<Category[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');



    const getAllCategory = () => {
        getCategory()
        .then(data => {
                if (data?.status == "success") {
                    setCategory(data.allCategory);

                }
                else {
                    setCategory([]);
                }
            })
            .catch(error => {
                toast.error('Failed to fetch products');
                console.error(error);
            });
    }

    useEffect(() => {
        getAllCategory();
    }, []);

    const [formData, setFormData] = useState({
        _id: "",
        name: '',
        status: 'active' as 'active' | 'inactive' | 'out-of-stock',
    });


    const filteredCategory = category?.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAddProduct = () => {
        setEditingCategory(null);
        setFormData({ _id: "", name: '', status: 'active', });
        setIsDialogOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setFormData({ _id: category._id, name: category.name, status: category.status, });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const productData = { ...formData, };
        if (editingCategory) {
            await updateCategory(productData)
                .then(() => {
                    getAllCategory()
                    toast.success('Product Updated successfully!');
                    setIsDialogOpen(false);
                })
                .catch((error) => {
                    toast.error('Failed to add product');
                    console.error(error);
                });

        } else {
            const newCategory: Category = { ...productData };
            const { _id, ...productWithoutId } = newCategory;
            await addNewCategory(productWithoutId)
                .then(() => {
                    setCategory([...category, newCategory]);
                    toast.success('Product added successfully!');
                    setIsDialogOpen(false);
                })
                .catch((error) => {
                    toast.error('Failed to add product');
                    console.error(error);
                });
        }


    };

    const handleDeleteProduct = async (id: string) => {
        const req = {id:id}
        await deleteCategory(req)
            .then((res) => {
                if (res?.status == "success") {
                    getAllCategory()
                    toast.success('Product deleted successfully!');
                }
                else {
                    toast.error(res?.message);
                }
            })
            .catch((error) => {
                toast.error("some error in delete product");
            })

    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'inactive':
                return <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Category</h1>
                    <p className="text-muted-foreground">Manage and organize all your product categories easily</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <div className=''>
                        <DialogTrigger asChild>
                            <Button onClick={handleAddProduct}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Category
                            </Button>
                        </DialogTrigger>
                    </div>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                            <DialogDescription>
                                {editingCategory ? 'Update category' : 'Create a new category for your store'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Category Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'out-of-stock' })}
                                        className="w-full px-3 py-2 border border-input rounded-md"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button type="submit" className="">
                                    {editingCategory ? 'Update Category' : 'Add Category'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Category</CardTitle>
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
                            </select>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCategory?.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <p className="font-medium">{product.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditCategory(product)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product._id)}>
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

export default Categorys;
