"use client";

import Link from "next/link";
import { IconCirkl } from "./ui/icons";
import {IconScan, IconLogout, IconHome } from "@tabler/icons-react";
import { useState } from "react";
import { UserInfo, AuthForm } from "./auth-form";

const headerItems = [
    {
        label: "Home",
        icon: <IconHome size={18} />,
        href: "/",
    },
    {
        label: "New Scan",
        icon: <IconScan size={18} />,
        href: "/dashboard",
    },
];

export default function Header({
                                   userInfo,
                               }: {
    userInfo: UserInfo | null;
}) {
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_info");
        window.dispatchEvent(new Event("local-storage"));
    };

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
    };

    return (
        <>
            {showAuthModal && (
                <AuthForm
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={handleAuthSuccess}
                />
            )}

            <header className="fixed top-0 left-0 w-full h-20 border-b select-none bg-background backdrop-blur-xl border-border grid grid-cols-3 items-center px-6 z-1000">
                <div className="flex items-center gap-4">
                    <Link href="/" className="hidden md:block">
                        <div className="flex items-center gap-2 flex-row">
                            <IconCirkl size={24} />
                            <h1 className="text-2xl font-bold">Cirkl</h1>
                        </div>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center justify-center">
                    <ul className="flex gap-4">
                        {headerItems.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-2 p-2 rounded-md hover:bg-secondary`}
                                    title={item.label}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center justify-end">
                    {userInfo ? (
                        <div className={`flex items-center gap-3`}>
                            <div className="hidden md:block overflow-hidden">
                                <p className="font-semibold text-sm truncate">
                                    {userInfo.full_name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {userInfo.email}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm shrink-0" title={userInfo.full_name}>
                                {userInfo.full_name.charAt(0)}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-md hover:bg-secondary"
                                title="Logout"
                            >
                                <IconLogout size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="text-center p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            title="Login / Register"
                        >
                            Login / Register
                        </button>
                    )}
                </div>
            </header>
        </>
    );
}
