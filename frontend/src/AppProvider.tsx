import React, { ReactNode } from "react";
import { ContentHeightProvider } from "./context/ContentHeightContext";
import { NavbarProvider } from "./context/NavbarContext";
import { ColorContextProvider } from "./context/ColorContext";

interface AppProviderProps {
  children: ReactNode;
}
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ContentHeightProvider>
      <ColorContextProvider>
        <NavbarProvider>{children}</NavbarProvider>
      </ColorContextProvider>
    </ContentHeightProvider>
  );
};
