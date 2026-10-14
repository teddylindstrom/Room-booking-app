import type { Room } from "../types/room";

interface RoomCardProps {
  room: Room;
}

function RoomCard({ room }: RoomCardProps) {
  return (
    <article>
      <h3>{room.name}</h3>

      <p>Plats: {room.location}</p>
      <p>Antal personer: {room.capacity}</p>
      <p>Pris: {room.price} kr</p>
    </article>
  );
}

export default RoomCard;
