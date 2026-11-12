import axios from "axios";
import type { FlightApiErrorBody, FlightErrorCode } from "../types";

const KNOWN_CODES: readonly FlightErrorCode[] = [
  "SEARCH_EXPIRED",
  "OFFER_EXPIRED",
  "OFFER_UNAVAILABLE",
  "HOLD_EXPIRED",
  "VALIDATION",
  "AUTH_REQUIRED",
  "NOT_FOUND",
  "NETWORK",
  "UNKNOWN",
];

export class FlightApiError extends Error {
  readonly code: FlightErrorCode;
  readonly fields: Record<string, string>;

  constructor(code: FlightErrorCode, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = "FlightApiError";
    this.code = code;
    this.fields = fields;
  }
}

const isErrorBody = (value: unknown): value is FlightApiErrorBody =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as FlightApiErrorBody).code === "string" &&
  KNOWN_CODES.includes((value as FlightApiErrorBody).code);

// Turns anything thrown by the HTTP client into a FlightApiError, so pages
// only ever branch on `code`.
export const toFlightApiError = (error: unknown): FlightApiError => {
  if (error instanceof FlightApiError) return error;
  if (axios.isAxiosError(error)) {
    if (!error.response) return new FlightApiError("NETWORK", "We couldn't reach TravelMate. Check your connection.");
    const body = error.response.data;
    if (isErrorBody(body)) return new FlightApiError(body.code, body.message, body.fields ?? {});
    if (error.response.status === 401) return new FlightApiError("AUTH_REQUIRED", "Please sign in to continue.");
    if (error.response.status === 404) return new FlightApiError("NOT_FOUND", "We couldn't find that.");
  }
  return new FlightApiError("UNKNOWN", "Something went wrong. Please try again.");
};
