"use server";

import { SessionResponse } from "@/types";
import { cookies } from "next/headers";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function getSession(): Promise<SessionResponse> {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${API_URL}/api/user/me`, {
      headers: {
        cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json) {
      return {
        data: null,
        error: json ?? { message: "unauthorized" },
      };
    }

    return {
      data: json,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
}

export async function getAllUsers() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/api/user`, {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    });
    const users = await res.json();
    if (!users) return { data: null, error: { message: "data missing" } };
    return { data: users, error: null };
  } catch {
    return { data: null, error: { message: "something went wrong" } };
  }
}

export async function getUserById(id: string) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/api/user/${id}`, {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    });
    const user = await res.json();
    if (!user) return { data: null, error: { message: "data missing" } };
    return { data: user, error: null };
  } catch {
    return { data: null, error: { message: "something went wrong" } };
  }
}

export async function updateProfile(payload: {
  name?: string;
  email?: string;
}) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/api/user/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return { data: null, error: data };
    return { data, error: null };
  } catch {
    return { data: null, error: { message: "something went wrong" } };
  }
}
