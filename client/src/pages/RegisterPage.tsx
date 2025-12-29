import RegisterForm from "@/components/RegisterForm";
import { Link } from "wouter";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
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
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white mb-4 shadow-lg shadow-violet-500/30">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Join Laboratory
          </h1>
          <p className="text-muted-foreground mt-2">
            Create your account to manage patient records
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-600 hover:text-violet-700 font-semibold hover:underline transition-colors">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
