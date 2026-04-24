const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dgjwgtdkg/image/upload/";

export function getAssetUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return `${CLOUDINARY_BASE_URL}${value}`;
}

