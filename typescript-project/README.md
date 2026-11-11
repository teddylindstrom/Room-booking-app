# Room Booking

## Om projektet

Room Booking är en webbapplikation utvecklad med React och TypeScript. Applikationen gör det möjligt för användare att se tillgängliga rum, skapa bokningar och avboka befintliga bokningar.

Projektet är utvecklat som en individuell examination och består av en sida utan routing.

### Funktioner

- Visa tillgängliga rum.
- Skapa bokningar med e-postadress, starttid och sluttid.
- Visa sparade bokningar.
- Förhindra dubbelbokningar av samma rum under överlappande tider.
- Avboka befintliga bokningar.
- Spara och hämta bokningar via JSON Server.
- Behålla bokningsinformation efter omladdning av sidan.

## Tekniker

- React
- TypeScript
- Vite
- JSON Server
- REST API
- HTML och CSS

## Projektstruktur

```text
src/
├── api/
│   ├── bookings.ts
│   └── rooms.ts
├── components/
│   ├── BookingForm.tsx
│   └── RoomCard.tsx
├── types/
│   ├── booking.ts
│   └── room.ts
└── App.tsx

db.json
```

## Installation

Klona projektet från GitHub och gå till projektmappen.

Installera beroenden:

```bash
npm install
```

## Starta applikationen

Applikationen använder två separata processer som behöver köras samtidigt.

### 1. Starta JSON Server

Öppna en terminal och kör:

```bash
npm run api
```

JSON Server startar på:

```text
http://localhost:3000
```

API-endpoints:

- `http://localhost:3000/rooms`
- `http://localhost:3000/bookings`

### 2. Starta React-applikationen

Öppna en ny terminal och kör:

```bash
npm run dev
```

Öppna därefter adressen som Vite visar, vanligtvis:

```text
http://localhost:5173
```

## Bygga projektet

För att kontrollera TypeScript och skapa en produktionsversion kör:

```bash
npm run build
```

## Datamodellering

Applikationen använder två relaterade resurstyper:

**Room:** Beskriver de rum som kan bokas.

**Booking:** Beskriver en bokning och innehåller en referens till rummet genom `roomId`, bokarens e-postadress, starttid, sluttid och bokningsstatus.

Bokningsstatus hanteras med en union-typ:

```typescript
type BookingStatus = "confirmed" | "cancelled";
```

Nya bokningar använder utility-typen `Omit` för att exkludera id innan bokningen sparas.

## Utvecklare

**Teddy Lindström**

Individuell examination – React och TypeScript.