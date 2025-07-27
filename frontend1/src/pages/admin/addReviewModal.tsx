import { useState, useEffect } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addProductReview , getAllProduct } from "@/services/admin/productService";
import { getUserFromToken } from "@/Utils/TokenData";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";

export default function ReviewModal({open, setModal }) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [reviewText, setReviewText] = useState("")
    const [userName, setUserName] = useState("")
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");

    useEffect(() => {
        if (open) {
            setRating(0)
            setReviewText("")
            fetchProducts();
        }
    }, [open])

    const handleSubmit = async () => {
        if (rating === 0) return
        try {
            await addProductReview({rating, comment: reviewText, user: userName, productId: selectedProduct});
            setModal(false)
            setRating(0)
            setReviewText("")
            setSelectedProduct("");
            setUserName("");
        } catch (err) {
            console.error("Failed to submit review:", err)
        }
    }

    const fetchProducts = async () => {
        try {
            const data = await getAllProduct();
            if(data.status !== 'success') {
                throw new Error(data.message || 'Failed to fetch products');
            }
            setProducts(data.products);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setModal}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Review</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            onMouseEnter={() => setHoverRating(i + 1)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(i + 1)}
                            className={`w-6 h-6 cursor-pointer transition-colors ${(hoverRating || rating) > i
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                        />
                    ))}
                </div>
                <div>
                    <Input
                        placeholder="Your Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mb-4"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="status">Category</Label>
                      <select
                        id="status"
                        value={selectedProduct}
                        onChange={(e) =>
                          setSelectedProduct(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-input rounded-md"
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                </div>
                <div>
                </div>
                <textarea
                    className="w-full border rounded-md p-2 text-sm"
                    rows={4}
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                />

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={rating === 0 || !selectedProduct || !userName}>
                        Submit Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
