import type { Booking, NewBooking } from "../types/booking";
import { request } from "./request";

// Skapar en ny bokning genom att göra ett POST-anrop till API:et med bokningsinformationen.
export async function createBooking(
  booking: NewBooking
): Promise<Booking> {
  return request<Booking>(
    "http://localhost:3000/bookings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    }
  );
}

// Uppdaterar statusen för en bokning till "cancelled" genom att göra ett PATCH-anrop till API:et.
export async function cancelBooking(id: string): Promise<void> {
  return request<void>(
    `http://localhost:3000/bookings/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "cancelled",
      }),
    }
  );
}

// Hämtar bokningar från API:et och returnerar dem som en array av Booking-objekt.
export async function getBookings(): Promise<Booking[]> {
  return request<Booking[]>("http://localhost:3000/bookings");
}
