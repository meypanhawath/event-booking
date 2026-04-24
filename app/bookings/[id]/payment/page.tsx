"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ImageUp, LoaderCircle, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notifyError, notifySuccess, notifyWarning } from "@/lib/toast";
import {
  useGetMyBookingsQuery,
  useUploadPaymentProofMutation,
} from "@/lib/features/bookings/bookingApi";

function getApiErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Please try again.";
  }

  const maybe = error as {
    status?: number | string;
    data?: unknown;
    error?: string;
    message?: string;
  };

  if (typeof maybe.message === "string" && maybe.message.trim()) {
    return maybe.message;
  }

  if (typeof maybe.error === "string" && maybe.error.trim()) {
    return maybe.error;
  }

  if (typeof maybe.data === "string" && maybe.data.trim()) {
    return maybe.data;
  }

  if (maybe.data && typeof maybe.data === "object") {
    const dataObj = maybe.data as { message?: unknown; details?: unknown };
    if (typeof dataObj.message === "string" && dataObj.message.trim()) {
      return dataObj.message;
    }
    if (typeof dataObj.details === "string" && dataObj.details.trim()) {
      return dataObj.details;
    }
    try {
      return JSON.stringify(maybe.data);
    } catch {
      // ignore
    }
  }

  if (maybe.status) {
    return `Request failed (${String(maybe.status)}).`;
  }

  return "Please try again.";
}

export default function BookingPaymentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bookingId = Number(params.id);
  const isValidId = Number.isFinite(bookingId);

  const { data, isLoading, isError } = useGetMyBookingsQuery({
    page: 0,
    size: 50,
  });
  const booking = useMemo(
    () => data?.content?.find((item) => item.id === bookingId) ?? null,
    [bookingId, data?.content],
  );

  const [file, setFile] = useState<File | null>(null);
  const [uploadPaymentProof, { isLoading: isSubmitting }] =
    useUploadPaymentProofMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isValidId) {
      notifyError("Invalid booking id.", "Please go back and try again.");
      return;
    }

    if (!file) {
      notifyWarning("Payment proof required.", "Please upload an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/v1/files/upload?folder=payment-proof", {
        method: "POST",
        body: formData,
      });

      const uploadData = (await uploadResponse.json().catch(() => null)) as
        | { path?: string; fullUrl?: string; message?: string }
        | null;

      if (!uploadResponse.ok || !uploadData?.path) {
        throw new Error(uploadData?.message || "Failed to upload payment proof.");
      }

      await uploadPaymentProof({
        bookingId,
        proofPath: uploadData.path,
      }).unwrap();

      notifySuccess("Payment proof uploaded.", "We will verify your payment soon.");
      router.push("/user/dashboard/bookings");
      router.refresh();
    } catch (error) {
      notifyError("Payment failed.", getApiErrorMessage(error));
    }
  };

  if (!isValidId) {
    return (
      <main className="min-h-screen bg-background px-4 py-12 text-foreground">
        <div className="mx-auto w-full max-w-2xl">
          <p className="text-sm text-destructive">Invalid booking id.</p>
          <Link href="/user/dashboard/bookings" className="mt-4 inline-flex text-sm text-primary hover:underline">
            Back to bookings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/user/dashboard/bookings"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to bookings
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="size-5 text-[#C14FE6]" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Loading booking...
              </div>
            ) : isError ? (
              <p className="text-sm text-destructive">Failed to load booking.</p>
            ) : !booking ? (
              <p className="text-sm text-muted-foreground">
                Booking not found in your account. Make sure you are signed in with the same user.
              </p>
            ) : (
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-sm font-semibold text-foreground">{booking.event.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Total:{" "}
                  <span className="font-semibold text-[#C14FE6]">
                    ${booking.totalAmount.toFixed(2)}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Status: {booking.status}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="proof">Upload payment proof (image)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="proof"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  <ImageUp className="size-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a screenshot/photo of your transfer receipt.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Link href="/user/dashboard/bookings">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="size-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Proof"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

