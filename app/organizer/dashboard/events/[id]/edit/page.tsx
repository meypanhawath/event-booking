"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Image as ImageIcon, LoaderCircle } from "lucide-react";

import { useGetEventByIdQuery, useUpdateEventMutation } from "@/lib/features/events/eventsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/dashboard/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  "Olympia Mall",
] as const;

const editEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  isAvailable: z.boolean(),
});

type EditEventData = z.infer<typeof editEventSchema>;

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.id);

  const { data: event, isLoading, isError } = useGetEventByIdQuery(eventId, {
    skip: Number.isNaN(eventId) || eventId <= 0,
  });
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const [thumbnailPath, setThumbnailPath] = useState<string>("");

  const form = useForm<EditEventData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      isAvailable: true,
    },
  });

  const previewUrl = useMemo(() => event?.thumbnailUrl ?? null, [event?.thumbnailUrl]);

  useEffect(() => {
    if (!event) return;
    form.reset({
      title: event.title ?? "",
      description: event.description ?? "",
      location: event.location ?? "",
      isAvailable: Boolean(event.isAvailable),
    });
    setThumbnailPath(event.thumbnailPath ?? "");
  }, [event, form]);

  const handleSubmit = async (data: EditEventData) => {
    try {
      const body = {
        ...data,
        thumbnailPath: thumbnailPath || event?.thumbnailPath || "",
      };

      if (!body.thumbnailPath) {
        toast.error("Please upload an event thumbnail");
        return;
      }

      await updateEvent({ id: eventId, body }).unwrap();
      toast.success("Event updated successfully!");
      router.push("/organizer/dashboard/events");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update event");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/organizer/dashboard/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Edit Event</h2>
          <p className="text-muted-foreground mt-1">Update basic event information</p>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 flex items-center justify-center text-muted-foreground gap-2">
            <LoaderCircle className="w-5 h-5 animate-spin" />
            Loading event...
          </CardContent>
        </Card>
      ) : isError || !event ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">Failed to load event</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                    Current thumbnail
                  </div>
                </div>
              </div>
              <FileUpload
                label="Event Thumbnail *"
                previewUrl={previewUrl}
                onUploadComplete={setThumbnailPath}
                onUploadError={(err) => toast.error(err)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input id="title" {...form.register("title")} />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" rows={4} {...form.register("description")} />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Controller
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
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
                  )}
                />
                {form.formState.errors.location && (
                  <p className="text-sm text-red-600">{form.formState.errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Availability</Label>
                <Controller
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <Select
                      value={String(Boolean(field.value))}
                      onValueChange={(value) => field.onChange(value === "true")}
                    >
                      <SelectTrigger className="max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Available (visible)</SelectItem>
                        <SelectItem value="false">Unavailable (hidden)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href="/organizer/dashboard/events">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-[#C14FE6] hover:bg-[#a855f7]"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
