import { useEffect, useState } from "react";
import type { Room } from "./types/room";
import type { Booking, NewBooking } from "./types/booking";
import { getRooms } from "./api/rooms";
import { createBooking, getBookings, cancelBooking, } from "./api/bookings";
import RoomCard from "./components/RoomCard";
import BookingForm from "./components/BookingForm";

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
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
    try {
      await createBooking(booking);
      await loadBookings();
      setSelectedRoom(null);
    } catch (error) {
      console.error("Kunde inte spara bokningen:", error);
      throw error;
    }
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

        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onBook={() => setSelectedRoom(room)}
          />
        ))}
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

        {bookingError && <p role="alert">{bookingError}</p>}

        {isLoadingBookings && <p>Laddar bokningar...</p>}

        {!isLoadingBookings && !bookingError && bookings.length === 0 && (
          <p>Du har inga bokningar ännu.</p>
        )}

        {bookings.map((booking) => {
          const room = rooms.find((item) => item.id === booking.roomId);

          return (
            <article key={booking.id}>
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
        })}
      </section>
    </main>
  );
}

export default App;
