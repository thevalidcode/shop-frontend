"use client";

import { useAppContext } from "@/context/appContext";
import { Blog, BlogStatus } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface BlogProps {
  uid?: string;
  slug?: string;
  status?: BlogStatus;
  content?: string;
  excerpt?: string;
  title?: string;
  coverImage?: string;
}

export const useCreateBlog = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createBlog"],
    mutationFn: async (data: BlogProps) => {
      const res = await api.post(`/blogs/admin`, data);
      if (!res.data) {
        throw new Error("Failed to create blog");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Blog created successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to create blog");
      toast.error(errorMsg);
    },
  });
};

export const useGetBlogs = () => {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["blogs", shopId],
    queryFn: async () => {
      const res = await api.get<Blog[]>(`/blogs?shopId=${shopId}`);
      if (!res.data) {
        throw new Error("Failed to get blog data");
      }
      return res.data || [];
    },
    enabled: !!api && !!shopId,
  });
};

export const useGetBlogById = (blogId: number) => {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["blogId", shopId, blogId],
    queryFn: async () => {
      const res = await api.get<{ blog: Blog | null }>(
        `/blogs/${blogId}?shopId=${shopId}`
      );

      const blog = res.data?.blog;

      if (!blog) {
        throw new Error("Blog not found");
      }

      return blog;
    },
    enabled: !!api && !!blogId && !!shopId,
  });
};

export const useUpdateBlog = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateBlog"],
    mutationFn: async (data: BlogProps) => {
      const res = await api.patch("/blogs/admin", data);
      if (!res.data) {
        throw new Error("An error occurred when we tried updating the blog");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update blog");
      toast.error(errorMsg);
    },
  });
};

interface DeleteBlogProps {
  uid: string;
}

export const useDeleteBlog = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteBlog"],
    mutationFn: async (data: DeleteBlogProps) => {
      const res = await api.delete(`/blogs/admin`, { data });
      if (!res.data) {
        throw new Error("Failed to delete blog");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete blog");
      toast.error(errorMsg);
    },
  });
};

interface DeleteMultipleBlogProps {
  uids: string[];
}

export const useDeleteMultipleBlogs = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteMultipleBlog"],
    mutationFn: async (data: DeleteMultipleBlogProps) => {
      const res = await api.delete(`/blogs/admin/multiple`, { data });
      if (!res.data) {
        throw new Error("Failed to delete blogs");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Blogs deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete blogs");
      toast.error(errorMsg);
    },
  });
};
