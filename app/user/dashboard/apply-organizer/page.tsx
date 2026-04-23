"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import { FileUpload } from "@/components/dashboard/file-upload";
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
import {
  organizerStep1Schema,
  organizerStep2Schema,
  type OrganizerStep1Data,
  type OrganizerStep2Data,
} from "@/lib/validations/organizer";
import {
  Store,
  Building2,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";

export default function ApplyOrganizerPage() {
  const router = useRouter();
  const { data: user } = useGetMeQuery();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgProfilePath, setOrgProfilePath] = useState<string>("");
  const [qrCodePath, setQrCodePath] = useState<string>("");

  const step1Form = useForm<OrganizerStep1Data>({
    resolver: zodResolver(organizerStep1Schema),
    defaultValues: { orgName: "", orgBio: "" },
  });

  const step2Form = useForm<OrganizerStep2Data>({
    resolver: zodResolver(organizerStep2Schema),
    defaultValues: {
      bankName: "",
      bankAccountNumber: "",
      bankAccountName: "",
      currency: undefined,
    },
  });

  const handleStep1Next = (data: OrganizerStep1Data) => {
    if (!orgProfilePath) {
      toast.error("Please upload an organization profile image");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (data: OrganizerStep2Data) => {
    if (!qrCodePath) {
      toast.error("Please upload a QR code image");
      return;
    }
    setIsSubmitting(true);
    try {
      const step1Data = step1Form.getValues();
      const payload = { ...step1Data, ...data, orgProfilePath, qrCodePath };
      const response = await fetch("/api/v1/users/apply-organizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Application failed");
      }
      toast.success("Application submitted successfully!");
      router.push("/user/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.roles?.includes("ROLE_ORGANIZER")) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-16 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground">
              You are already an Organizer!
            </h2>
            <p className="text-muted-foreground mt-2">
              You can create and manage events from your organizer dashboard.
            </p>
            <Button
              className="mt-6 bg-[#C14FE6] hover:bg-[#a855f7]"
              onClick={() => router.push("/user/dashboard")}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.organizerStatus === "PENDING") {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-16 text-center">
            <CheckCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground">
              Your organizer application is pending
            </h2>
            <p className="text-muted-foreground mt-2">
              An admin needs to review your application before organizer access is granted.
            </p>
            <Button
              className="mt-6 bg-[#C14FE6] hover:bg-[#a855f7]"
              onClick={() => router.push("/user/dashboard")}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Store className="w-6 h-6 text-[#C14FE6]" />
          Become an Organizer
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete the steps below to apply as an event organizer
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 1 ? "bg-[#C14FE6] text-white" : "bg-muted text-muted-foreground"}`}>
            1
          </div>
          <div className="flex-1 h-1 rounded-full bg-muted">
            <div className={`h-full rounded-full transition-all ${step >= 2 ? "bg-[#C14FE6] w-full" : "w-0"}`} />
          </div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 2 ? "bg-[#C14FE6] text-white" : "bg-muted text-muted-foreground"}`}>
            2
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span className={step === 1 ? "text-[#C14FE6] font-medium" : ""}>Organization Info</span>
          <span className={step === 2 ? "text-[#C14FE6] font-medium" : ""}>Banking Details</span>
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#C14FE6]" />
              Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={step1Form.handleSubmit(handleStep1Next)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name <span className="text-red-500">*</span></Label>
                <Input id="orgName" placeholder="e.g., Event Masters Cambodia" {...step1Form.register("orgName")} />
                {step1Form.formState.errors.orgName && (
                  <p className="text-sm text-red-600">{step1Form.formState.errors.orgName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgBio">Organization Bio <span className="text-muted-foreground">(Optional)</span></Label>
                <Textarea id="orgBio" placeholder="Tell us about your organization..." rows={4} {...step1Form.register("orgBio")} />
                {step1Form.formState.errors.orgBio && (
                  <p className="text-sm text-red-600">{step1Form.formState.errors.orgBio.message}</p>
                )}
              </div>

              <FileUpload
                label="Organization Profile Image *"
                onUploadComplete={setOrgProfilePath}
                onUploadError={(err) => toast.error(err)}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-[#C14FE6] hover:bg-[#a855f7]">
                  Next Step <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#C14FE6]" />
              Banking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={step2Form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name <span className="text-red-500">*</span></Label>
                <Input id="bankName" placeholder="e.g., ACLEDA Bank" {...step2Form.register("bankName")} />
                {step2Form.formState.errors.bankName && (
                  <p className="text-sm text-red-600">{step2Form.formState.errors.bankName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Account Number <span className="text-red-500">*</span></Label>
                <Input id="bankAccountNumber" placeholder="9-10 digits" maxLength={10} {...step2Form.register("bankAccountNumber")} />
                {step2Form.formState.errors.bankAccountNumber && (
                  <p className="text-sm text-red-600">{step2Form.formState.errors.bankAccountNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountName">Account Holder Name <span className="text-red-500">*</span></Label>
                <Input id="bankAccountName" placeholder="Full name as in bank records" {...step2Form.register("bankAccountName")} />
                {step2Form.formState.errors.bankAccountName && (
                  <p className="text-sm text-red-600">{step2Form.formState.errors.bankAccountName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency <span className="text-red-500">*</span></Label>
                <Select onValueChange={(value) => step2Form.setValue("currency", value as "KHR" | "USD")}>
                  <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KHR">KHR (Riel)</SelectItem>
                    <SelectItem value="USD">USD (Dollar)</SelectItem>
                  </SelectContent>
                </Select>
                {step2Form.formState.errors.currency && (
                  <p className="text-sm text-red-600">{step2Form.formState.errors.currency.message}</p>
                )}
              </div>

              <FileUpload
                label="Payment QR Code Image *"
                onUploadComplete={setQrCodePath}
                onUploadError={(err) => toast.error(err)}
              />

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button type="submit" className="bg-[#C14FE6] hover:bg-[#a855f7]" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Submitting...</>
                  ) : (
                    <>Submit Application <CheckCircle className="w-4 h-4 ml-1" /></>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
