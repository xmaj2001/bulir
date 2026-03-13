import { getSession, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// ── Tipos de erro ──────────────────────────────────────────────────────────────

export interface ApiError {
  success: false;
  error: { code: number; message: string };
  ts: string;
  path: string;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly path: string,
  ) {
    super(`[api] ${status} ${path} — ${message}`);
  }
}

// ── Response shapes ────────────────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  name: string;
  email?: string | null;
  nif?: string | null;
  role: string;
  avatarUrl?: string | null;
  emailVerified: boolean;
  balance: number;
}

export interface ApiService {
  id: string;
  name: string;
  imageUrl?: string | null;
  description: string;
  price: number;
  isActive: boolean;
  providerId: string;
  provider: ApiUser;
  createdAt: string;
  updatedAt: string;
}

export enum ApiBookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface ApiBooking {
  id: string;
  serviceId: string;
  clientId: string;
  status: ApiBookingStatus;
  notes?: string | null;
  scheduledAt?: string | null;
  totalPrice: number;
  confirmedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  createdAt: string;
  updatedAt: string;
  service: ApiService;
  client?: ApiUser;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  ts: string;
}

export interface AuthData {
  user: ApiUser;
  accessToken: string;
  // refresh_token → cookie HTTP-only setado pela API, nunca no body
}

export type AuthResponse = ApiEnvelope<AuthData>;
export type ServiceResponse = ApiEnvelope<ApiService>;
export type ServicesResponse = ApiEnvelope<ApiService[]>;
export type BookingResponse = ApiEnvelope<ApiBooking>;
export type BookingsResponse = ApiEnvelope<ApiBooking[]>;

// ── Core Fetch ────────────────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  // cookie externo a repassar (usado no SSR para o refresh)
  forwardCookie?: string;
  // token explícito (opcional)
  token?: string;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { forwardCookie, token, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((rest.headers as Record<string, string>) ?? {}),
  };

  // 1. Tentar obter token (pessoal ou da sessão se no client)
  let authToken = token;
  if (!authToken && typeof window !== "undefined") {
    const session = await getSession();
    if (session?.accessToken) {
      authToken = session.accessToken;
    }
  }

  // 2. Injetar Authorization se tivermos token
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  if (forwardCookie) {
    headers["Cookie"] = forwardCookie;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[api] ${res.status} ${path} — ${body}`);
  }
  return res.json() as Promise<T>;
}

// ── Auth Endpoints ────────────────────────────────────────────────────────────

export function signInEmail(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/sign-in/email", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signInNif(
  nif: string,
  password: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/sign-in/nif", {
    method: "POST",
    body: JSON.stringify({ nif, password }),
  });
}

export function signUpEmail(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  return apiFetch<void>("/auth/sign-up/email", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function signUpNif(
  name: string,
  nif: string,
  password: string,
): Promise<void> {
  return apiFetch<void>("/auth/sign-up/nif", {
    method: "POST",
    body: JSON.stringify({ name, nif, password }),
  });
}

// ── Service Endpoints ─────────────────────────────────────────────────────────

export function getServices(): Promise<ServicesResponse> {
  return apiFetch<ServicesResponse>("/services");
}

export async function getMyServices(): Promise<ServicesResponse> {
  return apiFetch<ServicesResponse>("/services/mine");
}

export function createService(data: {
  name: string;
  description: string;
  price: number;
  isActive?: boolean;
}): Promise<ServiceResponse> {
  return apiFetch<ServiceResponse>("/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Booking Endpoints ─────────────────────────────────────────────────────────

export function createBooking(data: {
  serviceId: string;
  notes?: string;
  scheduledAt?: Date | string;
}): Promise<BookingResponse> {
  return apiFetch<BookingResponse>("/services/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMyBookings(): Promise<BookingsResponse> {
  return apiFetch<BookingsResponse>("/services/bookings/mine");
}

// ── Session & Tokens ─────────────────────────────────────────────────────────

// Chamado pelo NextAuth no servidor — o browser não está presente aqui.
// Por isso repassamos o cookie manualmente via header Cookie.
interface RefreshToken {
  accessToken?: unknown;
  accessTokenExpires?: unknown;
  error?: unknown;
  [key: string]: unknown;
}

export async function refreshAccessToken(
  token: RefreshToken,
  forwardCookie?: string,
): Promise<RefreshToken> {
  try {
    const data = await apiFetch<AuthResponse>("/auth/refresh", {
      method: "POST",
      forwardCookie,
    });

    return {
      ...token,
      accessToken: data.data.accessToken,
      accessTokenExpires: Date.now() + 14 * 60 * 1000,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
