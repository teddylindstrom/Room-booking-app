import type { Booking, NewBooking } from "../types/booking";

export async function createBooking(
  booking: NewBooking
): Promise<Booking> {
  const response = await fetch(
    "http://localhost:3000/bookings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    }
  );

  if (!response.ok) {
    throw new Error("Kunde inte spara bokningen.");
  }

  const savedBooking: Booking = await response.json();

  return savedBooking;
}