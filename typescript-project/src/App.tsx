import { useEffect, useState } from "react";
import type { Room } from "./types/room";
import { getRooms } from "./api/rooms";
import RoomCard from "./components/RoomCard";
import BookingForm from "./components/BookingForm";
import type { NewBooking } from "./types/booking";
import { createBooking } from "./api/bookings";

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

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
  }, []);

async function handleBooking(booking: NewBooking) {
  try {
    const savedBooking = await createBooking(booking);

    console.log("Bokningen sparades:", savedBooking);

    setSelectedRoom(null);
  } catch (error) {
    console.error("Kunde inte spara bokningen:", error);
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
        <p>Här kommer dina bokningar att visas.</p>
      </section>
    </main>
  );
}

export default App;
