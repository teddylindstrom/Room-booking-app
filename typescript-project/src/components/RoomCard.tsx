import type { Room } from "../types/room";

interface RoomCardProps {
  room: Room;
  onBook: () => void;
}

function RoomCard({ room, onBook }: RoomCardProps) {
  return (
    <article>
      <h3>{room.name}</h3>
      <p>Plats: {room.location}</p>
      <p>Antal personer: {room.capacity}</p>
      <p>Pris: {room.price} kr</p>

      <button type="button" onClick={onBook}>
        Boka rum
      </button>
    </article>
  );
}

export default RoomCard;