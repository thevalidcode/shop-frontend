// src/app/storefront/(auth)/actions.ts
"use server";

type LoginPayLoad = { email: string; password: string };
type SignupPayload = {
  email: string;
  username: string;
  password: string;
  ref?: number;
};
