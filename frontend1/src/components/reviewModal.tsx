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
import { createProductReview } from "@/services/productsServices"
import { getUserFromToken } from "@/Utils/TokenData";
import { getUserProfile } from "@/services/authSerives";
import { useToast } from "../hooks/use-toast";

export default function ReviewModal({ product, open, setModal }) {
    const { toast } = useToast();

    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [reviewText, setReviewText] = useState("")
    const userdata = getUserFromToken() as { id: string };
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (product) {
            setRating(0)
            setReviewText("")
            getProfiledata();
        }
    }, [product])


    const getProfiledata = () => {
        getUserProfile({ id: userdata?.id })
            .then((res) => {
                if (res?.status === "success") {
                    setUserName(res?.user?.name);
                }
            })
            .catch(() => {
                toast({
                    title: "Error",
                    description: "Failed to fetch profile data.",
                    variant: "destructive",
                });
            });
    };

    const handleSubmit = async () => {
        if (!product?.product || rating === 0) return
        try {
            await createProductReview({
                productId: product.product,
                rating,
                comment: reviewText,
                userName: userName,
            })

            setModal(false)
            setRating(0)
            setReviewText("")
        } catch (err) {
            console.error("Failed to submit review:", err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review for {product?.name}</DialogTitle>
                </DialogHeader>

                {/* ⭐ Star Rating */}
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

                {/* 📝 Review Text */}
                <textarea
                    className="w-full border rounded-md p-2 text-sm"
                    rows={4}
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                />

                {/* ✅ Buttons */}
                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={rating === 0}>
                        Submit Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
