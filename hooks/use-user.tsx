"use client";
import { useAppContext } from "@/context/appContext";
import { User, UserStatus } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NewUser {
  email: string;
  password: string;
  shopId: number;
  fullName?: string;
  phone?: string | null;
  ref?: string;
}

export function useCreateUser() {
  const { api, shopId } = useAppContext();
  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (newUser: NewUser) => {
      if (!shopId) {
        throw new Error(
          "Shop configuration not found. Please contact support.",
        );
      }

      const payload: {
        email: string;
        password: string;
        shopId: number;
        fullName?: string;
        phone?: string | null;
      } = {
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        shopId: Number(shopId),
        fullName: newUser.fullName,
      };

      if (newUser.fullName) {
        payload.fullName = newUser.fullName;
      }

      const res = await api.post(`/users`, payload);

      if (!res.data.user) {
        console.error("User creation failed. Response:", res.data);
        throw new Error(
          "Failed to create user: No user object returned from server.",
        );
      }
      return res.data;
    },

    onSuccess: () => {
      toast.success("User created successfully");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to create user");
      toast.error(errorMsg);
    },
  });
}

interface LoginProps {
  email: string;
  password: string;
  shopId: number;
}

export function useUserLogin() {
  const { api, setUserInfo } = useAppContext();
  const router = useRouter();
  return useMutation({
    mutationKey: ["userLogins"],
    mutationFn: async (data: LoginProps) => {
      const res = await api.post(`/users/me`, {
        email: data.email,
        password: data.password,
        shopId: data.shopId,
      });

      if (!res.data) {
        throw new Error(
          "Failed to login user: No response data received from server.",
        );
      }
      return res.data.user;
    },
    onSuccess: async (data) => {
      setUserInfo({
        ...data,
      });
      router.push("/client/products");
      toast.success("User logged in successfully");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to login user");
      toast.error(errorMsg);
    },
  });
}

export function useGetUsers() {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["users", shopId],
    queryFn: async () => {
      const res = await api.get<User[]>(`/users`);
      if (!res.data) throw new Error("Failed to fetch user");
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
}

export function useGetUserByUid(uid: string) {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["user", uid],
    queryFn: async () => {
      const res = await api.get<{ user: User }>(`/users/${uid}`);
      if (!res.data) throw new Error("Failed to fetch user");
      return res.data.user;
    },
    enabled: !!api && !!uid,
  });
}

interface DeleteUsersProps {
  uids: string[];
}

export function useDeleteMultipleUsers() {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DeleteUsersProps) => {
      const res = await api.delete(`/users/multiple`, { data });
      if (!res.data) throw new Error("Failed to delete users");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Users deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete users");
      toast.error(errorMsg);
    },
  });
}

interface DeleteUserProps {
  uid: string;
}

export const useDeleteASingleUser = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: DeleteUserProps) => {
      const res = await api.delete(`/users`, {
        data: { uid: data.uid },
      });
      if (!res.data) throw new Error("Failed to delete user");
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete user");
      toast.error(errorMsg);
    },
  });
};

interface UpdateUserProps {
  uid: string;
  username?: string;
  fullName?: string;
  image?: string | null;
  phone?: string | null;
  currency?: string;
}

export function useUpdateUser() {
  const { api, setUserInfo, setUserCurrency } = useAppContext();

  return useMutation({
    mutationFn: async (data: UpdateUserProps) => {
      const res = await api.patch(`/users`, data);
      if (!res.data) throw new Error("Failed to update user");
      return res.data;
    },
    onSuccess: (updatedUser: any) => {
      toast.success("User updated successfully");
      setUserInfo({
        ...updatedUser.user,
      });
      if (updatedUser?.user?.currency) {
        setUserCurrency(updatedUser.user.currency);
      }
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update user");
      toast.error(errorMsg);
    },
  });
}

export function useRegenerateUserApiKey() {
  const { api } = useAppContext();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post<{ apiKey: string }>("/users/api-key/regenerate");
      if (!res.data?.apiKey) {
        throw new Error("Failed to regenerate API key");
      }
      return res.data.apiKey;
    },
    onSuccess: () => {
      toast.success("API key regenerated");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to regenerate API key");
      toast.error(errorMsg);
    },
  });
}

export interface UpdateUserByAdminProps {
  uid: string;
  username?: string;
  email?: string;
  fullName?: string;
  balance?: string;
  balanceAction?: "ADD" | "REMOVE";
  balanceAdjustment?: number;
  status?: UserStatus;
  phone?: string | null;
}

export function useUpdateUserByAdmin() {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateUserByAdminProps) => {
      const res = await api.patch(`/users/admin`, data);
      if (!res.data) throw new Error("Failed to update user");
      return res.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update user");
      toast.error(errorMsg);
    },
  });
}

interface ForgetPasswordProps {
  email: string;
}

export function useUserForgotPassword() {
  const { api, shopId } = useAppContext();
  return useMutation({
    mutationFn: async (data: ForgetPasswordProps) => {
      const res = await api.post(
        `/users/forgot-password?shopId=${shopId}`,
        data,
      );
      if (!res.data) throw new Error("Failed to send email");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset link sent to your email");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to send email");
      toast.error(errorMsg);
    },
  });
}

interface ResetPasswordProps {
  token: string;
  password: string;
  email?: string;
}

export function useUserResetPassword() {
  const { api, shopId } = useAppContext();
  return useMutation({
    mutationFn: async (data: ResetPasswordProps) => {
      const res = await api.post(
        `/users/reset-password?shopId=${shopId}`,
        data,
      );
      if (!res.data) throw new Error("Failed to reset password");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to reset password");
      toast.error(errorMsg);
    },
  });
}

interface VerifySessionCodeProps {
  sessionCode: string;
}

export function useUserVerifySessionCode() {
  const { shopId, setUserInfo, api } = useAppContext();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: VerifySessionCodeProps) => {
      if (!api) {
        throw new Error("API client not initialized. Please wait...");
      }
      const res = await api.post<{ user: User }>(
        `/users/verify-session`,
        { sessionCode: data.sessionCode, shopId },
        {
          withCredentials: true,
        },
      );
      if (!res.data.user) throw new Error("Failed to verify session");
      return res.data.user;
    },
    onSuccess: (data) => {
      toast.success("User authenticated successfully");
      setUserInfo(data);
      router.push("/client/products");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to verify session");
      toast.error(errorMsg);
    },
  });
}
