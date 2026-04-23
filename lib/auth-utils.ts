const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dgjwgtdkg/image/upload/";

export function hasRole(
  roles: string[] | undefined,
  role: "ROLE_ADMIN" | "ROLE_ORGANIZER" | "ROLE_CUSTOMER"
) {
  return roles?.includes(role) ?? false;
}

export function getPrimaryRole(
  roles: string[] | undefined
): "ROLE_ADMIN" | "ROLE_ORGANIZER" | "ROLE_CUSTOMER" {
  if (hasRole(roles, "ROLE_ADMIN")) {
    return "ROLE_ADMIN";
  }

  if (hasRole(roles, "ROLE_ORGANIZER")) {
    return "ROLE_ORGANIZER";
  }

  return "ROLE_CUSTOMER";
}

export function getDashboardPath(roles: string[] | undefined) {
  const primaryRole = getPrimaryRole(roles);

  if (primaryRole === "ROLE_ADMIN") {
    return "/admin/dashboard";
  }

  if (primaryRole === "ROLE_ORGANIZER") {
    return "/organizer/dashboard";
  }

  return "/user/dashboard";
}

export function getRoleLabel(roles: string[] | undefined) {
  return getPrimaryRole(roles).replace("ROLE_", "");
}

export function getProfileImageUrl(profile: string | null | undefined) {
  if (!profile) {
    return null;
  }

  if (profile.startsWith("http://") || profile.startsWith("https://")) {
    return profile;
  }

  if (profile.startsWith("/")) {
    return profile;
  }

  return `${CLOUDINARY_BASE_URL}${profile}`;
}

export function getUserInitial(username?: string | null, firstName?: string | null) {
  const source = firstName?.trim() || username?.trim() || "U";
  return source.charAt(0).toUpperCase();
}
