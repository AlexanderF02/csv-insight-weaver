import { ThemeProvider } from "@/components/ThemeProvider"; 
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx"; 
import Dashboard from "./pages/Dashboard.jsx";
import Savedcsv from "./pages/Savedcsv.jsx";
import Editdashboard from "./pages/Editdashboard.jsx";
import Profile from "./pages/Profile.jsx";
import SavedAnalys from "./pages/SavedAnalys.jsx";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/savedcsv" element={<Savedcsv />} />
            <Route path="/editdashboard" element={<Editdashboard />} />
            <Route path="/savedanalys" element={<SavedAnalys />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

