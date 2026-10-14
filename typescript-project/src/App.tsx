import type { Room } from "./types/room";

const rooms: Room[] = [
  {
    id: "room-1",
    name: "Konferensrum A",
    location: "Ronneby",
    capacity: 8,
    price: 500,
  },
  {
    id: "room-2",
    name: "Mötesrum B",
    location: "Karlskrona",
    capacity: 4,
    price: 300,
  },
  {
    id: "room-3",
    name: "Workshoprum C",
    location: "Karlshamn",
    capacity: 12,
    price: 750,
  },
    {
    id: "room-4",
    name: "Studiorum D",
    location: "Ronneby",
    capacity: 6,
    price: 400,
  },
];


function App() {
  return (
    <main>
      <header>
        <h1>Room Booking</h1>
        <p>Hitta och boka ditt nästa rum.</p>
      </header>

      <section>
        <h2>Våra rum</h2>

        {rooms.map((room) => (
          <article key={room.id}>
            <h3>{room.name}</h3>

            <p>Plats: {room.location}</p>
            <p>Antal personer: {room.capacity}</p>
            <p>Pris: {room.price} kr</p>
          </article>
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