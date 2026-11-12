import type { Key, ReactNode } from "react";

// Den här filen innehåller en generisk komponent som kan rendera en lista av objekt av valfri typ T.
type ListProps<T> = {
  items: T[];
  getKey: (item: T) => Key;
  renderItem: (item: T) => ReactNode;
};

// Det här fungerar på samma sätt som Array.map, men med typkontroll och möjlighet att specificera hur varje objekt ska renderas.
function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return (
    <>
      {items.map((item) => (
        <div key={getKey(item)}>
          {renderItem(item)}
        </div>
      ))}
    </>
  );
}

export default List;
