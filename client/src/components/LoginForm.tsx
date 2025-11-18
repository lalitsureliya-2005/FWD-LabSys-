import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TestTube2, LogIn, BadgeCheck } from "lucide-react";

const loginSchema = z.object({
  employeeId: z.string().min(3, "Employee ID must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (employeeId: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [error, setError] = useState("");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      employeeId: "",
      password: "",
    },
  });

  const handleSubmit = (data: LoginFormData) => {
    setError("");
    
    // For prototype: simple validation (any employee ID with password "1234" works)
    if (data.password === "1234") {
      console.log("Login successful:", data.employeeId);
      onLogin(data.employeeId);
    } else {
      setError("Invalid credentials. Use password: 1234");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <TestTube2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Hospital Lab System</CardTitle>
            <CardDescription className="text-base mt-2">
              Sign in with your employee credentials
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-muted-foreground" />
                Employee ID
              </Label>
              <Input
                id="employeeId"
                placeholder="Enter your employee ID"
                autoComplete="username"
                data-testid="input-employee-id"
                {...form.register("employeeId")}
              />
              {form.formState.errors.employeeId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.employeeId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                data-testid="input-password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full gap-2" data-testid="button-login">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Demo Mode: Use any Employee ID with password <code className="font-mono bg-muted px-1 py-0.5 rounded">1234</code>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
