"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  count: number;
  names?: string[];
  entityName?: string;
  isDeleting?: boolean;
  maxVisibleNames?: number;
}

export default function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  count,
  names = [],
  entityName = "item",
  isDeleting = false,
  maxVisibleNames = 5,
}: DeleteDialogProps) {
  const isMultiple = count > 1;
  const pluralEntity = isMultiple ? `${entityName}s` : entityName;
  const title = isMultiple
    ? `Delete ${count} ${pluralEntity}?`
    : `Delete ${entityName}?`;
  
  const visibleNames = names.slice(0, maxVisibleNames);
  const remainingCount = Math.max(0, names.length - maxVisibleNames);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] p-0 overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isMultiple
              ? `This action cannot be undone. These ${count} ${pluralEntity} will be permanently deleted.`
              : `This action cannot be undone. This ${entityName} will be permanently deleted.`}
          </DialogDescription>
        </DialogHeader>

        {names.length > 0 && (
          <div className="px-6 py-4">
            <div className="rounded-md bg-muted/50 p-4 border">
              <ul className="space-y-1.5 text-sm">
                {visibleNames.map((name, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="flex-1 wrap-break-word">{name}</span>
                  </li>
                ))}
                {remainingCount > 0 && (
                  <li className="flex items-start gap-2 text-muted-foreground italic">
                    <span>•</span>
                    <span>and {remainingCount} more...</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <DialogFooter className="px-6 py-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {isMultiple ? pluralEntity : entityName}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

