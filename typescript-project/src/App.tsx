import { useEffect, useState } from "react";
import type { Room } from "./types/room";
import { getRooms } from "./api/rooms";
import RoomCard from "./components/RoomCard";
import BookingForm from "./components/BookingForm";
import { createBooking, cancelBooking } from "./api/bookings";
import type { Booking, NewBooking } from "./types/booking";

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    async function 
    loadRooms() {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch {
        setError("Kunde inte ladda rummen. Kontrollera API-servern.");
      }
    }

    loadRooms();
  }, []);

async function handleBooking(booking: NewBooking) {
  const savedBooking = await createBooking(booking);

  console.log("Bokningen sparades:", savedBooking);

  setBookings((currentBookings) => [...currentBookings, savedBooking]);
  setSelectedRoom(null);
}

async function handleCancelBooking(id: string): Promise<void> {
  try {
    await cancelBooking(id);
    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === id ? { ...booking, status: "cancelled" } : booking,
      ),
    );
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

        {error && <p>{error}</p>}

        {!error && rooms.length === 0 && (
          <p>Laddar rum...</p>
        )}

        
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

  {!bookingError && bookings.length === 0 && (
    <p>Du har inga bokningar ännu.</p>
  )}

  {bookings.map((booking) => {
    const room = rooms.find((room) => room.id === booking.roomId);

    return (
      <article key={booking.id}>
        <h3>{room ? room.name : "Okänt rum"}</h3>

        <p>E-post: {booking.customerEmail}</p>
        <p>Starttid: {booking.startTime}</p>
        <p>Sluttid: {booking.endTime}</p>
        <p>Status: {booking.status === "confirmed" ? "Bekräftad" : "Avbokad"}</p>

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
