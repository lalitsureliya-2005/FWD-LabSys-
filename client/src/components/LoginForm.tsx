import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TestTube2, LogIn, User } from "lucide-react";
import { Link } from "wouter";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [error, setError] = useState("");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        onLogin();
      } else {
        let errorMsg = "Invalid credentials";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch { }
        setError(errorMsg);
      }
    } catch (error) {
      setError("Could not connect to the server.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Decorative medical icons */}
      <div className="absolute inset-0 pointer-events-none">
        <img src="/assets/healthy-1.svg" alt="medical icon" className="absolute top-20 left-20 w-16 h-16 opacity-60 animate-float-slow" />
        <img src="/assets/healthy-2.svg" alt="medical icon" className="absolute bottom-20 right-20 w-12 h-12 opacity-50 animate-float-slower" />
        <img src="/assets/healthy-1.svg" alt="medical icon" className="absolute top-1/3 right-32 w-10 h-10 opacity-40 animate-bounce-gentle" />
        <img src="/assets/healthy-2.svg" alt="medical icon" className="absolute bottom-1/3 left-32 w-14 h-14 opacity-45 animate-float-slow" />
      </div>

      <div className="relative w-full max-w-4xl z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Welcome content */}
          <div className="hidden md:block text-center md:text-left animate-fade-in-up">
            <div className="mb-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <TestTube2 className="w-5 h-5" />
                Advanced Lab Management
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                Welcome Back
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Access your laboratory management system to monitor patient records, manage test results, and streamline healthcare operations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                <div className="text-sm text-muted-foreground">Daily Tests</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.9%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-full max-w-md mx-auto animate-slide-in-right">
            <Card className="glass-effect border-0 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80">
              <CardHeader className="text-center space-y-4 pb-2">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-gentle">
                  <TestTube2 className="w-10 h-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Hospital Lab System
                  </CardTitle>
                  <CardDescription className="text-base mt-3 text-muted-foreground">
                    Secure access to your medical dashboard
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      autoComplete="username"
                      data-testid="input-username"
                      className="h-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                      {...form.register("username")}
                    />
                    {form.formState.errors.username && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {form.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      data-testid="input-password"
                      className="h-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                      {...form.register("password")}
                    />
                    {form.formState.errors.password && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in-up">
                      <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        {error}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 animate-glow-pulse"
                    data-testid="button-login"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In to Dashboard
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      Register here
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
