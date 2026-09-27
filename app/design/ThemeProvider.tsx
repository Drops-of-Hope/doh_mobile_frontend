import React, { createContext, useContext } from "react";
import { lightTokens, Tokens } from "./tokens";

const ThemeContext = createContext<Tokens>(lightTokens);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Light "paper" theme only for now — see darkTokens stub in tokens.ts.
  return <ThemeContext.Provider value={lightTokens}>{children}</ThemeContext.Provider>;
};

export function useTheme(): Tokens {
  return useContext(ThemeContext);
}
