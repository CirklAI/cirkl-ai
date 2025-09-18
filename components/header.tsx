"use client";
import { IconLogout } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconCirkl } from "./ui/icons";
import { UserInfo, AuthForm } from "@/components/auth-form";

export default function Header() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userButtonRef = useRef<HTMLButtonElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem("user_info");
        if (storedUserInfo) {
            try {
                setUserInfo(JSON.parse(storedUserInfo));
            } catch (error) {
                console.error("Failed to parse user info:", error);
                localStorage.removeItem("user_info");
                localStorage.removeItem("auth_token");
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node) &&
                userButtonRef.current &&
                !userButtonRef.current.contains(event.target as Node)
            ) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAuthSubmit = async (email: string, password: string, confirmPassword?: string, name?: string) => {
        try {
            const isLogin = !name;
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

            const payload = isLogin ? { email, password } : { email, password, full_name: name };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Auth error:", errorData);

                if (response.status === 409) {
                    alert("User already exists. Please log in or use a different email.");
                    return;
                } else if (response.status === 401) {
                    alert("Email or password incorrect!");
                    return;
                } else if (response.status === 400) {
                    alert("Invalid request. Please check your input and try again.");
                    return;
                } else if (response.status === 429) {
                    alert("Too many requests. Please wait before trying again.");
                    return;
                } else {
                    alert(`${isLogin ? "Login" : "Registration"} failed. Please try again.`);
                    return;
                }
            }

            const data = await response.json();

            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("user_info", JSON.stringify(data.user));

            setUserInfo(data.user);
            setShowAuthModal(false);
        } catch (error) {
            console.error("Auth error:", error);
            alert(error instanceof Error ? error.message : "Authentication failed. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_info");
        setUserInfo(null);
        setShowUserMenu(false);
    };

    return (
        <>
            <header
                className="fixed top-0 left-0 w-full h-12 border-b-2 bg-black/40 backdrop-blur-xl border-sidebar-border flex items-center px-12 z-[1000]">
                <div className="flex items-center mr-12 ml-8">
                    <Link href="/">
                        <IconCirkl size={18} />
                    </Link>
                </div>

                <nav className="flex items-center gap-4">
                    <Link href="/" className="hover:text-neutral-200 transition-colors duration-200 text-neutral-400 text-sm">
                        Home
                    </Link>
                    <Link href="/dashboard" className="hover:text-neutral-200 transition-colors duration-200 text-neutral-400 text-sm">
                        Scan
                    </Link>

                    {userInfo ? (
                        <div className="relative">
                            <p
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="hover:text-neutral-200 transition-colors duration-200 text-neutral-400 underline-none text-sm cursor-pointer"
                            >
                                Account
                            </p>
                            {showUserMenu && (
                                <div
                                    ref={userMenuRef}
                                    className="absolute top-12 left-0 w-40 p-2 rounded-md shadow-lg bg-popover border-border z-50 flex flex-col gap-1"
                                >
                                    <div className="p-2 text-center text-sm truncate">{userInfo.full_name}</div>
                                    <p
                                        onClick={handleLogout}
                                        className="text-neutral-400 underline-none text-left text-sm cursor-pointer"
                                    >
                                        <IconLogout size={16} className="inline mr-1" />
                                        Logout
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p
                            onClick={() => setShowAuthModal(true)}
                            className="hover:text-neutral-200 transition-colors duration-200 text-neutral-400 underline-none text-sm cursor-pointer"
                        >
                            Account
                        </p>
                    )}
                </nav>
            </header>
            {showAuthModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-md w-full">
                        <AuthForm
                            onSubmit={handleAuthSubmit}
                            onClose={() => setShowAuthModal(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
