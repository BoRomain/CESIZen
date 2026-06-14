import { createContext } from "react";

interface SnackbarContextType {
  showMessage: (
    message: string,
    severity?: "success" | "error" | "warning" | "info",
  ) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);
