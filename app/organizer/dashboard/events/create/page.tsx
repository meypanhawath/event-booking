"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FileUpload } from "@/components/dashboard/file-upload";
import {
  Calendar,
  Tag,
  ChevronLeft,
  PlusCircle,
  CheckCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { hasRole } from "@/lib/auth-utils";

// Only 4 ticket types
const TICKET_TYPES = ["SILVER", "GOLD", "PLATINUM", "DIAMOND"] as const;

// Cambodia provinces + Phnom Penh
const LOCATIONS = [
"Morodok Techo National Stadium",
"National Olympic Stadium",
"Prince Stadium (Visakha Stadium)",
"Smart RSN Stadium",
"AIA Stadium",
"Olympic Stadium Indoor Arena",
"Morodok Techo Indoor Arena",
"Koh Pich (Diamond Island)",
"Aeon Hall (Aeon Mall Sen Sok City)",
"Cambodia-Korea Cooperation Center (CKCC)",
"Institute of Technology of Cambodia (ITC)",
"Cambodia-Japan Cooperation Center (CJCC)",
"TY Media Esports Center",
"Legend Cinema",
"Olympia Mall"
] as const;

const ticketSchema = z.object({
  type: z.enum(TICKET_TYPES),
  price: z.number().min(0, "Price must be 0 or more"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  categoryId: z.number().min(1, "Category is required"),
  tickets: z.array(ticketSchema).min(1, "At least one ticket is required"),
});

type CreateEventData = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const { data: user } = useGetMeQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailPath, setThumbnailPath] = useState<string>("");

  const form = useForm<CreateEventData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "Phnom Penh",
      startDate: "",
      endDate: "",
      categoryId: 1,
      tickets: [
        {
          type: "SILVER",
          price: 0,
          quantity: 100,
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tickets",
  });

  const handleSubmit = async (data: CreateEventData) => {
    if (!thumbnailPath) {
      toast.error("Please upload an event thumbnail");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        thumbnailPath,
      };

      const response = await fetch("/api/v1/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || `HTTP ${response.status}: Failed to create event`);
      }

      toast.success("Event created successfully!");
      router.push("/organizer/dashboard/events");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user && !hasRole(user.roles, "ROLE_ORGANIZER") && !hasRole(user.roles, "ROLE_ADMIN")) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-amber-500" />
        <h2 className="text-xl font-semibold text-foreground">Organizer access required</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account does not currently have organizer permission to create events.
        </p>
      </div>
    );
  }

  

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/organizer/dashboard/events">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Create Event</h2>
          <p className="text-muted-foreground">Create a new event with multiple ticket tiers</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Thumbnail Upload */}
        <Card>
          <CardContent className="p-6">
            <FileUpload
              label="Event Thumbnail *"
              onUploadComplete={setThumbnailPath}
              onUploadError={(err) => toast.error(err)}
            />
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C14FE6]" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
              <Input id="title" placeholder="e.g., Summer Music Festival" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea id="description" placeholder="Describe your event..." rows={4} {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category <span className="text-red-500">*</span></Label>
              <Select
                defaultValue="1"
                onValueChange={(value) => form.setValue("categoryId", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Concerts</SelectItem>
                  <SelectItem value="2">Sports</SelectItem>
                  <SelectItem value="3">Theater</SelectItem>
                  <SelectItem value="4">Workshops</SelectItem>
                  <SelectItem value="5">Festivals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <Select
                defaultValue="Phnom Penh"
                onValueChange={(value) => form.setValue("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.location && (
                <p className="text-sm text-red-600">{form.formState.errors.location.message}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
                <Input id="startDate" type="datetime-local" {...form.register("startDate")} />
                {form.formState.errors.startDate && (
                  <p className="text-sm text-red-600">{form.formState.errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date <span className="text-red-500">*</span></Label>
                <Input id="endDate" type="datetime-local" {...form.register("endDate")} />
                {form.formState.errors.endDate && (
                  <p className="text-sm text-red-600">{form.formState.errors.endDate.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#C14FE6]" />
              Ticket Tiers
            </CardTitle>
            {fields.length < 4 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const usedTypes = fields.map((f) => f.type);
                  const availableType = TICKET_TYPES.find((t) => !usedTypes.includes(t as any)) || "SILVER";
                  append({
                    type: availableType as any,
                    price: 0,
                    quantity: 100,
                    description: "",
                  });
                }}
                className="border-[#C14FE6] text-[#C14FE6] hover:bg-[#C14FE6]/10"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Ticket
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-xl border border-border bg-muted/30 space-y-4 relative"
              >
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Ticket #{index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Ticket Type - Only 4 options */}
                  <div className="space-y-2">
                    <Label>Type <span className="text-red-500">*</span></Label>
                    <Select
                      defaultValue={field.type}
                      onValueChange={(value) =>
                        form.setValue(`tickets.${index}.type`, value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TICKET_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label>Price ($) <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...form.register(`tickets.${index}.price`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label>Quantity <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="100"
                      {...form.register(`tickets.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="e.g., Premium seating with complimentary drinks"
                    {...form.register(`tickets.${index}.description`)}
                  />
                  {form.formState.errors.tickets?.[index]?.description && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.tickets[index]?.description?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {form.formState.errors.tickets && !Array.isArray(form.formState.errors.tickets) && (
              <p className="text-sm text-red-600">{form.formState.errors.tickets.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/organizer/dashboard/events">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button
            type="submit"
            className="bg-[#C14FE6] hover:bg-[#a855f7]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Event
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
