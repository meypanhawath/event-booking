"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Armchair,
  Bookmark,
  Calendar,
  Clock3,
  MapPin,
  Share2,
} from "lucide-react";
import VenueMap from "@/components/ui/venue-map";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useGetEventByIdQuery,
  useGetEventsQuery,
} from "@/lib/features/events/eventsApi";
import { useCreateBookingMutation } from "@/lib/features/bookings/bookingApi";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import type { Ticket } from "@/lib/types/event";
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
import { Button } from "@/components/ui/button";
import { notifyError, notifySuccess, notifyWarning } from "@/lib/toast";

const FETCH_SIZE = 200;

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

const bookingFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  username: z.string().trim().min(3, "Username must be at least 3 characters."),
  email: z.email("Enter a valid email address."),
  phoneNumber: z
    .string()
    .trim()
    .min(9, "Phone number must be at least 9 digits.")
    .max(11, "Phone number is too long."),
  quantity: z.number().int().min(1, "Minimum quantity is 1."),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const getTicketBadge = (sectionType: string) => {
  const type = sectionType.trim().toLowerCase();

  if (type.includes("vip")) {
    return "vip";
  }

  if (type.includes("gold") || type.includes("premium")) {
    return "premium";
  }

  if (type.includes("bronze") || type.includes("standard")) {
    return "standard";
  }

  return sectionType;
};

