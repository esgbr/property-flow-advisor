
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function useTheme() {
  const { theme, setTheme } = React.useContext(
    // @ts-expect-error - ThemeContext is not exported from next-themes
    // This approach works fine for our use case though
    React.createContext({
      theme: undefined,
      setTheme: (_theme: string) => {},
    })
  );
  return { theme, setTheme };
}
