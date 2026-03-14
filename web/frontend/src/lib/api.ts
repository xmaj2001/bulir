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
}

export type AuthResponse = ApiEnvelope<AuthData>;
export type MeResponse = ApiEnvelope<ApiUser>;
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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && typeof window !== "undefined") {
    const body = await res.json();
    console.log("apiFetch", body);
    if (body.error.message.includes("Token")) {
      const refreshed = await fetch("/api/auth/refresh", { method: "POST" });
      if (refreshed.ok) return apiFetch<T>(path, options);
    }
    window.location.href = "/auth/login";
    throw new Error("Sessão expirada");
  }

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

export function getMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/users/me");
}

// ── Service Endpoints ─────────────────────────────────────────────────────────

export function getServices(): Promise<ServicesResponse> {
  return apiFetch<ServicesResponse>("/services");
}

export async function getMyServices(): Promise<ServicesResponse> {
  const response = await apiFetch<ServicesResponse>("/services/mine");
  console.log("getMyServices", response);
  return response;
}

export function createService(data: {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
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
