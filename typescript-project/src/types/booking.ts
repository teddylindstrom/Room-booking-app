export type BookingStatus = "confirmed" | "cancelled";
export type NewBooking = Omit<Booking, "id">;

export interface Booking {
  id: string;
  roomId: string;
  customerEmail: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
}