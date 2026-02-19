import client from "./client";
import type { User, LoginResponse } from "@/types";

export async function getUsers(): Promise<User[]> {
  const { data } = await client.get<{ users: User[] }>("/api/users");
  return data.users;
}

export async function login(email: string): Promise<LoginResponse> {
  const { data } = await client.post<LoginResponse>("/api/login", { email });
  return data;
}
