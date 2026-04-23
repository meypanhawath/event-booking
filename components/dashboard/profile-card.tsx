"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Shield } from "lucide-react";
import type { UserResponse } from "@/lib/types/user";
import Link from "next/link";
import { getPrimaryRole, getProfileImageUrl, getUserInitial, hasRole } from "@/lib/auth-utils";

interface ProfileCardProps {
  user: UserResponse | null;
}

export function ProfileCard({ user }: ProfileCardProps) {
  if (!user) return null;

  const isAdmin = hasRole(user.roles, "ROLE_ADMIN");
  const profileImage = getProfileImageUrl(user.profile);
  const primaryRole = getPrimaryRole(user.roles);
  const userInitial = getUserInitial(user.username, user.firstName);

  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-[#C14FE6] to-[#a855f7]" />
      <CardContent className="-mt-12 pb-6">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={user.username}
                width={96}
                height={96}
                className="rounded-full border-4 border-background object-cover w-24 h-24"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-[#C14FE6] text-3xl font-semibold text-white">
                {userInitial}
              </div>
            )}
          </div>

          {/* Name & Role */}
          <h3 className="mt-3 text-lg font-semibold text-foreground">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">@{user.username}</p>

          {/* Role Badges */}
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {primaryRole === "ROLE_ADMIN" && (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
            {primaryRole === "ROLE_ORGANIZER" && (
              <Badge className="bg-[#C14FE6]/10 text-[#C14FE6] hover:bg-[#C14FE6]/10">
                Organizer
              </Badge>
            )}
            {primaryRole === "ROLE_CUSTOMER" && (
              <Badge variant="secondary">Customer</Badge>
            )}
          </div>

          {!isAdmin && (
            <Button asChild className="mt-4 bg-[#C14FE6] hover:bg-[#a855f7]">
              <Link href="/user/dashboard/profile">Edit Profile</Link>
            </Button>
          )}

          {/* Info */}
          <div className="mt-4 w-full space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{user.email}</span>
            </div>
            {user.phoneNumber && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{user.phoneNumber}</span>
              </div>
            )}
          </div>

          {/* Organizer Status */}
          {user.organizerStatus && user.organizerStatus !== "NONE" && (
            <div className="mt-4 w-full p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Organizer Application
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    user.organizerStatus === "ACCEPTED"
                      ? "bg-emerald-500"
                      : user.organizerStatus === "PENDING"
                      ? "bg-amber-500"
                      : user.organizerStatus === "REJECTED"
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-sm font-medium capitalize">
                  {user.organizerStatus.toLowerCase()}
                </span>
              </div>
              {user.remark && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {user.remark}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
