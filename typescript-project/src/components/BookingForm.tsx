
import { useState } from "react";
import type { FormEvent } from "react";
import type { Room } from "../types/room";
import type { NewBooking } from "../types/booking";

interface BookingFormProps {
  room: Room;
  onCancel: () => void;
  onBook: (booking: NewBooking) => Promise<void>;
}

function BookingForm({ room, onCancel, onBook }: BookingFormProps) {
  const [customerEmail, setCustomerEmail] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (new Date(endTime) <= new Date(startTime)) {
      setError("Sluttiden måste vara efter starttiden.");
      return;
    }

    const booking: NewBooking = {
      roomId: room.id,
      customerEmail,
      startTime,
      endTime,
      status: "confirmed",
    };

    try {
      setIsSaving(true);
      await onBook(booking);
    } catch {
      setError("Bokningen kunde inte sparas. Försök igen.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section>
      <h2>Boka {room.name}</h2>
      <p>Plats: {room.location}</p>
      <p>Pris: {room.price} kr</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="customerEmail">E-postadress</label>
        <input
          id="customerEmail"
          type="email"
          value={customerEmail}
          onChange={(event) => setCustomerEmail(event.target.value)}
          required
        />

        <label htmlFor="startTime">Starttid</label>
        <input
          id="startTime"
          type="datetime-local"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
          required
        />

        <label htmlFor="endTime">Sluttid</label>
        <input
          id="endTime"
          type="datetime-local"
          value={endTime}
          onChange={(event) => setEndTime(event.target.value)}
          min={startTime || undefined}
          required
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Sparar..." : "Bekräfta bokning"}
        </button>

        <button type="button" onClick={onCancel}>
          Avbryt
        </button>
      </form>
    </section>
  );
}

export default BookingForm;
