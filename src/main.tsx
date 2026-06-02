import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/contexts/AuthContext"
import { PatientRequestsProvider } from "@/contexts/PatientRequestsContext"
import { NursingProvider } from "@/contexts/NursingContext"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PatientRequestsProvider>
            <NursingProvider>
              <TooltipProvider>
                <App />
              </TooltipProvider>
            </NursingProvider>
          </PatientRequestsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
