"use client";
import { IconHome, IconShield, IconUser, IconLogout } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ButtonIcon from "./ui/button-icon";
import { IconCirkl } from "./ui/icons";
import { ThemeToggle } from "./ui/theme-toggle";
import { UserInfo, AuthForm } from "@/components/auth-form";

export default function Sidebar() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userButtonRef = useRef<HTMLButtonElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('user_info');
        if (storedUserInfo) {
            try {
                setUserInfo(JSON.parse(storedUserInfo));
            } catch (error) {
                console.error("Failed to parse user info:", error);
                localStorage.removeItem('user_info');
                localStorage.removeItem('auth_token');
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
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

            const payload = isLogin
                ? { email, password }
                : { email, password, full_name: name };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Auth error:", errorData);

                if (response.status === 409) {
                    alert("User already exists. Please try logging in instead or use a different email address.");
                    return;
                } else if (response.status === 401) {
                    alert("Unauthorized? Something is amiss.");
                    return;
                } else if (response.status === 400) {
                    alert("Invalid request. Please check your input and try again.");
                    return;
                } else if (response.status === 429) {
                    alert("Too many requests. Please wait before trying again.");
                    return;
                } else {
                    alert(`${isLogin ? 'Login' : 'Registration'} failed. Please try again.`);
                    return;
                }
            }

            const data = await response.json();

            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_info', JSON.stringify(data.user));

            setUserInfo(data.user);
            setShowAuthModal(false);
        } catch (error) {
            console.error("Auth error:", error);
            alert(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        setUserInfo(null);
        setShowUserMenu(false);
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 w-full border-t bg-sidebar border-sidebar-border md:top-0 md:w-26 md:h-screen md:border-r flex md:flex-col items-center z-[1000]">
                <div className="hidden md:flex items-center justify-center p-4">
                    <IconCirkl size={32} />
                </div>

                <nav className="hidden md:flex md:flex-col items-center gap-2 w-full mt-4">
                    <Link href="/">
                        <ButtonIcon icon={IconHome} title="Home" size={24} />
                    </Link>
                    <Link href="/dashboard">
                        <ButtonIcon icon={IconShield} title="Dashboard" size={24} />
                    </Link>
                </nav>

                <nav className="flex md:hidden items-center justify-around w-full p-1">
                    <Link href="/">
                        <ButtonIcon icon={IconHome} title="Home" size={24} />
                    </Link>
                    <Link href="/dashboard">
                        <ButtonIcon icon={IconShield} title="Dashboard" size={24} />
                    </Link>
                    {userInfo ? (
                        <div className="relative">
                            <button
                                ref={userButtonRef}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex flex-col items-center p-2 rounded-lg hover:bg-muted-foreground/10 transition-colors"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm">
                                    <span className="text-xl font-bold">
                                        {userInfo.full_name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </button>
                            {showUserMenu && (
                                <div
                                    ref={userMenuRef}
                                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 p-2 rounded-md shadow-lg bg-popover border-border z-50 flex flex-col gap-1"
                                >
                                    <div className="p-2 text-center text-sm text-foreground truncate">
                                        {userInfo.full_name}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 p-2 w-full text-left rounded-md hover:bg-popover-hover text-destructive"
                                    >
                                        <IconLogout size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <ButtonIcon
                            icon={IconUser}
                            title="Authenticate"
                            size={24}
                            onClick={() => setShowAuthModal(true)}
                        />
                    )}
                    <ThemeToggle />
                </nav>

                <div className="hidden md:flex flex-col items-center mt-auto mb-2 relative">
                    {userInfo ? (
                        <div className="flex flex-col items-center gap-2">
                            <button
                                ref={userButtonRef}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex flex-col items-center p-2 rounded-lg hover:bg-muted-foreground/10 transition-colors"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm">
                                    <span className="text-xl font-bold">
                                        {userInfo.full_name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-xs mt-1 truncate w-20 text-center">
                                    {userInfo.full_name.split(" ")[0]}
                                </div>
                            </button>
                            {showUserMenu && (
                                <div
                                    ref={userMenuRef}
                                    className="absolute ml-8 bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-40 p-2 rounded-md shadow-lg bg-popover border-border z-50 flex flex-col gap-1"
                                >
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 p-2 w-full text-left rounded-md hover:bg-popover-hover text-destructive"
                                    >
                                        <IconLogout size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <ButtonIcon
                            icon={IconUser}
                            title="Authenticate"
                            size={24}
                            onClick={() => setShowAuthModal(true)}
                        />
                    )}
                    <ThemeToggle />
                </div>
            </div>

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