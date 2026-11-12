import { useEffect, useState } from "react";
import type { Room } from "./types/room";
import type { Booking, NewBooking } from "./types/booking";
import { getRooms } from "./api/rooms";
import { createBooking, getBookings, cancelBooking, } from "./api/bookings";
import RoomCard from "./components/RoomCard";
import BookingForm from "./components/BookingForm";
import List from "./components/List";

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [emailFilter, setEmailFilter] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  async function loadBookings() {
    try {
      const data = await getBookings();
      setBookings(data);
      setBookingError("");
    } catch {
      setBookingError("Kunde inte ladda bokningarna. Kontrollera API-servern.");
    } finally {
      setIsLoadingBookings(false);
    }
  }

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch {
        setError("Kunde inte ladda rummen. Kontrollera API-servern.");
      }
    }

    loadRooms();
    loadBookings();
  }, []);

  
async function handleBooking(booking: NewBooking) {
  // Hämta de senaste bokningarna från API:et
  const latestBookings = await getBookings();
  setBookings(latestBookings);

  // Kontrollera om rummet redan är bokat under tiden
  const hasConflict = latestBookings.some((existingBooking) => {
    if (
      existingBooking.roomId !== booking.roomId ||
      existingBooking.status !== "confirmed"
    ) {
      return false;
    }

    const newStart = new Date(booking.startTime).getTime();
    const newEnd = new Date(booking.endTime).getTime();
    const existingStart = new Date(existingBooking.startTime).getTime();
    const existingEnd = new Date(existingBooking.endTime).getTime();

    return newStart < existingEnd && newEnd > existingStart;
  });

  if (hasConflict) {
    throw new Error(
      "Rummet är redan bokat under den valda tiden. Välj en annan tid."
    );
  }

  await createBooking(booking);
  await loadBookings();
  setSelectedRoom(null);
}


  async function handleCancelBooking(id: string): Promise<void> {
    try {
      await cancelBooking(id);
      await loadBookings();
    } catch (error) {
      console.error("Kunde inte avboka bokningen:", error);
      setBookingError("Kunde inte avboka bokningen. Försök igen.");
    }
  }
  const filteredBookings = bookings.filter(
  (booking) =>
    booking.customerEmail.toLowerCase() === emailFilter.trim().toLowerCase()
);

  return (
    <main>
      <header>
        <h1>Room Booking</h1>
        <p>Hitta och boka ditt nästa rum.</p>
      </header>

      <section>
        <h2>Våra rum</h2>

        {error && <p role="alert">{error}</p>}

        {!error && rooms.length === 0 && <p>Laddar rum...</p>}

      <List
         items={rooms}
         getKey={(room) => room.id}
         renderItem={(room) => (
      <RoomCard
        room={room}
        onBook={() => setSelectedRoom(room)}
    />
  )}
/>
      </section>

      {selectedRoom && (
        <BookingForm
          room={selectedRoom}
          onCancel={() => setSelectedRoom(null)}
          onBook={handleBooking}
        />
      )}

      <section>
  <h2>Mina bokningar</h2>

  <label htmlFor="emailFilter">Filtrera med e-postadress:</label>
  <input
    id="emailFilter"
    type="email"
    value={emailFilter}
    onChange={(event) => setEmailFilter(event.target.value)}
    placeholder="Ange din e-postadress"
  />

  {bookingError && <p role="alert">{bookingError}</p>}

  {isLoadingBookings && <p>Laddar bokningar...</p>}

  {!isLoadingBookings && !bookingError && (
    <>
      {!emailFilter.trim() && (
        <p>Ange din e-postadress för att se dina bokningar.</p>
      )}

      {emailFilter.trim() && filteredBookings.length === 0 && (
        <p>Inga bokningar hittades för den e-postadressen.</p>
      )}

      <List
  items={filteredBookings}
  getKey={(booking) => booking.id}
  renderItem={(booking) => {
    const room = rooms.find((item) => item.id === booking.roomId);

    return (
      <article>
        <h3>{room ? room.name : "Okänt rum"}</h3>
        <p>E-post: {booking.customerEmail}</p>
        <p>Starttid: {booking.startTime}</p>
        <p>Sluttid: {booking.endTime}</p>
        <p>
          Status:{" "}
          {booking.status === "confirmed" ? "Bekräftad" : "Avbokad"}
        </p>

        {booking.status === "confirmed" && (
          <button
            type="button"
            onClick={() => handleCancelBooking(booking.id)}
          >
            Avboka
          </button>
        )}
      </article>
    );
  }}
/>
    </>
  )}
</section>
    </main>
  );
}

export default App;
