"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";

type SignOutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
};

export function SignOutDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
}: SignOutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-sm rounded-3xl p-0">
        <div className="space-y-5 p-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <LogOut className="size-6" />
          </div>
          <DialogHeader className="gap-2">
            <DialogTitle className="text-xl">Sign out?</DialogTitle>
            <DialogDescription>
              You will be returned to the landing page and need to sign in again to access your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={isSubmitting} className="bg-red-600 text-white hover:bg-red-700">
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Confirm sign out
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
