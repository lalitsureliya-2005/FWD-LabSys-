import { Link, useLocation } from "wouter";
import { TestTube2, Search, List, Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface NavigationProps {
  employeeId?: string;
  onLogout?: () => void;
}

export default function Navigation({ employeeId, onLogout }: NavigationProps) {
  const [location] = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const navItems = [
    { path: "/", label: "New Entry", icon: TestTube2 },
    { path: "/search", label: "Search", icon: Search },
    { path: "/records", label: "View Records", icon: List },
  ];

  return (
    <nav className="backdrop-blur-sm bg-card/80 border-b border-card-border sticky top-0 z-50 shadow-sm theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
              <TestTube2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground shimmer">Lab Test System</span>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                    data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            
            <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-theme-toggle" aria-label="Toggle theme">
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {employeeId && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm font-medium">{employeeId}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="gap-2"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
