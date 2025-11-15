"use client";

import {IconX} from "@tabler/icons-react";
import {useState} from "react";

type AuthMode = "login" | "signup";

interface UserInfo {
    full_name: string;
    email: string;
}

interface AuthFormProps {
    mode?: AuthMode;
    onModeChange?: (mode: AuthMode) => void;
    onSuccess?: () => void;
    onClose?: () => void;
}

function AuthForm({mode = "login", onModeChange, onSuccess, onClose}: AuthFormProps) {
    const [currentMode, setCurrentMode] = useState<AuthMode>(mode);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if(currentMode === "signup") {
            if(!name) {
                newErrors.name = "Name is required";
            } else if(name.length < 2) {
                newErrors.name = "Name must be at least 2 characters";
            }
        }

        if(!email) {
            newErrors.email = "Email is required";
        } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if(!password) {
            newErrors.password = "Password is required";
        } else if(password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if(currentMode === "signup") {
            if(!confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password";
            } else if(password !== confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if(!validateForm()) return;

        setIsLoading(true);

        try {
            const isLogin = currentMode === "login";
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
            const payload = isLogin
                ? {email, password}
                : {email, password, full_name: name};

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Auth error:", errorData);
                alert(`${isLogin ? "Login" : "Registration"} failed. Please try again.`);
                return;
            }

            const data = await response.json();
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("user_info", JSON.stringify(data.user));

            onSuccess?.();

            window.dispatchEvent(new Event("local-storage"));
        } catch(error) {
            console.error("Auth error:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Authentication failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        const newMode = currentMode === "login" ? "signup" : "login";
        setCurrentMode(newMode);
        onModeChange?.(newMode);
        setErrors({});
        setName("");
        setConfirmPassword("");
    };

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
            <div className="w-full max-w-md bg-card shadow-2xl rounded-lg p-8 relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-card-foreground">
                        {currentMode === "login" ? "Welcome back" : "Create account"}
                    </h1>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center text-muted-foreground transition-transform hover:scale-110"
                    >
                        <IconX size={16}/>
                    </button>
                </div>

                <p className="text-muted-foreground mb-8">
                    {currentMode === "login"
                        ? "Sign in to your account"
                        : "Sign up to get started"
                    }
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {currentMode === "signup" && (
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-card-foreground mb-2"
                            >
                                Full name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                                placeholder="Enter your full name"
                                autoComplete="name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-card-foreground mb-2"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                            placeholder="Enter your email"
                            autoComplete="email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-card-foreground mb-2"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                            placeholder="Enter your password"
                            autoComplete={currentMode === "login" ? "current-password" : "new-password"}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {currentMode === "signup" && (
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-card-foreground mb-2"
                            >
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                {currentMode === "login" ? "Signing in..." : "Creating account..."}
                            </div>
                        ) : (
                            currentMode === "login" ? "Sign in" : "Create account"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        {currentMode === "login" ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="font-medium text-foreground hover:text-muted-foreground transition-colors"
                        >
                            {currentMode === "login" ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export {
    AuthForm,
    type UserInfo
};
