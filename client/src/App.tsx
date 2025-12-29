import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import RecordsPage from "@/pages/RecordsPage";
import NotFound from "@/pages/not-found";
import RegisterPage from "@/pages/RegisterPage";
import LoginForm from "@/components/LoginForm";
import { PublicUser } from "@shared/schema";
import { Loader2 } from "lucide-react";

const fetchMe = async (): Promise<PublicUser | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok) {
    const user = await response.json();
    return { id: user.id, username: user.username, createdAt: new Date() };
  }
  return null;
};

function App() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    queryClient.invalidateQueries({ queryKey: ['me'] });
    setLocation("/");
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    queryClient.setQueryData(['me'], null);
    setLocation("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {user && <Navigation username={user.username} onLogout={handleLogout} />}
      <Switch>
        <Route path="/login">
          {user ? <Redirect to="/" /> : <LoginForm onLogin={handleLogin} />}
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <RegisterPage />}
        </Route>

        <Route path="/">
          {!user ? <Redirect to="/login" /> : <HomePage />}
        </Route>
        <Route path="/search">
          {!user ? <Redirect to="/login" /> : <SearchPage />}
        </Route>
        <Route path="/records">
          {!user ? <Redirect to="/login" /> : <RecordsPage />}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <App />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default Root;
