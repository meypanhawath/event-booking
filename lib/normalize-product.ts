import { ProductResponse } from "./types/product";

type ProductInput = Partial<ProductResponse> & {
  category?: { id?: number; name?: string } | string | null;
  thumbnailUrl?: string | string[] | null;
  images?: string[] | null;
  image?: string | null;
};

function normalizeThumbnail(product: ProductInput) {
  if (typeof product.thumbnailUrl === "string") {
    return product.thumbnailUrl;
  }

  if (Array.isArray(product.thumbnailUrl) && product.thumbnailUrl.length > 0) {
    return product.thumbnailUrl[0] ?? "";
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0] ?? "";
  }

  if (typeof product.image === "string") {
    return product.image;
  }

  return "";
}

function normalizeCategory(product: ProductInput) {
  if (typeof product.category === "string") {
    return {
      id: 0,
      name: product.category,
    };
  }

  return {
    id: product.category?.id ?? 0,
    name: product.category?.name ?? "Uncategorized",
  };
}

export function normalizeProduct(product: ProductInput): ProductResponse {
  return {
    id: product.id ?? 0,
    title: product.title ?? "Untitled event",
    price: typeof product.price === "number" ? product.price : 0,
    description: product.description ?? "",
    category: normalizeCategory(product),
    rating: typeof product.rating === "number" ? product.rating : 0,
    thumbnailUrl: normalizeThumbnail(product),
  };
}

export function normalizeProducts(products: unknown): ProductResponse[] {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.map((product) => normalizeProduct((product ?? {}) as ProductInput));
}
