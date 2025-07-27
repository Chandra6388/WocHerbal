
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Check, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import AddReviewModal from './addReviewModal'; // Adjust the import path as necessary

interface Review {
  id: string;
  customerName: string;
  rating: number;
  message: string;
  product: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const Reviews = () => {
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      customerName: 'Priya Sharma',
      rating: 5,
      message: 'Excellent quality lavender oil! Very relaxing and helps with sleep.',
      product: 'Organic Lavender Oil',
      date: '2024-01-15',
      status: 'pending'
    },
    {
      id: '2',
      customerName: 'Raj Kumar',
      rating: 4,
      message: 'Good tea tree oil, effective for acne treatment.',
      product: 'Tea Tree Oil',
      date: '2024-01-14',
      status: 'approved'
    },
    {
      id: '3',
      customerName: 'Anita Patel',
      rating: 5,
      message: 'Amazing product! Fast delivery and excellent packaging.',
      product: 'Organic Lavender Oil',
      date: '2024-01-13',
      status: 'approved'
    }
  ]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const handleApproveReview = (id: string) => {
    setReviews(reviews.map(review =>
      review.id === id ? { ...review, status: 'approved' as const } : review
    ));
    toast.success('Review approved successfully!');
  };

  const handleDeleteReview = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id));
    toast.success('Review deleted successfully!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className='flex items-center justify-between mb-4'>
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">Manage customer reviews and feedback</p>
      </div>
      <div>
        <Button className="btn btn-primary" onClick={() => { setOpen(true); }}><Plus/> Add Review</Button>
      </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.customerName}</TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm truncate">{review.message}</p>
                    </div>
                  </TableCell>
                  <TableCell>{review.product}</TableCell>
                  <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {review.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveReview(review.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
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

      <AddReviewModal open={open} setModal={setOpen} />
    </div>
  );
};

export default Reviews;
