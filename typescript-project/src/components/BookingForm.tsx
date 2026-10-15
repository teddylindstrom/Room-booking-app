
import type { Room } from "../types/room";

interface BookingFormProps {
  room: Room;
  onCancel: () => void;
}

function BookingForm({ room, onCancel }: BookingFormProps) {
  return (
    <section>
      <h2>Boka {room.name}</h2>

      <p>Plats: {room.location}</p>
      <p>Pris: {room.price} kr</p>

      <form>
        <label htmlFor="customerEmail">E-postadress</label>
        <input
          id="customerEmail"
          type="email"
          required
        />

        <label htmlFor="startTime">Starttid</label>
        <input
          id="startTime"
          type="datetime-local"
          required
        />

        <label htmlFor="endTime">Sluttid</label>
        <input
          id="endTime"
          type="datetime-local"
          required
        />

        <button type="submit">Bekräfta bokning</button>

        <button type="button" onClick={onCancel}>
          Avbryt
        </button>
      </form>
    </section>
  );
}

export default BookingForm;
