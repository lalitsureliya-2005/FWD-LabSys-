import LoginForm from "@/components/LoginForm";
import { Link } from "wouter";

export default function LoginPage({ onLogin }: { onLogin: (id: string) => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-md">
                <LoginForm onLogin={onLogin} />
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
