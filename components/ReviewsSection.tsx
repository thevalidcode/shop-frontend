"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Review } from "@/types";
import { Star, Trash2, CheckCircle, Clock, Edit } from "lucide-react";
import { useAppContext } from "@/context/appContext";
import {
  useGetProductReviews,
  useCreateReview,
  useDeleteReview,
} from "@/hooks/use-review";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Loading from "@/app/loading";
import DeleteDialog from "@/app/admin/components/DeleteDialog";

interface ReviewsSectionProps {
  productUid: string;
}

export default function ReviewsSection({ productUid }: ReviewsSectionProps) {
  const { userInfo } = useAppContext();
  const { data: reviews = [], isLoading } = useGetProductReviews(productUid);
  const createReview = useCreateReview();
  const deleteReview = useDeleteReview();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [deleteUid, setDeleteUid] = useState<string | null>(null);
  if (isLoading) {
    return <Loading />;
  }
  // Calculate stats
  const approvedReviews = reviews.filter((r) => r.status === "APPROVED");
  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
        approvedReviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: approvedReviews.filter((r) => r.rating === stars).length,
    percentage:
      approvedReviews.length > 0
        ? (approvedReviews.filter((r) => r.rating === stars).length /
            approvedReviews.length) *
          100
        : 0,
  }));

  const handleSubmitReview = async () => {
    if (!userInfo) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    await createReview.mutateAsync({
      productUid,
      rating,
      title: title.trim() || undefined,
      comment: comment.trim() || undefined,
    });

    // Reset form
    setRating(0);
    setTitle("");
    setComment("");
    setIsDialogOpen(false);
  };

  const handleDeleteReview = async () => {
    if (!deleteUid) return;
    await deleteReview.mutateAsync({ uid: deleteUid });
    setDeleteUid(null);
  };

  const userHasReviewed = reviews.some((r) => r.userUid === userInfo?.uid);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              ({approvedReviews.length}{" "}
              {approvedReviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {userInfo && !userHasReviewed && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto">
                <Edit className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Write Your Review</DialogTitle>
                <DialogDescription>
                  Share your experience with this product
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Star Rating */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        title="star"
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoverRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Review Title (Optional)
                  </label>
                  <Input
                    placeholder="Sum up your experience"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Your Review (Optional)
                  </label>
                  <Textarea
                    placeholder="Tell us what you think..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {comment.length}/1000
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={createReview.isPending || rating === 0}
                  className="flex-1"
                >
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Rating Distribution */}
      {approvedReviews.length > 0 && (
        <Card className="p-6 bg-muted/30">
          <div className="space-y-3">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium">{stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-yellow-400 transition-all"
                    style={{ width: `${percentage}%` } as React.CSSProperties}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading reviews...
          </div>
        ) : approvedReviews.length === 0 ? (
          <Card className="p-12 text-center bg-muted/30">
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share your experience!
            </p>
            {userInfo && !userHasReviewed && (
              <Button onClick={() => setIsDialogOpen(true)}>
                Write the First Review
              </Button>
            )}
          </Card>
        ) : (
          approvedReviews.map((review) => (
            <Card
              key={review.uid}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={review.user?.image || undefined} />
                  <AvatarFallback>
                    {review.user?.fullName?.[0] ||
                      review.user?.username?.[0] ||
                      "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {review.user?.fullName || review.user?.username}
                        </p>
                        {review.isVerified && (
                          <Badge
                            variant="secondary"
                            className="text-xs gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(review.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    {userInfo?.uid === review.userUid && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteUid(review.uid)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Content */}
                  {review.title && (
                    <h4 className="font-semibold mb-1">{review.title}</h4>
                  )}
                  {review.comment && (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}

        {/* Show pending reviews to the user who created them */}
        {userInfo &&
          reviews
            .filter((r) => r.userUid === userInfo.uid && r.status === "PENDING")
            .map((review) => (
              <Card
                key={review.uid}
                className="p-6 border-dashed border-2 bg-muted/30"
              >
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={userInfo.image || undefined} />
                    <AvatarFallback>
                      {userInfo.fullName?.[0] || userInfo.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {userInfo.fullName || userInfo.username}
                          </p>
                          <Badge
                            variant="secondary"
                            className="text-xs gap-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          >
                            <Clock className="h-3 w-3" />
                            Pending Approval
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(review.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteUid(review.uid)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {review.title && (
                      <h4 className="font-semibold mb-1">{review.title}</h4>
                    )}
                    {review.comment && (
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={!!deleteUid}
        onOpenChange={(open: boolean) => !open && setDeleteUid(null)}
        onConfirm={handleDeleteReview}
        count={1}
        names={["your review"]}
        entityName="review"
      />
    </div>
  );
}
