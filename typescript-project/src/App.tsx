import type { Room } from "./types/room";
import RoomCard from "./components/RoomCard";
import { useEffect, useState } from "react";
import { getRooms } from "./api/rooms";



function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");

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
          <RoomCard key={room.id} room={room} />
        ))}
      </section>

      <section>
        <h2>Mina bokningar</h2>
        <p>Här kommer dina bokningar att visas.</p>
      </section>
    </main>
  );
}

export default App;
