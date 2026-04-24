"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/dashboard/file-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfileImageUrl, hasRole } from "@/lib/auth-utils";
import { notifyError, notifySuccess } from "@/lib/toast";
import {
  organizerProfileSchema,
  personalProfileSchema,
  type OrganizerProfileInput,
  type PersonalProfileInput,
} from "@/lib/validations/profile";

type ProfileSettingsProps = {
  redirectTo?: string;
};

export function ProfileSettings({ redirectTo }: ProfileSettingsProps) {
  const router = useRouter();
  const { data: user, isLoading, refetch } = useGetMeQuery();

  const personalForm = useForm<PersonalProfileInput>({
    resolver: zodResolver(personalProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phoneNumber: "",
      profile: "",
    },
  });

  const organizerForm = useForm<OrganizerProfileInput>({
    resolver: zodResolver(organizerProfileSchema),
    defaultValues: {
      orgName: "",
      orgBio: "",
      orgProfilePath: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    personalForm.reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
      profile: user.profile ?? "",
    });

    organizerForm.reset({
      orgName: user.orgName ?? "",
      orgBio: user.orgBio ?? "",
      orgProfilePath: user.orgProfilePath ?? "",
    });
  }, [organizerForm, personalForm, user]);

  useEffect(() => {
    if (!isLoading && user && hasRole(user.roles, "ROLE_ADMIN")) {
      router.replace("/admin/dashboard");
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return <Skeleton className="h-[32rem] w-full rounded-3xl" />;
  }

  if (!user || hasRole(user.roles, "ROLE_ADMIN")) {
    return null;
  }

  async function refreshUserAndForms(
    personalFallback?: Partial<PersonalProfileInput>,
    organizerFallback?: Partial<OrganizerProfileInput>
  ) {
    const refreshed = await refetch();
    const nextUser = "data" in refreshed ? refreshed.data : undefined;

    if (nextUser) {
      personalForm.reset({
        firstName: nextUser.firstName ?? personalFallback?.firstName ?? "",
        lastName: nextUser.lastName ?? personalFallback?.lastName ?? "",
        username: nextUser.username ?? personalFallback?.username ?? "",
        email: nextUser.email ?? personalFallback?.email ?? "",
        phoneNumber: nextUser.phoneNumber ?? personalFallback?.phoneNumber ?? "",
        profile: nextUser.profile ?? personalFallback?.profile ?? "",
      });

      organizerForm.reset({
        orgName: nextUser.orgName ?? organizerFallback?.orgName ?? "",
        orgBio: nextUser.orgBio ?? organizerFallback?.orgBio ?? "",
        orgProfilePath: nextUser.orgProfilePath ?? organizerFallback?.orgProfilePath ?? "",
      });
      return;
    }

    if (personalFallback) {
      personalForm.reset(personalFallback as PersonalProfileInput);
    }

    if (organizerFallback) {
      organizerForm.reset(organizerFallback as OrganizerProfileInput);
    }
  }

  async function handlePersonalSubmit(values: PersonalProfileInput) {
    const userUuid = user?.uuid;
    if (!userUuid) {
      notifyError("Profile data is unavailable.", "Please refresh and try again.");
      return;
    }

    try {
      const response = await fetch(`/api/v1/users/${userUuid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          phoneNumber: values.phoneNumber,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "We could not update your profile.");
      }

      await refreshUserAndForms(values);
      notifySuccess("Profile updated.", "Your personal information has been saved.");
    } catch (error) {
      notifyError("Profile update failed.", error instanceof Error ? error.message : "Please try again.");
    }
  }

  async function handleOrganizerSubmit(values: OrganizerProfileInput) {
    try {
      const response = await fetch("/api/v1/users/organizer/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "We could not update the organizer profile.");
      }

      await refreshUserAndForms(undefined, values);
      notifySuccess("Organizer profile updated.", "Your organizer details have been saved.");

      if (redirectTo) {
        router.replace(redirectTo);
      }
    } catch (error) {
      notifyError("Organizer profile update failed.", error instanceof Error ? error.message : "Please try again.");
    }
  }

  const personalProfile = personalForm.watch("profile");
  const organizerProfile = organizerForm.watch("orgProfilePath");

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-[1.375rem]">Personal Information</CardTitle>
          <p className="text-muted-foreground">Keep your profile details current so bookings and account access stay consistent.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={personalForm.handleSubmit(handlePersonalSubmit)}>
            <FileUpload
              label="Profile Image"
              previewUrl={getProfileImageUrl(personalProfile)}
              aspect="square"
              size="sm"
              onUploadComplete={(path) =>
                personalForm.setValue("profile", path, { shouldDirty: true, shouldValidate: true })
              }
              onUploadError={(message) => notifyError("Upload failed.", message)}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...personalForm.register("firstName")} />
                {personalForm.formState.errors.firstName ? <p className="text-sm text-red-600">{personalForm.formState.errors.firstName.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...personalForm.register("lastName")} />
                {personalForm.formState.errors.lastName ? <p className="text-sm text-red-600">{personalForm.formState.errors.lastName.message}</p> : null}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...personalForm.register("username")} />
                {personalForm.formState.errors.username ? <p className="text-sm text-red-600">{personalForm.formState.errors.username.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...personalForm.register("email")} />
                {personalForm.formState.errors.email ? <p className="text-sm text-red-600">{personalForm.formState.errors.email.message}</p> : null}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" {...personalForm.register("phoneNumber")} />
                {personalForm.formState.errors.phoneNumber ? <p className="text-sm text-red-600">{personalForm.formState.errors.phoneNumber.message}</p> : null}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="rounded-2xl bg-[#c14fe6] hover:bg-[#b347d4]" disabled={personalForm.formState.isSubmitting}>
                {personalForm.formState.isSubmitting ? "Saving..." : "Save Personal Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {hasRole(user.roles, "ROLE_ORGANIZER") ? (
        <Card className="rounded-3xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-[1.375rem]">Organizer Information</CardTitle>
            <p className="text-muted-foreground">Update the organizer details customers see on your event pages.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={organizerForm.handleSubmit(handleOrganizerSubmit)}>
              <FileUpload
                label="Organizer Profile Image"
                previewUrl={getProfileImageUrl(organizerProfile)}
                aspect="square"
                size="sm"
                onUploadComplete={(path) => organizerForm.setValue("orgProfilePath", path, { shouldDirty: true, shouldValidate: true })}
                onUploadError={(message) => notifyError("Upload failed.", message)}
              />
              {organizerForm.formState.errors.orgProfilePath ? <p className="text-sm text-red-600">{organizerForm.formState.errors.orgProfilePath.message}</p> : null}

              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" {...organizerForm.register("orgName")} />
                {organizerForm.formState.errors.orgName ? <p className="text-sm text-red-600">{organizerForm.formState.errors.orgName.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgBio">Organization Bio</Label>
                <Textarea id="orgBio" rows={5} {...organizerForm.register("orgBio")} />
                {organizerForm.formState.errors.orgBio ? <p className="text-sm text-red-600">{organizerForm.formState.errors.orgBio.message}</p> : null}
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="rounded-2xl bg-[#c14fe6] hover:bg-[#b347d4]" disabled={organizerForm.formState.isSubmitting}>
                  {organizerForm.formState.isSubmitting ? "Saving..." : "Save Organizer Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
