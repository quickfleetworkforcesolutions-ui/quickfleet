import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ApiResponse, PagedResponse } from "./types";

const API_BASE =
  process.env["EXPO_PUBLIC_API_BASE_URL"] ?? "http://localhost:8080/api/v1";

const CACHE_TTL = 5 * 60 * 1000;

async function rawFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) throw new Error(json.message ?? "API error");
  return json.data;
}

export async function getCached<T>(
  key: string
): Promise<{ data: T; stale: boolean } | null> {
  try {
    const raw = await AsyncStorage.getItem(`qf_cache_${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: T; timestamp: number };
    const stale = Date.now() - parsed.timestamp > CACHE_TTL;
    return { data: parsed.data, stale };
  } catch {
    return null;
  }
}

export async function setCache(key: string, data: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `qf_cache_${key}`,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // ignore
  }
}

export interface FetchResult<T> {
  data: T;
  fromCache: boolean;
}

export async function cachedFetch<T>(
  path: string,
  cacheKey: string
): Promise<FetchResult<T>> {
  try {
    const data = await rawFetch<T>(path);
    await setCache(cacheKey, data);
    return { data, fromCache: false };
  } catch {
    const cached = await getCached<T>(cacheKey);
    if (cached) return { data: cached.data, fromCache: true };
    throw new Error("Unable to load data. Please check your connection.");
  }
}

export async function pagedFetch<T>(
  path: string,
  cacheKey: string
): Promise<FetchResult<T[]>> {
  try {
    const data = await rawFetch<PagedResponse<T>>(path);
    const items = data.content ?? [];
    await setCache(cacheKey, items);
    return { data: items, fromCache: false };
  } catch {
    const cached = await getCached<T[]>(cacheKey);
    if (cached) return { data: cached.data, fromCache: true };
    throw new Error("Unable to load data. Please check your connection.");
  }
}

export async function postJson<T>(
  path: string,
  body: unknown
): Promise<T> {
  return rawFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function postFormData<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) throw new Error(json.message ?? "Submission failed");
  return json.data;
}
