import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import LoginForm from "@/components/LoginForm";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import RecordsPage from "@/pages/RecordsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/records" component={RecordsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    const savedEmployeeId = localStorage.getItem("employeeId");
    if (savedEmployeeId) {
      setEmployeeId(savedEmployeeId);
    }
  }, []);

  const handleLogin = (id: string) => {
    setEmployeeId(id);
    localStorage.setItem("employeeId", id);
  };

  const handleLogout = () => {
    setEmployeeId(null);
    localStorage.removeItem("employeeId");
  };

  if (!employeeId) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LoginForm onLogin={handleLogin} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation employeeId={employeeId} onLogout={handleLogout} />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