export default function EventTicketsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = Number(params.id);
  const isValidId = Number.isFinite(eventId);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const eventByIdQuery = useGetEventByIdQuery(eventId, {
    skip: !isValidId,
  });
  const { data: currentUser } = useGetMeQuery();
  const [createBooking, { isLoading: isCreatingBooking }] = useCreateBookingMutation();

  const eventsListQuery = useGetEventsQuery(
    {
      page: 0,
      size: FETCH_SIZE,
      sort: "startDate,desc",
    },
    { skip: !isValidId },
  );

  const event =
    eventByIdQuery.data ??
    eventsListQuery.data?.content.find((item) => item.id === eventId);

  const isLoading = eventByIdQuery.isLoading || eventsListQuery.isLoading;
  const hasFatalError = eventByIdQuery.isError && eventsListQuery.isError;
  const error = eventsListQuery.error ?? eventByIdQuery.error;
  const eventTickets = event?.tickets;

  const sortedTickets = useMemo(() => {
    if (!eventTickets) {
      return [];
    }

    return [...eventTickets].sort((a, b) => b.price - a.price);
  }, [eventTickets]);

  const checkoutForm = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phoneNumber: "",
      quantity: 1,
    },
  });

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    checkoutForm.reset({
      firstName: currentUser.firstName ?? "",
      lastName: currentUser.lastName ?? "",
      username: currentUser.username ?? "",
      email: currentUser.email ?? "",
      phoneNumber: currentUser.phoneNumber ?? "",
      quantity: 1,
    });
  }, [checkoutForm, currentUser]);

  useEffect(() => {
    if (!selectedTicket) {
      return;
    }

    const maxAvailable = Math.max(1, selectedTicket.available ?? 1);
    const currentQuantity = checkoutForm.getValues("quantity");

    if (currentQuantity > maxAvailable) {
      checkoutForm.setValue("quantity", maxAvailable, {
        shouldValidate: true,
      });
    }
  }, [checkoutForm, selectedTicket]);

  const handleStartCheckout = (ticket: Ticket) => {
    if (!currentUser?.uuid) {
      notifyWarning("Please sign in first.", "You need an account before continuing to checkout.");
      router.push("/login");
      return;
    }

    setSelectedTicket(ticket);
    checkoutForm.setValue("quantity", 1, { shouldValidate: true });
    setCheckoutOpen(true);
  };

  const handleCheckoutSubmit = checkoutForm.handleSubmit(async (values) => {
    if (!eventId || !Number.isFinite(eventId)) {
      notifyError("Invalid event.", "Please open this page again.");
      return;
    }

    if (!selectedTicket?.id) {
      notifyError("Ticket selection is missing.", "Please choose a zone again.");
      return;
    }

    if (!currentUser?.uuid) {
      notifyWarning("Please sign in first.", "You need an account before continuing to checkout.");
      router.push("/login");
      return;
    }

    const available = selectedTicket.available ?? 0;

    if (values.quantity > available) {
      checkoutForm.setError("quantity", {
        type: "manual",
        message: `Only ${available} ticket${available === 1 ? "" : "s"} left in this zone.`,
      });
      return;
    }

    try {
      const bookingPayload = {
        eventId,
        details: [
          {
            ticketId: selectedTicket.id,
            qty: values.quantity,
          },
        ],
      };

      const booking = await createBooking({
        ...bookingPayload,
      }).unwrap();

      setCheckoutOpen(false);
      setSelectedTicket(null);
      notifySuccess(
        "Booking created.",
        `Your ${selectedTicket.type} reservation is pending payment confirmation.`,
      );
      router.push(`/user/dashboard/bookings`);
      router.refresh();
      return booking;
    } catch (error) {
      console.error("Create booking failed", {
        error,
        eventId,
        ticketId: selectedTicket.id,
        qty: values.quantity,
      });
      notifyError(
        "Checkout failed.",
        getApiErrorMessage(error),
      );
    }
  });

  if (!isValidId) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8">
        <p className="text-sm text-destructive">Invalid event id.</p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-muted" />
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="h-125 animate-pulse rounded-2xl bg-muted" />
            <div className="h-125 animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  if (hasFatalError || !event) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href={`/events/${eventId}`}
            className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to event
          </Link>
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error && "status" in error
              ? `Failed to load tickets (Error ${error.status})`
              : "Failed to load tickets."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8">
        <Link
          href={`/events/${event.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to event detail
        </Link>

        <section className="relative overflow-hidden rounded-2xl border border-zinc-800">
          <Image
            src={event.thumbnailUrl || "/Event.jpg"}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, 1280px"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/65 to-[#101117]" />

          <div className="absolute inset-0 flex items-end p-4 sm:p-6">
            <div className="w-full">
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-200">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {formatShortDate(event.startDate)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {event.organizer?.orgName ?? "Event venue"}
                </span>
                <span className="inline-flex items-center gap-1.5">
	                  <Armchair className="size-3.5" />
	                  {event.tickets.reduce(
	                    (acc, ticket) => acc + (ticket.available ?? 0),
	                    0,
	                  )}{" "}
	                  seats
	                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <VenueMap
            eventTitle={event.title}
            tickets={event.tickets}
            onBuyTicket={handleStartCheckout}
          />
          <aside className="space-y-3 xl:sticky xl:top-6 xl:h-fit">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              <span>{sortedTickets.length} Listings</span>
              <span>Sort by Price</span>
            </div>

            {sortedTickets.length > 0 ? (
              sortedTickets.map((ticket) => (
                <article
                  key={ticket.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        Section {ticket.type}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {ticket.available} tickets, seated together
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-brand-main">
                      ${ticket.price}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        /per
                      </span>
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-600 dark:text-amber-300">
                      {getTicketBadge(ticket.type)}
                    </span>
                    <div className="inline-flex items-center gap-2 text-muted-foreground">
                      <button
                        type="button"
                        className="rounded-md p-1 transition hover:bg-muted hover:text-foreground"
                      >
                        <Share2 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartCheckout(ticket)}
                        disabled={(ticket.available ?? 0) < 1}
                        className="rounded-full bg-brand-main px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-main/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Buy
                      </button>
                      <button
                        type="button"
                        className="rounded-md p-1 transition hover:bg-muted hover:text-foreground"
                      >
                        <Bookmark className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                No ticket listings available.
              </div>
            )}
          </aside>
        </section>
      </div>

      <Dialog
        open={checkoutOpen}
        onOpenChange={(open) => {
          setCheckoutOpen(open);
          if (!open) {
            setSelectedTicket(null);
            checkoutForm.reset({
              firstName: currentUser?.firstName ?? "",
              lastName: currentUser?.lastName ?? "",
              username: currentUser?.username ?? "",
              email: currentUser?.email ?? "",
              phoneNumber: currentUser?.phoneNumber ?? "",
              quantity: 1,
            });
          }
        }}
      >
        <DialogContent className="max-w-xl rounded-3xl p-0">
          <div className="p-6 sm:p-7">
            <DialogHeader className="gap-2 text-left">
              <DialogTitle className="text-2xl tracking-tight">Complete Your Booking</DialogTitle>
              <DialogDescription>
                Fill in your contact details before we reserve your {selectedTicket?.type ?? "selected"} ticket.
              </DialogDescription>
            </DialogHeader>

            {selectedTicket ? (
              <div className="mt-5 rounded-2xl border border-border bg-muted/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedTicket.type} zone • {selectedTicket.available ?? 0} left
                    </p>
                  </div>
                  <p className="text-right text-sm font-semibold text-brand-main">
                    ${selectedTicket.price}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">per ticket</span>
                  </p>
                </div>
              </div>
            ) : null}

            <form className="mt-6 space-y-5" onSubmit={handleCheckoutSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...checkoutForm.register("firstName")} />
                  {checkoutForm.formState.errors.firstName ? (
                    <p className="text-sm text-red-600">{checkoutForm.formState.errors.firstName.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...checkoutForm.register("lastName")} />
                  {checkoutForm.formState.errors.lastName ? (
                    <p className="text-sm text-red-600">{checkoutForm.formState.errors.lastName.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" {...checkoutForm.register("username")} />
                  {checkoutForm.formState.errors.username ? (
                    <p className="text-sm text-red-600">{checkoutForm.formState.errors.username.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" {...checkoutForm.register("phoneNumber")} />
                  {checkoutForm.formState.errors.phoneNumber ? (
                    <p className="text-sm text-red-600">{checkoutForm.formState.errors.phoneNumber.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px]">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...checkoutForm.register("email")} />
                  {checkoutForm.formState.errors.email ? (
                    <p className="text-sm text-red-600">{checkoutForm.formState.errors.email.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={Math.max(1, selectedTicket?.available ?? 1)}
                    {...checkoutForm.register("quantity", { valueAsNumber: true })}
                  />
                  {checkoutForm.formState.errors.quantity ? (
                    <p className="text-sm text-red-600">{checkoutForm.formState.errors.quantity.message}</p>
                  ) : null}
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => setCheckoutOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-2xl bg-brand-main text-white hover:bg-brand-main/90"
                  disabled={isCreatingBooking}
                >
                  {isCreatingBooking ? "Processing..." : "Continue to Payment"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
