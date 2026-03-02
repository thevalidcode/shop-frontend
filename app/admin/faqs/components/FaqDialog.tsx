"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFaq, useUpdateFaq } from "@/hooks/use-faqs";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/appContext";
import { FeatureGate } from "@/components/FeatureGate";

interface Faq {
  uid?: string;
  question: string;
  answer: string;
}

interface FaqDialogProps {
  isOpen: boolean;
  onClose: () => void;
  faq: Faq | null;
  isEdit: boolean;
}

export default function FaqDialog({
  isOpen,
  onClose,
  faq,
  isEdit,
}: FaqDialogProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const { mutate: createFaq } = useCreateFaq();
  const { mutate: updateFaq } = useUpdateFaq();
  const queryClient = useQueryClient();
  const { shopInfo } = useAppContext();
  const isSubscriptionActive = shopInfo?.subscriptionStatus === "ACTIVE";

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
    } else {
      setQuestion("");
      setAnswer("");
    }
  }, [faq]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and Answer cannot be empty.");
      return;
    }

    if (isEdit && faq?.uid) {
      updateFaq(
        { uid: faq.uid, question, answer },
        {
          onSuccess: () => {
            toast.success("FAQ updated successfully");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            onClose();
          },
          onError: (error: unknown) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to update FAQ"
            );
          },
        }
      );
    } else {
      // Generate slug from question
      const slug = question.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 100);
      
      createFaq(
        { question, answer, slug },
        {
          onSuccess: () => {
            toast.success("FAQ created successfully");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            onClose();
          },
          onError: (error: unknown) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to create FAQ"
            );
          },
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <>
                <Pencil className="h-5 w-5 text-blue-500" />
                Edit FAQ
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-green-500" />
                Create New FAQ
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Make changes to your FAQ here. Click save when you're done."
              : "Add a new question and answer to help your users."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-medium">
              Question
            </Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here..."
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="answer" className="text-sm font-medium">
              Answer
            </Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              required
              className="min-h-[120px] resize-none"
            />
          </div>

          <DialogFooter className="px-6 py-4 border-t gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <FeatureGate
              isAllowed={isSubscriptionActive}
              featureLabel="FAQ Management"
              description="Your subscription must be active to create or update FAQs. Please renew your subscription to continue."
              variant="tooltip"
            >
              <Button type="submit" className="gap-2 cursor-pointer">
                {isEdit ? (
                  <>
                    <Pencil className="h-4 w-4" />
                    Update FAQ
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create FAQ
                  </>
                )}
              </Button>
            </FeatureGate>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
