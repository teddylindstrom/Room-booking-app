# Individuell projektrapport – Room Booking

**Namn:** Teddy Lindström  
**Utbildning:** Frontendutveckling  
**Projekt:** Room Booking  
**Tekniker:** React, TypeScript, Vite och JSON Server

## 1. TypeScript som typsäkert lager

I detta projekt har jag använt TypeScript tillsammans med React för att skapa en tydligare och mer strukturerad kodbas. Jämfört med vanlig JavaScript har TypeScript hjälpt mig att upptäcka potentiella fel redan under utvecklingen, innan applikationen körs.

Jag har framför allt använt interfaces och typer för att beskriva hur informationen i applikationen ska vara strukturerad. Exempelvis har jag skapat `Room` och `Booking` för att definiera vilken information ett rum respektive en bokning ska innehålla. 

### Vad TypeScript tillförde

En stor fördel med TypeScript är att det blir tydligare vilken information olika delar av applikationen förväntar sig. Genom att använda interfaces kan jag definiera vilka egenskaper som krävs och vilken datatyp de ska ha.

Ett exempel är mitt `Room`-interface, där varje rum ska ha ett id, namn, plats, kapacitet och pris. På samma sätt beskriver `Booking` vilken information som behövs för en bokning, exempelvis rummets id, kundens e-postadress, starttid, sluttid och bokningsstatus.

Detta har gjort det enklare att arbeta med informationen mellan komponenter och funktioner. Jag kan exempelvis se vilka egenskaper ett rum har när jag skickar informationen vidare till komponenten `RoomCard`.

Jag har även använt union-typen `BookingStatus` för att begränsa bokningens status till två möjliga värden: `"confirmed"` eller `"cancelled"`. Det minskar risken för att använda felaktiga statusvärden i applikationen.

### Nackdelar med den extra syntaxen

En nackdel med TypeScript jämfört med JavaScript är att det kräver mer förberedelse och fler definitioner. Jag behöver exempelvis skapa interfaces och ange typer för vissa funktioner och tillstånd innan jag kan arbeta vidare med funktionaliteten.

Under utvecklingen har jag också behövt lägga tid på att förstå TypeScripts felmeddelanden och hur olika typer hänger ihop. Det kan kännas som ett extra steg, men jag upplever samtidigt att det gör koden tydligare och enklare att felsöka när projektet växer.

### Begränsningar med typsäkerheten

En viktig begränsning är att TypeScript främst kontrollerar typer under utvecklingen och vid kompilering. Det innebär inte att information som hämtas från ett API automatiskt är korrekt.

I mitt projekt används JSON Server för att hämta och spara information i `db.json`. När informationen hämtas från API:et anger jag att den ska motsvara exempelvis typen `Room`. Men om informationen i `db.json` saknar en egenskap, innehåller fel datatyp eller har ett oväntat värde upptäcker TypeScript inte automatiskt detta vid körning.

Det beror på att TypeScript-typer inte validerar den faktiska informationen som kommer från API:et. För att kontrollera sådan information även vid körning skulle jag behöva använda separat datavalidering.

Jag har därför fått en bättre förståelse för att TypeScript ger ett viktigt skydd när jag skriver kod, men att det inte ersätter kontroll av information från externa datakällor.

## 2. Inference vs. explicit typning

Under utvecklingen av Room Booking har jag använt både typinferens och explicit typning. Jag har försökt låta TypeScript automatiskt avgöra datatyper när det är möjligt, men också angett typer manuellt där det behövs för att göra koden tydligare och mer förutsägbar.

### Typinferens

Ett exempel på typinferens finns i funktionen `loadBookings()` i `App.tsx`:

```tsx
const data = await getBookings();
```

Eftersom funktionen `getBookings()` har en definierad returtyp förstår TypeScript automatiskt att `data` innehåller en lista av bokningar av typen `Booking[]`. Jag behöver därför inte ange typen manuellt.

Ett annat exempel finns när jag använder `.map()` för att visa bokningarna:

```tsx
bookings.map((booking) => {
  // ...
});
```

Eftersom `bookings` redan är definierad som en array av typen `Booking[]` kan TypeScript automatiskt förstå att varje objekt i listan är av typen `Booking`. Det gör att jag slipper upprepa typinformationen.

### Explicit typning

Ett exempel på explicit typning finns i min state-hantering för rum:

```tsx
const [rooms, setRooms] = useState<Room[]>([]);
```

Här anger jag att state ska innehålla en array av typen `Room`. Eftersom startvärdet är en tom array hjälper den explicita typningen TypeScript att förstå vilken typ av information som ska lagras där.

