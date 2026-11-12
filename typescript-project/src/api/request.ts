// Den här filen innehåller en funktion för att göra API-anrop med hjälp av fetch och hantera svaren på ett typat sätt.
export async function request<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, init);

  // Kontrollera om svaret från API-anropet är framgångsrikt (statuskod 200-299)
  if (!response.ok) {
    throw new Error(`API-anropet misslyckades (${response.status}).`);
  }

  // Läs svaret som text och kontrollera om det är tomt. Om tomt, returnera undefined som typ T.
  const data = await response.text();

  if (!data) {
    return undefined as T;
  }

  return JSON.parse(data) as T;
}
