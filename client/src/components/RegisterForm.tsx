import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, User, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().default("LabStaff"),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Registration successful",
          description: "You can now log in with your new account.",
        });
        setLocation("/login"); // Redirect to login page
      } else {
        const errorData = await response.json();
        toast({
          title: "Registration failed",
          description: errorData.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Could not connect to the server.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-effect border-0 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Enter your username and password below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                placeholder=""
                className="pl-10 bg-background/50 border-gray-200 dark:border-gray-800 focus:ring-violet-500"
                {...form.register("username")}
              />
            </div>
            {form.formState.errors.username && (
              <p className="text-sm text-destructive font-medium">{form.formState.errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder=""
                className="pl-10 bg-background/50 border-gray-200 dark:border-gray-800 focus:ring-violet-500"
                {...form.register("password")}
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive font-medium">{form.formState.errors.password.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Must be at least 6 characters long
            </p>
          </div>

          <Button type="submit" className="w-full gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
            <UserPlus className="w-4 h-4" />
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
