export type ProductResponse = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: Category;
    rating: number;
    thumbnailUrl: string | null;
}

export type Category = {
    id: number;
    name: string;
}
