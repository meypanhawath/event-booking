"use client";

import { useState } from "react";
import {
  useGetPendingOrganizersQuery,
  useUpdateOrganizerStatusMutation,
} from "@/lib/features/admin/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  UserCheck,
  Clock,
  Banknote,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { UserResponse } from "@/lib/types/admin";

export default function PendingOrganizersPage() {
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [remark, setRemark] = useState("");
  const [actionType, setActionType] = useState<"ACCEPTED" | "REJECTED" | null>(null);

  const { data, isLoading, isError } = useGetPendingOrganizersQuery({ page, size: 10 });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrganizerStatusMutation();

  const users = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      await updateStatus({
        uuid: selectedUser.uuid,
        status: actionType,
        remark: remark || undefined,
      }).unwrap();

      toast.success(
        actionType === "ACCEPTED"
          ? "Organizer approved successfully"
          : "Organizer rejected"
      );
      setSelectedUser(null);
      setRemark("");
      setActionType(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const openDialog = (user: UserResponse, action: "ACCEPTED" | "REJECTED") => {
    setSelectedUser(user);
    setActionType(action);
    setRemark("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pending Organizer Applications</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve organizer applications
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">Failed to load pending organizers</p>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium">All caught up!</h3>
            <p className="text-muted-foreground mt-1">No pending organizer applications</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.uuid} className="border-border/50 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-[#C14FE6]/10 flex items-center justify-center">
                            <span className="text-xl font-bold text-[#C14FE6]">
                              {user.username[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{user.username}</h3>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                <Clock className="w-3 h-3 mr-1" />
                                PENDING
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Applied {user.appliedAt ? new Date(user.appliedAt).toLocaleDateString() : "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Organizer Details */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Organization Details
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground w-24">Org Name:</span>
                              <span className="font-medium">{user.orgName || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground w-24">Bio:</span>
                              <span className="font-medium">{user.orgBio || "—"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Payment Details
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Banknote className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground w-20">Bank:</span>
                              <span className="font-medium">{user.bankName || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground w-24 pl-6">Account:</span>
                              <span className="font-medium">{user.bankAccountNumber || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground w-24 pl-6">Name:</span>
                              <span className="font-medium">{user.bankAccountName || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground w-24 pl-6">Currency:</span>
                              <span className="font-medium">{user.currency || "—"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* QR Code if available */}
                      {user.qrCodeUrl && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            Payment QR Code
                          </h4>
                          <img
                            src={user.qrCodeUrl}
                            alt="QR Code"
                            className="w-32 h-32 object-contain rounded-lg border border-border"
                          />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-3 lg:w-48">
                      <Button
                        className="flex-1 lg:w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => openDialog(user, "ACCEPTED")}
                        disabled={isUpdating}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 lg:w-full border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => openDialog(user, "REJECTED")}
                        disabled={isUpdating}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "ACCEPTED" ? "Approve Organizer" : "Reject Organizer"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "ACCEPTED"
                ? `Are you sure you want to approve ${selectedUser?.username} as an organizer?`
                : `Are you sure you want to reject ${selectedUser?.username}'s application?`}
            </DialogDescription>
          </DialogHeader>

          {actionType === "REJECTED" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Remark (optional)</label>
              <Textarea
                placeholder="Enter reason for rejection..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={isUpdating}
              className={actionType === "ACCEPTED" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isUpdating ? "Processing..." : actionType === "ACCEPTED" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}