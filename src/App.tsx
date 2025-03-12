
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HospitalDetail from "./pages/HospitalDetail";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import HospitalManagement from "./pages/admin/HospitalManagement";
import AppointmentManagement from "./pages/admin/AppointmentManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Patient routes */}
          <Route path="/" element={<Index />} />
          <Route path="/hospital/:id" element={<HospitalDetail />} />
          <Route path="/appointments" element={<Appointments />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/hospitals" element={<HospitalManagement />} />
          <Route path="/admin/appointments" element={<AppointmentManagement />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
