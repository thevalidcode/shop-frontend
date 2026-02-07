"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Review } from "@/types";
import {
  Star,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  ThumbsUp,
  Shield,
} from "lucide-react";
import {
  useGetAllReviews,
  useApproveReview,
  useDeleteReviewAdmin,
} from "@/hooks/use-review";
import { formatDistanceToNow } from "date-fns";
import DeleteDialog from "@/app/admin/components/DeleteDialog";

interface ReviewsManagementProps {
  productUid?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReviewsManagement({
  productUid,
  open,
  onOpenChange,
}: ReviewsManagementProps) {
  const { data: allReviews = [], isLoading } = useGetAllReviews();
  const approveReview = useApproveReview();
  const deleteReview = useDeleteReviewAdmin();

  const [selectedTab, setSelectedTab] = useState<
    "pending" | "approved" | "all"
  >("pending");
  const [deleteUid, setDeleteUid] = useState<string | null>(null);
  const [approveUid, setApproveUid] = useState<string | null>(null);

  // Filter reviews by product if productUid is provided
  const reviews = productUid
    ? allReviews.filter((r) => r.productUid === productUid)
    : allReviews;

  const pendingReviews = reviews.filter((r) => r.status === "PENDING");
  const approvedReviews = reviews.filter((r) => r.status === "APPROVED");
  const rejectedReviews = reviews.filter((r) => r.status === "REJECTED");

  const handleApprove = async () => {
    if (!approveUid) return;
    await approveReview.mutateAsync({ uid: approveUid });
    setApproveUid(null);
  };

  const handleDelete = async () => {
    if (!deleteUid) return;
    await deleteReview.mutateAsync({ uid: deleteUid });
    setDeleteUid(null);
  };

  const ReviewCard = ({ review }: { review: Review }) => (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={review.user?.image || undefined} />
          <AvatarFallback>
            {review.user?.fullName?.[0] || review.user?.username?.[0] || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">
                  {review.user?.fullName || review.user?.username}
                </p>
                <Badge
                  variant={
                    review.status === "APPROVED"
                      ? "default"
                      : review.status === "PENDING"
                        ? "secondary"
                        : "destructive"
                  }
                  className={
                    review.status === "PENDING"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : ""
                  }
                >
                  {review.status === "PENDING" && (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {review.status === "APPROVED" && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {review.status === "REJECTED" && (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {review.status}
                </Badge>
                {review.isVerified && (
                  <Badge
                    variant="outline"
                    className="text-xs gap-1 border-green-500 text-green-700 dark:text-green-400"
                  >
                    <Shield className="h-3 w-3" />
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

              <div className="text-xs text-muted-foreground mt-1">
                Review ID: <code className="font-mono">{review.uid}</code>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              {review.status === "PENDING" && (
                <Button
                  size="sm"
                  onClick={() => setApproveUid(review.uid)}
                  className="gap-1"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Approve
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteUid(review.uid)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {review.title && (
            <h4 className="font-semibold mb-1 mt-3">{review.title}</h4>
          )}
          {review.comment && (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-4xl xl:max-w-5xl max-h-[95vh] p-0 gap-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-6 py-4 border-b bg-background shrink-0">
            <DialogTitle className="text-xl font-semibold">
              {productUid ? "Product Reviews" : "All Reviews"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <Tabs
              value={selectedTab}
              onValueChange={(v) =>
                setSelectedTab(v as "pending" | "approved" | "all")
              }
              className="h-full flex flex-col"
            >
              <TabsList className="w-full justify-start rounded-none border-b px-6 bg-background h-auto p-0">
                <TabsTrigger
                  value="pending"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent relative"
                >
                  Pending
                  {pendingReviews.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    >
                      {pendingReviews.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Approved
                  {approvedReviews.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {approvedReviews.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  All Reviews
                  <Badge variant="secondary" className="ml-2">
                    {reviews.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="pending" className="mt-0 space-y-4">
                  {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Loading reviews...
                    </div>
                  ) : pendingReviews.length === 0 ? (
                    <Card className="p-12 text-center bg-muted/30">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">
                        No pending reviews
                      </h3>
                      <p className="text-muted-foreground">
                        All reviews have been processed
                      </p>
                    </Card>
                  ) : (
                    pendingReviews.map((review) => (
                      <ReviewCard key={review.uid} review={review} />
                    ))
                  )}
                </TabsContent>

                <TabsContent value="approved" className="mt-0 space-y-4">
                  {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Loading reviews...
                    </div>
                  ) : approvedReviews.length === 0 ? (
                    <Card className="p-12 text-center bg-muted/30">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">
                        No approved reviews
                      </h3>
                      <p className="text-muted-foreground">
                        Approved reviews will appear here
                      </p>
                    </Card>
                  ) : (
                    approvedReviews.map((review) => (
                      <ReviewCard key={review.uid} review={review} />
                    ))
                  )}
                </TabsContent>

                <TabsContent value="all" className="mt-0 space-y-4">
                  {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Loading reviews...
                    </div>
                  ) : reviews.length === 0 ? (
                    <Card className="p-12 text-center bg-muted/30">
                      <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-muted-foreground">
                        Customer reviews will appear here
                      </p>
                    </Card>
                  ) : (
                    reviews.map((review) => (
                      <ReviewCard key={review.uid} review={review} />
                    ))
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog
        open={!!approveUid}
        onOpenChange={() => setApproveUid(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Review?</AlertDialogTitle>
            <AlertDialogDescription>
              This review will be published and visible to all customers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {approveReview.isPending ? "Approving..." : "Approve"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={!!deleteUid}
        onOpenChange={(open: boolean) => !open && setDeleteUid(null)}
        onConfirm={handleDelete}
        count={1}
        names={["this review"]}
        entityName="review"
      />
    </>
  );
}
