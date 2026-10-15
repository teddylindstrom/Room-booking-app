
import type { Room } from "../types/room";

export async function getRooms(): Promise<Room[]> {
  const response = await fetch("http://localhost:3000/rooms");

  if (!response.ok) {
    throw new Error("Kunde inte hämta rummen.");
  }

  const rooms: Room[] = await response.json();

  return rooms;
}
