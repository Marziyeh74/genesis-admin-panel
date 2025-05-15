
import { createContext, useContext, useEffect, useState } from "react";

type Direction = "ltr" | "rtl";

type DirectionProviderProps = {
  children: React.ReactNode;
  defaultDirection?: Direction;
  storageKey?: string;
};

type DirectionProviderState = {
  direction: Direction;
  setDirection: (direction: Direction) => void;
};

const initialState: DirectionProviderState = {
  direction: "ltr",
  setDirection: () => null,
};

const DirectionProviderContext = createContext<DirectionProviderState>(initialState);

export function DirectionProvider({
  children,
  defaultDirection = "ltr",
  storageKey = "admin-ui-direction",
  ...props
}: DirectionProviderProps) {
  const [direction, setDirection] = useState<Direction>(
    () => (localStorage.getItem(storageKey) as Direction) || defaultDirection
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.dir = direction;
    localStorage.setItem(storageKey, direction);
  }, [direction, storageKey]);

  const value = {
    direction,
    setDirection: (direction: Direction) => setDirection(direction),
  };

  return (
    <DirectionProviderContext.Provider {...props} value={value}>
      {children}
    </DirectionProviderContext.Provider>
  );
}

export const useDirection = () => {
  const context = useContext(DirectionProviderContext);

  if (context === undefined)
    throw new Error("useDirection must be used within a DirectionProvider");

  return context;
};