Ett annat exempel är funktionen `handleBooking()`:

```tsx
async function handleBooking(booking: NewBooking) {
  // ...
}
```

Här anger jag att funktionen ska ta emot ett objekt av typen `NewBooking`. Det gör det tydligt vilken information som krävs för att skapa en ny bokning. Typen bygger på `Booking`, men använder utility-typen `Omit` för att ta bort egenskapen `id`, eftersom ett nytt bokningsobjekt inte behöver ha ett id innan det sparas.

### Reflektion

Jag har lärt mig att typinferens hjälper till att hålla koden mindre upprepande, medan explicit typning ger bättre kontroll när TypeScript behöver mer information. Med dessa två arbetssätten är koden lättare att separera och förstå samt underhålla.

## 3. Felsökning

Under utvecklingen av Room Booking stötte jag på problem som krävde felsökning. Vissa problem var kopplade till TypeScript och andra till applikationens funktionalitet.

### Typfel 1 – Saknad export av getBookings

**Problemet:**

När jag skulle hämta och visa bokningar i `App.tsx` fick jag ett fel eftersom jag importerade funktionen `getBookings` från `src/api/bookings.ts`, men funktionen inte var exporterad från den filen.

**Felmeddelande:**

```text
Module "./api/bookings" has no exported member 'getBookings'. ts(2305)
```

**Vad felet betydde:**

TypeScript kunde inte hitta någon exporterad funktion med namnet `getBookings` i filen jag försökte importera från. Importen stämde alltså inte överens med vad som fanns tillgängligt i `bookings.ts`.

**Lösning:**

Jag löste problemet genom att lägga till och exportera funktionen `getBookings` i `src/api/bookings.ts`. Funktionen hämtar bokningarna från JSON Server och returnerar dem som en lista av typen `Booking[]`.

### Felsökningsproblem 2 – Bokningarna hämtades inte vid sidstart

**Problemet:**

Under utvecklingen upptäckte jag att bokningarna inte visades när applikationen startade. Jag hade skapat funktionen `loadBookings()` för att hämta bokningar från API:et, men hade glömt att anropa funktionen i min `useEffect`.

**Vad problemet betydde:**

Även om funktionen fanns i koden kördes den aldrig när sidan laddades. Därför hämtades inga bokningar från API:et vid sidstart.

**Lösning:**

Jag löste problemet genom att anropa `loadBookings()` i `useEffect`, tillsammans med `loadRooms()`. På så sätt hämtas både rum och bokningar när applikationen startar.

### Reflektion

Genom felsökningen har jag fått en bättre förståelse för skillnaden mellan TypeScript-fel och funktionella fel. TypeScript kan hjälpa mig att upptäcka problem med exempelvis importer och typer, men jag behöver även testa applikationen för att upptäcka när funktioner inte körs som de ska.

## 4. Retrospektiv

Att genomföra projektet individuellt har varit både utmanande och väldigt lärorikt. Jag har fått ta ansvar för hela utvecklingsprocessen, från planering och strukturering till implementation, felsökning och testning.

Det har varit mycket att ta sig an på egen hand, och jag hade gärna haft någon att arbeta tillsammans med för att kunna diskutera lösningar och dela upp arbetsuppgifterna. Samtidigt har det individuella arbetet gjort att jag har behövt förstå varje del av projektet på ett djupare plan. Jag har inte kunnat förlita mig på att någon annan löser ett problem, utan har behövt undersöka, testa och hitta lösningar själv.

En av de största utvecklingarna jag märker hos mig själv är hur mycket bättre jag har blivit på att söka fram information och använda dokumentation för att komma vidare. Jag har lärt mig att inte fastna för länge i enklare problem, utan att mer självständigt identifiera vad som behöver göras och hitta rätt väg framåt. Jag känner också att jag idag hanterar tekniska hinder och felsökning betydligt bättre än innan jag påbörjade projektet.

Projektet har gett mig en större förståelse för hur React, TypeScript och API-hantering samverkar i en applikation. Jag har också fått praktisk erfarenhet av att strukturera kod, arbeta med datamodeller och bygga funktionalitet som faktiskt fungerar tillsammans.

Jag har fortfarande en bit kvar innan jag når mitt långsiktiga mål att arbeta som fullstackutvecklare, men efter det här projektet känner jag att jag är på väldigt god väg. Framför allt har jag fått ett större självförtroende i min förmåga att lära mig nya saker, lösa problem och ta mig an tekniska utmaningar på egen hand.