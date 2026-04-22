"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Shield } from "lucide-react";
import type { UserResponse } from "@/lib/types/user";

interface ProfileCardProps {
  user: UserResponse | null;
}

export function ProfileCard({ user }: ProfileCardProps) {
  if (!user) return null;

  const isOrganizer = user.roles?.includes("ROLE_ORGANIZER");
  const isAdmin = user.roles?.includes("ROLE_ADMIN");

  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-[#C14FE6] to-[#a855f7]" />
      <CardContent className="-mt-12 pb-6">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative">
            {user.profile ? (
              <Image
                src={user.profile}
                alt={user.username}
                width={96}
                height={96}
                className="rounded-full border-4 border-background object-cover w-24 h-24"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-background bg-[#C14FE6]/10 flex items-center justify-center">
                <User className="w-10 h-10 text-[#C14FE6]" />
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
            {isAdmin && (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
            {isOrganizer && (
              <Badge className="bg-[#C14FE6]/10 text-[#C14FE6] hover:bg-[#C14FE6]/10">
                Organizer
              </Badge>
            )}
            <Badge variant="secondary">Customer</Badge>
          </div>

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