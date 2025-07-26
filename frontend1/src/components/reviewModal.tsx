import { useState } from "react"
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

export default function ReviewModal({ product, open, setModal }) {
  const [rating, setRating] = useState(product?.rating || 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  const handleSubmit = () => {
    console.log("Submit review for:", product.name)
    console.log("Rating:", rating)
    console.log("Review:", reviewText)
 
    setRating(0)
    setReviewText("")
  }

  return (
    <Dialog open={open} onOpenChange={setModal}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 cursor-pointer transition-colors ${
                i < product?.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review for {product.name}</DialogTitle>
        </DialogHeader>

        {/* Star rating selection */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i + 1)}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                (hoverRating || rating) > i
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Review Textarea */}
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
          <Button onClick={handleSubmit} disabled={rating === 0}>
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
