"use client";

import { useState } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/lib/features/admin/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tag, Plus, Trash2, FolderOpen } from "lucide-react";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null) {
    const maybe = error as { data?: { message?: unknown } };
    const message = maybe.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
};

export default function CategoriesPage() {
  const [newCategory, setNewCategory] = useState("");

  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await createCategory({ name: newCategory.trim() }).unwrap();
      toast.success("Category created successfully");
      setNewCategory("");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to create category"));
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to delete category"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Event Categories</h1>
        <p className="text-muted-foreground mt-1">
          Manage event categories available on the platform
        </p>
      </div>

      {/* Create Category */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <form onSubmit={handleCreate} className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter new category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="bg-[#C14FE6] hover:bg-[#a855f7]"
              disabled={isCreating || !newCategory.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? "Creating..." : "Add Category"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories List */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="border-border/50 group hover:border-[#C14FE6]/30 transition-colors"
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C14FE6]/10 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-[#C14FE6]" />
                  </div>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {category.id}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 transition-opacity"
                  onClick={() => handleDelete(category.id, category.name)}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No categories yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
